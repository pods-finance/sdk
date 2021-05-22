import Web3 from "web3";

function getInfuraInstance(): Web3 {
  return new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT_KOVAN || "")
  );
}

const web3 = {
  getInfuraInstance,
};

export default web3;
