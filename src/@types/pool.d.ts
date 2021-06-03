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

  getParameters(): Promise<IPoolIndicators>;

  getIV(): Promise<IValue>;
  getABPrice(): Promise<IValue>;
  getBuyingPrice(params: { amount: BigNumber }): Promise<IValue>;
  getBuyingEstimateForPrice(params: { amount: BigNumber }): Promise<IValue>;
  getSellingPrice(params: { amount: BigNumber }): Promise<IValue>;
  getTotalBalances(): Promise<IValue[]>;
  getDeamortizedBalances(): Promise<IValue[]>;
  getFeeBalances(params: { amount: BigNumber }): Promise<IValue[]>;

  getCap(params: { manager: string }): Promise<IValue>;
  getUserPosition(params: { user: string }): Promise<IValue[]>;
}
