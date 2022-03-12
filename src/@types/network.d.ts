export interface INetwork {
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
  subgraph: string;
  rpc: string[];
  faucet?: string;
  explorer: string;
  endpoint: (key?: string) => string;
  isEndpointRaw: boolean;
  multicall2: string;
}
