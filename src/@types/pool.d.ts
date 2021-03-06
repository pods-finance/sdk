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

export interface IPoolGeneralMetrics {
  sellingPrice?: { [key: string]: IValue };
  buyingPrice?: { [key: string]: IValue };
  abPrice?: { [key: string]: IValue };
  IV?: IValue;
  adjustedIV?: IValue;
  totalBalances?: IValue[];
  userPositions?: IValue[];
  userOptionWithdrawAmounts?: IValue[];
  userOptionMintedAmount?: IValue;
  userOptionBalance?: IValue;
  totalSupply?: IValue;
  rebalancePrice?: { [key: string]: IValue | unknown };

  optionUnderlyingBalance?: IValue;
  optionStrikeBalance?: IValue;

  userFeeWithdrawAmounts?: IValue[];
}

export interface IPool {
  readonly address: string;
  readonly networkId: number;

  provider?: IProvider;

  tokenA?: IToken;
  tokenB?: IToken;

  factoryAddress?: string;
  optionAddress?: string;

  feePoolAAddress?: string;
  feePoolBAddress?: string;

  option?: IOption;

  init(params: IPoolBuilderParams): IPool;

  getParameters(params?: { provider?: IProvider }): Promise<IPoolIndicators>;

  getIV(params?: { provider?: IProvider }): Promise<IValue>;
  getAdjustedIV(params?: { provider?: IProvider }): Promise<IValue>;
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
