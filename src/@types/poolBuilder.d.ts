import BigNumber from "bignumber.js";
import Web3 from "web3";

export interface IPoolBuilderParams {
  address?: string;
  networkId?: number;

  web3?: Web3;

  factoryAddress: string;
  optionAddress: string;

  tokenA: string;
  tokenADecimals: BigNumber;
  tokenASymbol: string;

  tokenB: string;
  tokenBDecimals: BigNumber;
  tokenBSymbol: string;
}

export interface IPoolBuilder {}
