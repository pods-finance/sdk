import _ from "lodash";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

import Token from "./token";

dayjs.extend(relativeTime);
dayjs.extend(duration);

enum OptionType {
  Put = 0,
  Call = 1,
}

interface IOption {
  readonly address: string;
  readonly networkId: number;

  readonly underlying: Token;
  readonly strike: Token;
  readonly type: OptionType;
  readonly strikePrice: BigNumber;
  readonly expiration: number;
  readonly exercise: number;
  readonly window: number;

  readonly factoryAddress: string;

  durations(): { [key: string]: number | string | boolean | null };
}

export default class Option implements IOption {
  public readonly address: string;
  public readonly networkId: number;

  public readonly underlying: Token;
  public readonly strike: Token;
  public readonly type: OptionType = OptionType.Put;
  public readonly strikePrice: BigNumber;
  public readonly expiration: number;
  public readonly exercise: number;
  public readonly window: number;

  public readonly factoryAddress: string;

  constructor(params: {
    address: string;
    networkId: number;
    type: number;

    underlyingAsset: string;
    underlyingAssetDecimals: BigNumber;
    underlyingAssetSymbol: string;
    strikeAsset: string;
    strikeAssetDecimals: BigNumber;
    strikeAssetSymbol: string;
    strikePrice: BigNumber;
    expiration: number;
    exercise: number;
    window: number;

    factoryAddress: string;
  }) {
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
    this.exercise = params.exercise;
    this.window = params.window;

    this.factoryAddress = params.factoryAddress;
  }

  durations(): { [key: string]: number | string | boolean | null } {
    const expirationFormatted = dayjs(
      new BigNumber(this.expiration).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY");

    const exerciseFormatted = dayjs(
      new BigNumber(this.exercise).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY");

    const windowFormatted = dayjs.duration(this.window * 1000).humanize();

    const expirationToToday = new BigNumber(this.expiration)
      .minus(dayjs().valueOf() / 1000)
      .toNumber();

    const exerciseToToday = expirationToToday - this.window;
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
