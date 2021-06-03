import Web3 from "web3";

function getInfuraInstance(key: string): Web3 {
  return new Web3(new Web3.providers.HttpProvider(key));
}

const web3 = {
  getInfuraInstance,
};

export default web3;
