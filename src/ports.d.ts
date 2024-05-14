/* This file was generated by github.com/ronanyeah/elm-port-gen */

interface ElmApp {
  ports: Ports;
}

interface Ports {
  log: PortOut<string>;
  copy: PortOut<string>;
  registerMiner: PortOut<null>;
  importWallet: PortOut<string | null>;
  claim: PortOut<{
    miner: string;
    amount: number;
    recipient: string;
  }>;
  submitProof: PortOut<{
    proof: Proof;
    miner: string;
  }>;
  mine: PortOut<string>;
  refreshTokens: PortOut<null>;
  fetchStats: PortOut<null>;
  stopMining: PortOut<null>;
  clearWallet: PortOut<null>;
  minerAccountCb: PortIn<Miner>;
  minerCreatedCb: PortIn<Miner>;
  statusCb: PortIn<string>;
  miningError: PortIn<string>;
  balancesCb: PortIn<Balances | null>;
  walletCb: PortIn<Keypair>;
  claimCb: PortIn<any>;
  proofCb: PortIn<Proof>;
  hashCountCb: PortIn<number>;
  statsCb: PortIn<Stats>;
  retrySubmitProof: PortIn<{
    proof: Proof;
    miner: string;
  }>;
}

interface PortOut<T> {
  subscribe: (_: (_: T) => void) => void;
}

interface PortIn<T> {
  send: (_: T) => void;
}

interface Balances {
  mineral: number;
  sui: number;
}

interface Miner {
  address: string;
  claims: number;
}

interface Keypair {
  pub: string;
  pvt: string;
}

interface Proof {
  currentHash: number[];
  nonce: number;
}

interface Stats {
  totalHashes: number;
  totalRewards: number;
  rewardRate: number;
}

export { ElmApp, Balances, Miner, Keypair, Proof, Stats };