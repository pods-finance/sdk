import { INetwork } from "@types";
import _ from "lodash";
import chains from "../utils/chains.json";

const NETWORK_ETHEREUM_ID = 1;
const NETWORK_GOERLI_ID = 5;
const NETWORK_OPTIMISM_ID = 10;
const NETWORK_KOVAN_ID = 42;
const NETWORK_BSC_ID = 56;
const NETWORK_MATIC_ID = 137;
const NETWORK_FANTOM_ID = 250;
const NETWORK_ARBITRUM_ID = 42161;
const NETWORK_AVALANCHE_ID = 43114;
const NETWORK_NUCLEA_ID = 22842;

function inline(id: number): INetwork {
  const chain = chains.find((item) => _.get(item, "chainId") === id);
  return (chain || {}) as INetwork;
}

const _networks: { [key: number]: INetwork } = {
  /** The networks datapoint will include all available chains as per the ChainList standards */
  ...chains.reduce(
    (previous, current) => ({
      ...previous,
      [_.get(current, "chainId")]: current,
    }),
    {}
  ),
  /** Custom functionality for the chain body e.g. subgraph or endpoint will be added below as needed */
  [NETWORK_ETHEREUM_ID]: {
    ...inline(NETWORK_ETHEREUM_ID),
    name: "Mainnet",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    subgraph: "https://api.thegraph.com/subgraphs/name/pods-finance/pods",
    explorer: "https://etherscan.io",
    endpoint: (key) => `https://mainnet.infura.io/v3/${key}`,
    multicall2: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
  },
  [NETWORK_GOERLI_ID]: {
    ...inline(NETWORK_GOERLI_ID),
    name: "Goerli",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: [],
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    subgraph:
      "https://api.thegraph.com/subgraphs/name/pods-finance/pods-goerli",
    explorer: "https://goerli.etherscan.io",
    endpoint: (key) => `https://goerli.infura.io/v3/${key}`,
    multicall2: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
  },
  [NETWORK_NUCLEA_ID]: {
    ...inline(NETWORK_NUCLEA_ID),
    name: "Nuclea",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0x4200000000000000000000000000000000000006"],
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    subgraph:
      "https://api.thegraph.com/subgraphs/name/pods-finance/pods-optimism",
    explorer: "https://optimistic.etherscan.io",
    endpoint: (key) => `https://optimism-mainnet.infura.io/v3/${key}`,
    multicall2: "0x2DC0E2aa608532Da689e89e237dF582B783E552C",
  },
  [NETWORK_OPTIMISM_ID]: {
    ...inline(NETWORK_OPTIMISM_ID),
    name: "Optimism",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0x4200000000000000000000000000000000000006"],
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    subgraph:
      "https://api.thegraph.com/subgraphs/name/pods-finance/pods-optimism",
    explorer: "https://optimistic.etherscan.io",
    endpoint: (key) => `https://optimism-mainnet.infura.io/v3/${key}`,
    multicall2: "0x2DC0E2aa608532Da689e89e237dF582B783E552C",
  },
  [NETWORK_KOVAN_ID]: {
    ...inline(NETWORK_KOVAN_ID),
    name: "Kovan",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0x824b1e309c4eb33501fb49f5de9cb7481686a799"],
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    subgraph: "https://api.thegraph.com/subgraphs/name/pods-finance/pods-kovan",
    explorer: "https://kovan.etherscan.io",
    faucet: "https://faucet.kovan.network",
    endpoint: (key) => `https://kovan.infura.io/v3/${key}`,
    multicall2: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
  },
  [NETWORK_BSC_ID]: {
    ...inline(NETWORK_BSC_ID),
    name: "BSC",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"],
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    subgraph: "https://api.thegraph.com/subgraphs/name/pods-finance/pods-bsc",
    explorer: "https://bscscan.io",
    endpoint: () => `https://bsc-dataseed1.ninicoin.io/`,
    isEndpointRaw: true,
    multicall2: "0xed386Fe855C1EFf2f843B910923Dd8846E45C5A4",
  },
  [NETWORK_MATIC_ID]: {
    ...inline(NETWORK_MATIC_ID),
    name: "Polygon",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"],
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    subgraph: "https://api.thegraph.com/subgraphs/name/pods-finance/pods-matic",
    explorer: "https://polygonscan.com",
    endpoint: (key) => `https://polygon-mainnet.infura.io/v3/${key}`,
    multicall2: "0x275617327c958bd06b5d6b871e7f491d76113dd8",
  },
  [NETWORK_FANTOM_ID]: {
    ...inline(NETWORK_FANTOM_ID),
    name: "Fantom",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83"],
      name: "FTM",
      symbol: "FTM",
      decimals: 18,
    },
    subgraph:
      "https://api.thegraph.com/subgraphs/name/pods-finance/pods-fantom",
    explorer: "https://ftmscan.com",
    endpoint: () => `https://rpc.ftm.tools/`,
    isEndpointRaw: true,
    multicall2: "0xD98e3dBE5950Ca8Ce5a4b59630a5652110403E5c",
  },
  [NETWORK_ARBITRUM_ID]: {
    ...inline(NETWORK_ARBITRUM_ID),
    name: "Arbitrum",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0x82af49447d8a07e3bd95bd0d56f35241523fbab1"],
      name: "Ether",
      symbol: "AETH",
      decimals: 18,
    },
    subgraph:
      "https://api.thegraph.com/subgraphs/name/pods-finance/pods-arbitrum",
    explorer: "https://arbiscan.io",
    endpoint: (key) => `https://arbitrum-mainnet.infura.io/v3/${key}`,
    multicall2: "0x842eC2c7D803033Edf55E478F461FC547Bc54EB2",
  },
  [NETWORK_AVALANCHE_ID]: {
    ...inline(NETWORK_AVALANCHE_ID),
    name: "Avalanche",
    token: {
      utility: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
      wrapped: ["0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"],
      name: "Avax",
      symbol: "AVAX",
      decimals: 18,
    },
    subgraph:
      "https://api.thegraph.com/subgraphs/name/pods-finance/pods-avalanche",
    explorer: "https://snowtrace.io",
    endpoint: () => `https://api.avax.network/ext/bc/C/rpc`,
    isEndpointRaw: true,
    multicall2: "0xed386Fe855C1EFf2f843B910923Dd8846E45C5A4", // backup: 0x8755b94F88D120AB2Cc13b1f6582329b067C760d
  },
};

const networks: { [key: string]: INetwork } = {
  ..._networks,
  mainnet: _networks[NETWORK_ETHEREUM_ID],
  goerli: _networks[NETWORK_GOERLI_ID],
  optimism: _networks[NETWORK_OPTIMISM_ID],
  kovan: _networks[NETWORK_KOVAN_ID],
  bsc: _networks[NETWORK_BSC_ID],
  matic: _networks[NETWORK_MATIC_ID],
  fantom: _networks[NETWORK_FANTOM_ID],
  arbitrum: _networks[NETWORK_ARBITRUM_ID],
  avalanche: _networks[NETWORK_AVALANCHE_ID],
};

export { chains };
export default networks;
