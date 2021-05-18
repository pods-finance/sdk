import BigNumber from "bignumber.js";

import { IPool } from "./pool";
import { IToken } from "./token";

export interface IOption {
  readonly address: string;
  readonly networkId: number;

  readonly underlying: IToken;
  readonly strike: IToken;
  readonly type: OptionType;
  readonly strikePrice: BigNumber;
  readonly expiration: number;
  readonly exerciseStart: number;
  readonly exerciseWindowSize: number;
  readonly factoryAddress: string;
  readonly poolAddress: string;

  pool?: IPool;

  getDurations(): { [key: string]: number | string | boolean | null };
}
