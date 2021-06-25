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
  subgraph?: {
    prod: string;
    dev: string;
  };
}
