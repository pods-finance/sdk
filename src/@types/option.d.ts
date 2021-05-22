import BigNumber from "bignumber.js";

import { IPool } from "./pool";
import { IToken } from "./token";
import { IOptionBuilderParams } from "./optionBuilder";

import { OptionType } from "../constants/globals";

export interface IOption {
  readonly address: string;
  readonly networkId: number;

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
}
