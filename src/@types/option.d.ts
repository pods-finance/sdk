import BigNumber from "bignumber.js";
import Web3 from "web3";

import { IValue } from "./value";
import { IPool } from "./pool";
import { IToken } from "./token";
import { IOptionBuilderParams } from "./optionBuilder";

import { OptionType } from "../constants/globals";

export interface IOption {
  readonly address: string;
  readonly networkId: number;

  web3?: Web3;
  symbol?: string;
  decimals?: BigNumber;
  underlying?: IToken;
  strike?: IToken;
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

  getTotalSupply(params?: { web3?: Web3 }): Promise<IValue>;
  getCap(params: { manager: string; web3?: Web3 }): Promise<IValue>;

  getUserMintedOptions(params: { user: string; web3?: Web3 }): Promise<IValue>;
  getUserWithdrawBalances(params: {
    user: string;
    web3?: Web3;
  }): Promise<IValue[]>;
}
