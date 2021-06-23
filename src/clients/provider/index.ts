import ethers from "ethers";

function getInfuraProvider(
  network: string,
  key: string
): ethers.providers.InfuraProvider {
  return new ethers.providers.InfuraProvider(network, key);
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
