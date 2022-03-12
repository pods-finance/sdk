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
  readonly uuid: string;

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
  seriesFeeVolume?: IValue;

  pool?: IPool;

  isCall(): boolean;
  isPut(): boolean;

  init(params: IOptionBuilderParams): IOption;
  getDurations(): {
    [key: string]: number | string | boolean | null | undefined;
  };

  /**
   * Get the total supply representing the amount of options that have already been minted
   *
   * @param params
   * @returns {IValue}
   */
  getTotalSupply(params?: { provider?: IProvider }): Promise<IValue>;

  /**
   *
   * Get the cap representing the maximum allowed amount of options that can be minted
   *
   * @param params
   * @returns {IValue}
   */
  getCap(params: { manager: string; provider?: IProvider }): Promise<IValue>;

  /**
   * Get the amount of options that have already been minted by a specific user
   *
   * @param params
   * @returns {IValue}
   */
  getUserMintedOptions(params: {
    user: string;
    provider?: IProvider;
  }): Promise<IValue>;
  getUserWithdrawBalances(params: {
    user: string;
    provider?: IProvider;
  }): Promise<IValue[]>;
}
