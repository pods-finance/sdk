import { IProvider } from "@types";
import { ethers } from "ethers";
import { networks } from "../../constants";

function getBaseProvider(
  networkId: number,
  keys: {
    infura?: any;
  }
): IProvider {
  const network = networks[networkId];

  if (network.isEndpointRaw)
    return new ethers.providers.JsonRpcProvider(network.endpoint());

  return ethers.providers.getDefaultProvider(
    network.endpoint(keys.infura)
  ) as ethers.providers.Web3Provider;
}

function toEthersProvider(
  web3Provider: ethers.providers.ExternalProvider
): ethers.providers.Provider {
  return new ethers.providers.Web3Provider(web3Provider);
}

const provider = {
  getBaseProvider,
  toEthersProvider,
};

export default provider;
