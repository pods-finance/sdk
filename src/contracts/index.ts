import { Contract } from "ethers";
import { ISignerOrProvider } from "../@types";

import CapProviderABI from "./abis/capProviderABI.json";
import ConfigurationManagerABI from "./abis/configurationManagerABI.json";
import ERC20ABI from "./abis/erc20ABI.json";
import PoolFactoryABI from "./abis/optionAMMFactoryABI.json";
import PoolABI from "./abis/optionAMMPoolABI.json";
import OptionFactoryABI from "./abis/optionFactoryABI.json";
import OptionHelperABI from "./abis/optionHelperABI.json";
import OptionABI from "./abis/wPodPutABI.json";

function instance(
  provider: ISignerOrProvider,
  address: string,
  abi: any
): Contract {
  return new Contract(address, abi, provider);
}

const instances = {
  capProvider: (provider: ISignerOrProvider, address: string): Contract =>
    instance(provider, address, CapProviderABI),
  configurationManager: (
    provider: ISignerOrProvider,
    address: string
  ): Contract => instance(provider, address, ConfigurationManagerABI),
  erc20: (provider: ISignerOrProvider, address: string): Contract =>
    instance(provider, address, ERC20ABI),
  poolFactory: (provider: ISignerOrProvider, address: string): Contract =>
    instance(provider, address, PoolFactoryABI),
  pool: (provider: ISignerOrProvider, address: string): Contract =>
    instance(provider, address, PoolABI),
  optionFactory: (provider: ISignerOrProvider, address: string): Contract =>
    instance(provider, address, OptionFactoryABI),
  optionHelper: (provider: ISignerOrProvider, address: string): Contract =>
    instance(provider, address, OptionHelperABI),
  option: (provider: ISignerOrProvider, address: string): Contract =>
    instance(provider, address, OptionABI),
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
