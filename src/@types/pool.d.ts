import BigNumber from "bignumber.js";

import { IProvider } from "./atoms";
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

  provider?: IProvider;

  tokenA?: IToken;
  tokenB?: IToken;

  factoryAddress?: string;
  optionAddress?: string;

  option?: IOption;

  init(params: IPoolBuilderParams): IPool;

  getParameters(params?: { provider?: IProvider }): Promise<IPoolIndicators>;

  getIV(params?: { provider?: IProvider }): Promise<IValue>;
  getABPrice(params?: {
    provider?: IProvider;
  }): Promise<{ [key: string]: IValue }>;
  getBuyingPrice(params: {
    amount: BigNumber;
    provider?: IProvider;
  }): Promise<{ [key: string]: IValue }>;
  getBuyingEstimateForPrice(params: {
    amount: BigNumber;
    provider?: IProvider;
  }): Promise<{ [key: string]: IValue }>;
  getSellingPrice(params: {
    amount: BigNumber;
    provider?: IProvider;
  }): Promise<{ [key: string]: IValue }>;
  getTotalBalances(params?: { provider?: IProvider }): Promise<IValue[]>;
  getDeamortizedBalances(params?: { provider?: IProvider }): Promise<IValue[]>;
  getFeeBalances(params: {
    amount: BigNumber;
    provider?: IProvider;
  }): Promise<IValue[]>;

  getCap(params: { manager: string; provider?: IProvider }): Promise<IValue>;
  getUserPosition(params: {
    user: string;
    provider?: IProvider;
  }): Promise<IValue[]>;
}
