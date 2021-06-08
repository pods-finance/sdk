import BigNumber from "bignumber.js";
import Web3 from "web3";

import { IOption } from "./option";
import { IToken } from "./token";
import { IValue } from "./value";
import { IPoolBuilderParams } from "./poolBuilder";

export interface IPoolIndicators {
  impliedVolatility?: IValue;
  totalBalanceA?: IValue;
  totalBalanceB?: IValue;
  deamortizedBalanceA?: IValue;
  deamortizedBalanceB?: IValue;
  feeAmountPoolA?: IValue;
  feeAmountPoolB?: IValue;
  abPrice?: IValue;
  fImp?: IValue;
}

export interface IPoolMetrics {}

export interface IPool {
  readonly address: string;
  readonly networkId: number;

  web3?: Web3;

  tokenA?: IToken;
  tokenB?: IToken;

  factoryAddress?: string;
  optionAddress?: string;

  option?: IOption;

  init(params: IPoolBuilderParams): IPool;

  getParameters(params: { web3?: Web3 }): Promise<IPoolIndicators>;

  getIV(params: { web3?: Web3 }): Promise<IValue>;
  getABPrice(params: { web3?: Web3 }): Promise<IValue>;
  getBuyingPrice(params: { amount: BigNumber; web3?: Web3 }): Promise<IValue>;
  getBuyingEstimateForPrice(params: {
    amount: BigNumber;
    web3?: Web3;
  }): Promise<IValue>;
  getSellingPrice(params: { amount: BigNumber; web3?: Web3 }): Promise<IValue>;
  getTotalBalances(params: { web3?: Web3 }): Promise<IValue[]>;
  getDeamortizedBalances(params: { web3?: Web3 }): Promise<IValue[]>;
  getFeeBalances(params: { amount: BigNumber; web3?: Web3 }): Promise<IValue[]>;

  getCap(params: { manager: string; web3?: Web3 }): Promise<IValue>;
  getUserPosition(params: { user: string; web3?: Web3 }): Promise<IValue[]>;
}
