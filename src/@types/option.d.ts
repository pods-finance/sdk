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
  strikePrice?: BigNumber;
  expiration?: number;
  exerciseStart?: number;
  exerciseWindowSize?: number;
  factoryAddress?: string;
  poolAddress?: string;

  pool?: IPool;

  init(params: IOptionBuilderParams): IOption;
  getDurations(): { [key: string]: number | string | boolean | null };

  getTotalSupply(): Promise<IValue>;
  getCap(params: { manager: string }): Promise<IValue>;

  getUserMintedOptions(params: { user: string }): Promise<IValue>;
  getUserWithdrawBalances(params: { user: string }): Promise<IValue[]>;
}
