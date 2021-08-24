import BigNumber from "bignumber.js";

import { IProvider } from "./atoms";
import { IValue } from "./value";
import { IPool } from "./pool";
import { IToken } from "./token";
import { IOptionBuilderParams } from "./optionBuilder";

import { OptionType } from "../constants/globals";

export interface IOption {
  readonly address: string;
  readonly networkId: number;

  provider?: IProvider;
  symbol?: string;
  decimals?: BigNumber;
  underlying?: IToken;
  strike?: IToken;
  collateral?: IToken;
  type?: OptionType;
  strikePrice?: IValue;
  expiration?: number;
  exerciseStart?: number;
  exerciseWindowSize?: number;
  factoryAddress?: string;
  poolAddress?: string;

  pool?: IPool;

  init(params: IOptionBuilderParams): IOption;
  getDurations(): {
    [key: string]: number | string | boolean | null | undefined;
  };

  getTotalSupply(params?: { provider?: IProvider }): Promise<IValue>;
  getCap(params: { manager: string; provider?: IProvider }): Promise<IValue>;

  getUserMintedOptions(params: {
    user: string;
    provider?: IProvider;
  }): Promise<IValue>;
  getUserWithdrawBalances(params: {
    user: string;
    provider?: IProvider;
  }): Promise<IValue[]>;
}
