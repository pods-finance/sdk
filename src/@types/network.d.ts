export interface INetwork {
  supported: boolean;
  chainId: number;
  networkId: number;
  name: string;
  chain: string;
  network: string;
  tag: string;
  token: {
    utility: string[];
    wrapped: string[];
    name: string;
    symbol: string;
    decimals: number;
  };
  subgraph: {
    prod: string;
    dev: string;
  };
  rpc: string[];
  faucet?: string;
  explorer: string;
  infura: (key: string) => string;
  multicall2: string;
}
