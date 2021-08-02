import { Contract } from "ethers";
import { ISignerOrProvider } from "../@types";

import CapProviderABI from "./abis/CapProvider.json";
import ConfigurationManagerABI from "./abis/ConfigurationManager.json";
import ERC20ABI from "./abis/ERC20.json";
import PoolFactoryABI from "./abis/OptionAMMFactory.json";
import PoolABI from "./abis/OptionAMMPool.json";
import OptionFactoryABI from "./abis/OptionFactory.json";
import OptionHelperABI from "./abis/OptionHelper.json";
import OptionABI from "./abis/WPodPut.json";

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
