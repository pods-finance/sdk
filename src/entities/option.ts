import _ from "lodash";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

import { IPool, IOption, IOptionBuilderParams, IToken } from "@types";
import { OptionType } from "../constants/globals";
import Token from "./token";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export default class Option implements IOption {
  /**
   * ---------- VARIABLES ----------
   */

  public readonly address: string;
  public readonly networkId: number;

  public readonly underlying: IToken;
  public readonly strike: IToken;
  public readonly type: OptionType = OptionType.Put;
  public readonly strikePrice: BigNumber;
  public readonly expiration: number;
  public readonly exerciseStart: number;
  public readonly exerciseWindowSize: number;

  public readonly factoryAddress: string;
  public readonly poolAddress: string;

  private _pool?: IPool | undefined;

  /**
   * ---------- SETTERS & GETTERS ----------
   */

  public get pool(): IPool | undefined {
    return this._pool;
  }
  public set pool(value: IPool | undefined) {
    this._pool = value;
  }

  /**
   * ---------- CONSTRUCTOR & METHODS ----------
   */

  constructor(params: IOptionBuilderParams) {
    this.address = params.address.toLowerCase();
    this.networkId = params.networkId;

    this.type = params.type ? OptionType.Call : OptionType.Put;

    this.underlying = new Token({
      address: params.underlyingAsset,
      symbol: params.underlyingAssetSymbol,
      decimals: params.underlyingAssetDecimals,
      networkId: params.networkId,
    });
    this.strike = new Token({
      address: params.strikeAsset,
      symbol: params.strikeAssetSymbol,
      decimals: params.strikeAssetDecimals,
      networkId: params.networkId,
    });

    this.strikePrice = params.strikePrice;
    this.expiration = params.expiration;
    this.exerciseStart = params.exerciseStart;
    this.exerciseWindowSize = params.exerciseWindowSize;

    this.factoryAddress = _.toString(params.factoryAddress).toLowerCase();
    this.poolAddress = _.toString(params.poolAddress).toLowerCase();
  }

  getDurations(): { [key: string]: number | string | boolean | null } {
    const expirationFormatted = dayjs(
      new BigNumber(this.expiration).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY");

    const exerciseFormatted = dayjs(
      new BigNumber(this.exerciseStart).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY");

    const windowFormatted = dayjs
      .duration(this.exerciseWindowSize * 1000)
      .humanize();

    const expirationToToday = new BigNumber(this.expiration)
      .minus(dayjs().valueOf() / 1000)
      .toNumber();

    const exerciseToToday = expirationToToday - this.exerciseWindowSize;
    const expirationFromNow = dayjs(this.expiration * 1000).fromNow();
    const exerciseToTodayFormatted = dayjs
      .duration(exerciseToToday)
      .humanize(true);

    const isExpired = expirationToToday <= 0;
    const isExercisable = exerciseToToday <= 0;
    const isExercising = isExercisable && !isExpired;

    return {
      expirationFormatted,
      exerciseFormatted,
      windowFormatted,
      expirationToToday,
      exerciseToToday,
      expirationFromNow,
      exerciseToTodayFormatted,
      isExpired,
      isExercisable,
      isExercising,
    };
  }
}
