import Web3 from "web3";
import CapProviderABI from "./abis/capProviderABI.json";
import ConfigurationManagerABI from "./abis/configurationManagerABI.json";
import ERC20ABI from "./abis/erc20ABI.json";
import PoolFactoryABI from "./abis/optionAMMFactoryABI.json";
import PoolABI from "./abis/optionAMMPoolABI.json";
import OptionFactoryABI from "./abis/optionFactoryABI.json";
import OptionHelperABI from "./abis/optionHelperABI.json";
import OptionABI from "./abis/wPodPutABI.json";

function instance(web3: Web3, address: string, abi: any) {
  const { Contract } = web3.eth;
  return new Contract(abi, address);
}

const instances = {
  capProvider: (web3: Web3, address: string) =>
    instance(web3, address, CapProviderABI),
  configurationManager: (web3: Web3, address: string) =>
    instance(web3, address, ConfigurationManagerABI),
  erc20: (web3: Web3, address: string) => instance(web3, address, ERC20ABI),
  poolFactory: (web3: Web3, address: string) =>
    instance(web3, address, PoolFactoryABI),
  pool: (web3: Web3, address: string) => instance(web3, address, PoolABI),
  optionFactory: (web3: Web3, address: string) =>
    instance(web3, address, OptionFactoryABI),
  optionHelper: (web3: Web3, address: string) =>
    instance(web3, address, OptionHelperABI),
  option: (web3: Web3, address: string) => instance(web3, address, OptionABI),
};

const abis = {
  CapProviderABI,
  ConfigurationManagerABI,
  ERC20ABI,
  PoolFactoryABI,
  PoolABI,
  OptionFactoryABI,
  OptionHelperABI,
  OptionABI,
};

const contracts = {
  abis,
  instances,
};

export default contracts;
