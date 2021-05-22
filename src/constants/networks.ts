import { INetwork } from "@types";

const chains = {
  polygon: "Polygon",
  ethereum: "Ethereum",
};

const _networks: { [key: number]: INetwork } = {
  1: {
    chainId: 1,
    networkId: 1,
    name: "Mainnet",
    chain: chains.ethereum,
    network: "mainnet",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    subgraph: {
      prod: "https://api.thegraph.com/subgraphs/name/pods-finance/pods",
      dev: "https://api.thegraph.com/subgraphs/name/pods-finance/pods-dev",
    },
  },
  42: {
    chainId: 42,
    networkId: 42,
    name: "Kovan",
    chain: chains.ethereum,
    network: "testnet",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0x824b1e309c4eb33501fb49f5de9cb7481686a799"],
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    subgraph: {
      prod: "https://api.thegraph.com/subgraphs/name/pods-finance/pods-kovan",
      dev:
        "https://api.thegraph.com/subgraphs/name/pods-finance/pods-kovan-dev",
    },
  },
  137: {
    chainId: 137,
    networkId: 137,
    name: "Matic",
    chain: chains.polygon,
    network: "mainnet",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"],
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    subgraph: {
      prod: "https://api.thegraph.com/subgraphs/name/pods-finance/pods-matic",
      dev:
        "https://api.thegraph.com/subgraphs/name/pods-finance/pods-matic-dev",
    },
  },
  80001: {
    chainId: 80001,
    networkId: 80001,
    name: "Mumbai",
    chain: chains.polygon,
    network: "testnet",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0xfe7f1ef1386e6df3d462e30aa5709fb5ef647ec9"],
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    subgraph: {
      prod: "https://api.thegraph.com/subgraphs/name/pods-finance/pods-mumbai",
      dev:
        "https://api.thegraph.com/subgraphs/name/pods-finance/pods-mumbai-dev",
    },
  },
  1337: {
    chainId: 1337,
    networkId: 1337,
    name: "Local",
    chain: chains.ethereum,
    network: "testnet",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: [],
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
};

const networks: { [key: string]: INetwork } = {
  ..._networks,
  mainnet: _networks[1],
  kovan: _networks[42],
  matic: _networks[137],
  mumbai: _networks[80001],
  local: _networks[1337],
};

export { chains };
export default networks;
