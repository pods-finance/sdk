import BigNumber from "bignumber.js";
import Web3 from "web3";

import { IToken } from "./token";
import { IValue } from "./value";

export interface IPoolIndicators {
  impliedVolatility?: IValue;
  totalBalanceA?: IValue;
  totalBalanceB?: IValue;
  deamortizedBalanceA?: IValue;
  deamortizedBalanceB?: IValue;
  fImp?: IValue;
  feeAmountPoolA?: IValue;
  feeAmountPoolB?: IValue;
}

export interface IPoolMetrics {}

export interface IPool {
  readonly address: string;
  readonly networkId: number;

  readonly tokenA: IToken;
  readonly tokenB: IToken;

  readonly factoryAddress: string;
  readonly optionAddress: string;

  getParameters(params: { web3: Web3 }): Promise<IPoolIndicators>;
  getMetrics(params: { web3: Web3 }): Promise<IPoolMetrics>;

  getIV(params: { web3: Web3 }): Promise<IValue>;
  getBuyingPrice(
    params: { web3: Web3; amount: BigNumber; isPadded: boolean },
    padding: number | null
  ): Promise<IValue>;
  getBuyingEstimateForPrice(
    params: { web3: Web3; amount: BigNumber; isPadded: boolean },
    padding: number | null
  ): Promise<IValue>;
  getSellingPrice(
    params: { web3: Web3; amount: BigNumber },
    padding: number | null
  ): Promise<IValue>;
  getTotalBalances(params: { web3: Web3 }): Promise<IValue[]>;
  getDeamortizedBalances(params: {
    web3: Web3;
    amount: BigNumber;
  }): Promise<IValue[]>;
  getFeeBalances(params: { web3: Web3; amount: BigNumber }): Promise<IValue[]>;
}
