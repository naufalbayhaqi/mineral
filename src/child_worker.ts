/* eslint-disable fp/no-loops, fp/no-mutation, fp/no-mutating-methods, fp/no-let, no-constant-condition */
// import { validateHash, createHash } from './common';
import { keccak } from 'hash-wasm';

function validateHash(hash: Uint8Array, difficulty: number) {
    return hash.slice(0, difficulty).reduce((a, b) => a + b, 0) === 0;
}

export function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let c = 0, i = 0; c < hex.length; c += 2, i++)
        bytes[i] = parseInt(hex.slice(c, c + 2), 16);
    return bytes;
}

function int64to8(n: bigint) {
    const arr = BigUint64Array.of(n);
    return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
}

async function createHash(
    currentHash: Uint8Array,
    signerAddressBytes: Uint8Array,
    nonce: bigint
): Promise<Uint8Array> {
    const dataToHash = new Uint8Array(32 + 32 + 8);
    dataToHash.set(currentHash, 0);
    dataToHash.set(signerAddressBytes, 32);
    dataToHash.set(int64to8(nonce), 64);
    const bts = await keccak(dataToHash, 256);
    return hexToBytes(bts);
}

import { isMainThread, parentPort } from 'worker_threads';

//NOTE: 用来判断当前线程是否是主线程
if (isMainThread) {
    // Main thread code, if any
} else {
    parentPort?.on('message', async (event) => {
        const {
            startNonce,
            currentHash,
            signerBytes,
            difficulty,
            jobId,
            nonceRange,
        } = event;
        let nonce = BigInt(startNonce);
        let nonceCount = 0; // 全局计数器，用于跟踪处理的nonce数量

        while (nonceCount < nonceRange) {
            nonceCount++;
            const hash = await createHash(currentHash, signerBytes, nonce);
            const isValid = validateHash(hash, difficulty);

            if (isValid) {
                console.log('Found valid nonce:', nonce, hash, jobId, difficulty);
                parentPort?.postMessage({ nonce: nonce, isValid, jobId });
                return; // 结束当前worker的工作
            }
            nonce += BigInt(1);
        }
        // 完成当前范围，请求新的nonce起始值
        parentPort?.postMessage({
            requestNewNonce: true,
            lastNonce: nonce,
            jobId,
        });
    });
}
