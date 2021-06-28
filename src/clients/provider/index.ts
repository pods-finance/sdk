import { networks } from "../../constants";
import { ethers } from "ethers";

function getInfuraProvider(
  networkId: number,
  key: string
): ethers.providers.InfuraProvider {
  const network = networks[networkId];
  return ethers.providers.getDefaultProvider(
    network.infura(key)
  ) as ethers.providers.InfuraProvider;
}

function toEthersProvider(
  web3Provider: ethers.providers.ExternalProvider
): ethers.providers.Provider {
  return new ethers.providers.Web3Provider(web3Provider);
}

const provider = {
  getInfuraProvider,
  toEthersProvider,
};

export default provider;
