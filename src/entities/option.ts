import _ from "lodash";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

import { IPool, IOption, IOptionBuilderParams, IToken, Optional } from "@types";
import { OptionType } from "../constants/globals";
import { expect } from "../utils";
import Token from "./token";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export default class Option implements IOption {
  /**
   * ---------- VARIABLES ----------
   */

  public readonly address: string;
  public readonly networkId: number;

  private _underlying?: IToken;
  private _strike?: IToken;
  private _type: OptionType = OptionType.Put;
  private _strikePrice?: BigNumber;
  private _expiration?: number;
  private _exerciseStart?: number;
  private _exerciseWindowSize?: number;
  private _factoryAddress?: string;
  private _poolAddress?: string;
  private _pool?: IPool;

  /**
   * ---------- SETTERS & GETTERS ----------
   */

  public get pool(): Optional<IPool> {
    return this._pool;
  }
  public set pool(value: Optional<IPool>) {
    this._pool = value;
  }

  public get underlying(): Optional<IToken> {
    return this._underlying;
  }
  public set underlying(value: Optional<IToken>) {
    this._underlying = value;
  }

  public get strike(): Optional<IToken> {
    return this._strike;
  }
  public set strike(value: Optional<IToken>) {
    this._strike = value;
  }

  public get type(): OptionType {
    return this._type;
  }
  public set type(value: OptionType) {
    this._type = value;
  }

  public get strikePrice(): Optional<BigNumber> {
    return this._strikePrice;
  }
  public set strikePrice(value: Optional<BigNumber>) {
    this._strikePrice = value;
  }

  public get expiration(): Optional<number> {
    return this._expiration;
  }
  public set expiration(value: Optional<number>) {
    this._expiration = value;
  }

  public get exerciseStart(): Optional<number> {
    return this._exerciseStart;
  }
  public set exerciseStart(value: Optional<number>) {
    this._exerciseStart = value;
  }

  public get exerciseWindowSize(): Optional<number> {
    return this._exerciseWindowSize;
  }
  public set exerciseWindowSize(value: Optional<number>) {
    this._exerciseWindowSize = value;
  }

  public get factoryAddress(): Optional<string> {
    return this._factoryAddress;
  }
  public set factoryAddress(value: Optional<string>) {
    this._factoryAddress = value;
  }

  public get poolAddress(): Optional<string> {
    return this._poolAddress;
  }
  public set poolAddress(value: Optional<string>) {
    this._poolAddress = value;
  }

  /**
   * ---------- CONSTRUCTOR & METHODS ----------
   */

  constructor(params: { address: string; networkId: number }) {
    this.address = params.address.toLowerCase();
    this.networkId = params.networkId;
  }

  init(params: IOptionBuilderParams): IOption {
    this.type = params.type ? OptionType.Call : OptionType.Put;

    this.underlying = new Token({
      address: params.underlyingAsset,
      symbol: params.underlyingAssetSymbol,
      decimals: params.underlyingAssetDecimals,
      networkId: this.networkId,
    });
    this.strike = new Token({
      address: params.strikeAsset,
      symbol: params.strikeAssetSymbol,
      decimals: params.strikeAssetDecimals,
      networkId: this.networkId,
    });

    this.strikePrice = params.strikePrice;
    this.expiration = params.expiration;
    this.exerciseStart = params.exerciseStart;
    this.exerciseWindowSize = params.exerciseWindowSize;

    this.factoryAddress = _.toString(params.factoryAddress).toLowerCase();
    this.poolAddress = _.toString(params.poolAddress).toLowerCase();

    return this;
  }

  getDurations(): { [key: string]: number | string | boolean | null } {
    expect(this.expiration, "expiration", "number");
    expect(this.exerciseStart, "exerciseStart", "number");
    expect(this.exerciseWindowSize, "exerciseWindowSize", "number");

    const expirationFormatted = dayjs(
      new BigNumber(this.expiration!).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY");

    const exerciseFormatted = dayjs(
      new BigNumber(this.exerciseStart!).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY");

    const windowFormatted = dayjs
      .duration(this.exerciseWindowSize! * 1000)
      .humanize();

    const expirationToToday = new BigNumber(this.expiration!)
      .minus(dayjs().valueOf() / 1000)
      .toNumber();

    const exerciseToToday = expirationToToday - this.exerciseWindowSize!;
    const expirationFromNow = dayjs(this.expiration! * 1000).fromNow();
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
