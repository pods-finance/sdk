import { ethers } from "ethers";
import { networks } from "../../constants";

function getInfuraProvider(
  networkId: number,
  key: string
): ethers.providers.InfuraProvider {
  const tag = (networks[networkId] || {}).tag;

  return new ethers.providers.InfuraProvider(tag, key);
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
