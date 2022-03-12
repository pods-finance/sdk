import _ from "lodash";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import duration from "dayjs/plugin/duration";

import {
  IProvider,
  IPool,
  IOption,
  IOptionBuilderParams,
  IToken,
  Optional,
  IValue,
} from "@types";
import {
  OptionType,
  OptionExerciseType,
  MILESTONE_EXPIRATION_SOON,
  ALLOW_LOGS,
} from "../constants/globals";
import { expect, zero } from "../utils";
import contracts from "../contracts";
import Token from "./token";

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);

export default class Option implements IOption {
  /**
   * ---------- VARIABLES ----------
   */

  public readonly address: string;
  public readonly networkId: number;
  public readonly uuid: string;

  private _provider?: IProvider;
  private _symbol?: string;
  private _decimals?: BigNumber;
  private _underlying?: IToken;
  private _strike?: IToken;
  private _collateral?: IToken;
  private _type: OptionType = OptionType.Put;
  private _exerciseType: OptionExerciseType = OptionExerciseType.European;
  private _strikePrice?: IValue;
  private _expiration?: number;
  private _exerciseStart?: number;
  private _exerciseWindowSize?: number;
  private _seriesFeeVolume?: IValue;
  private _factoryAddress?: string;
  private _poolAddress?: string;
  private _pool?: IPool;

  /**
   * ---------- SETTERS & GETTERS ----------
   */

  public get provider(): Optional<IProvider> {
    return this._provider;
  }
  public set provider(value: Optional<IProvider>) {
    this._provider = value;
  }

  public get symbol(): Optional<string> {
    return this._symbol;
  }
  public set symbol(value: Optional<string>) {
    this._symbol = value;
  }

  public get decimals(): Optional<BigNumber> {
    return this._decimals;
  }
  public set decimals(value: Optional<BigNumber>) {
    this._decimals = value;
  }

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

  public get collateral(): Optional<IToken> {
    return this._collateral;
  }
  public set collateral(value: Optional<IToken>) {
    this._collateral = value;
  }

  public get type(): OptionType {
    return this._type;
  }
  public set type(value: OptionType) {
    this._type = value;
  }

  public get exerciseType(): OptionExerciseType {
    return this._exerciseType;
  }
  public set exerciseType(value: OptionExerciseType) {
    this._exerciseType = value;
  }

  public get seriesFeeVolume(): Optional<IValue> {
    return this._seriesFeeVolume;
  }
  public set seriesFeeVolume(value: Optional<IValue>) {
    this._seriesFeeVolume = value;
  }

  public get strikePrice(): Optional<IValue> {
    return this._strikePrice;
  }
  public set strikePrice(value: Optional<IValue>) {
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
    this.uuid = `${this.address}-${this.networkId}`;
  }

  init(params: IOptionBuilderParams): IOption {
    this.type = params.type ? OptionType.Call : OptionType.Put;
    this.exerciseType = params.exerciseType
      ? OptionExerciseType.American
      : OptionExerciseType.European;

    this.symbol = params.symbol;
    this.decimals = params.decimals || 18;
    this.provider = params.provider;

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

    this._collateral = params.type ? this.underlying : this.strike;

    this.strikePrice = {
      raw: params.strikePrice,
      humanized: new BigNumber(params.strikePrice).dividedBy(
        new BigNumber(10).pow(this.strike!.decimals)
      ),
    };

    this.expiration = new BigNumber(params.expiration).toNumber();
    this.exerciseStart = new BigNumber(params.exerciseStart).toNumber();
    this.exerciseWindowSize = new BigNumber(
      params.exerciseWindowSize
    ).toNumber();

    this.factoryAddress = _.toString(params.factoryAddress).toLowerCase();
    this.poolAddress = _.toString(params.poolAddress).toLowerCase();

    this.seriesFeeVolume = {
      raw: params.seriesFeeVolume,
      humanized: new BigNumber(params.seriesFeeVolume).dividedBy(
        new BigNumber(10).pow(this.strike!.decimals)
      ),
    };

    return this as IOption;
  }

  isPut(): boolean {
    return this.type === OptionType.Put;
  }

  isCall(): boolean {
    return this.type === OptionType.Call;
  }

  getDurations(): {
    [key: string]: number | string | boolean | null | undefined;
  } {
    expect(this.expiration, "expiration", "number");
    expect(this.exerciseStart, "exerciseStart", "number");
    expect(this.exerciseWindowSize, "exerciseWindowSize", "number");

    const expirationFormatted = dayjs(
      new BigNumber(this.expiration!).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY");

    const expirationFormattedWithHour = dayjs(
      new BigNumber(this.expiration!).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY h A");

    const expirationFormattedWithTime = dayjs(
      new BigNumber(this.expiration!).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY hh:mm A");

    const exerciseStartFormatted = dayjs(
      new BigNumber(this.exerciseStart!).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY");

    const exerciseStartFormattedWithHour = dayjs(
      new BigNumber(this.exerciseStart!).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY h A");

    const exerciseStartFormattedWithTime = dayjs(
      new BigNumber(this.exerciseStart!).multipliedBy(1000).toNumber()
    ).format("MMM Do, YYYY hh:mm A");

    const windowFormatted = dayjs
      .duration(this.exerciseWindowSize! * 1000)
      .humanize();

    const expirationToToday = new BigNumber(this.expiration!)
      .minus(dayjs().valueOf() / 1000)
      .toNumber();

    const exerciseStartToToday = expirationToToday - this.exerciseWindowSize!;
    const expirationFromNow = dayjs(this.expiration! * 1000).fromNow();
    const exerciseStartFromNow = dayjs(this.exerciseStart! * 1000).fromNow();

    const exerciseStartToTodayFormatted = dayjs
      .duration(exerciseStartToToday * 1000)
      .humanize(true);

    const expirationToTodayFormatted = dayjs
      .duration(expirationToToday * 1000)
      .humanize(true);

    const isExpired = expirationToToday <= 0;
    const isTrading = exerciseStartToToday > 0;
    const isExercising = !isTrading && !isExpired;

    const isExercisableSoon =
      new BigNumber(exerciseStartToToday).isLessThanOrEqualTo(
        new BigNumber(MILESTONE_EXPIRATION_SOON)
      ) && !isExpired;

    return {
      expiration: this.expiration,
      exerciseStart: this.exerciseStart,
      exerciseWindowSize: this.exerciseWindowSize,
      expirationFormatted,
      exerciseStartFormatted,
      expirationFormattedWithTime,
      exerciseStartFormattedWithTime,
      expirationToTodayFormatted,
      expirationFormattedWithHour,
      windowFormatted,
      expirationToToday,
      exerciseStartToToday,
      expirationFromNow,
      exerciseStartFromNow,
      exerciseStartToTodayFormatted,
      exerciseStartFormattedWithHour,
      isExpired,
      isTrading,
      isExercising,
      isExercisableSoon,
    };
  }

  async getTotalSupply(params: { provider?: IProvider } = {}): Promise<IValue> {
    expect(this.decimals, "decimals");
    expect(this.provider || params.provider, "provider");

    try {
      const contract = contracts.instances.option(
        (this.provider || params.provider)!,
        this.address
      );
      const result = await contract.totalSupply();

      const supply: IValue = {
        raw: new BigNumber(result.toString()),
        humanized: new BigNumber(result.toString()).dividedBy(
          new BigNumber(10).pow(this.decimals!)
        ),
      };

      return supply;
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }
    return zero;
  }

  async getCap(params: {
    manager: string;
    provider?: IProvider;
  }): Promise<IValue> {
    const { manager, provider } = params;

    expect(this.decimals, "decimals");
    expect(this.provider || provider, "provider");
    expect(manager, "manager (address)");

    try {
      const managerContract = contracts.instances.configurationManager(
        (this.provider || provider)!,
        manager
      );
      const providerAddress = await managerContract.getCapProvider();
      const providerContract = contracts.instances.capProvider(
        (this.provider || provider)!,
        providerAddress
      );

      const result = await providerContract.getCap(this.address);

      const size: IValue = {
        raw: new BigNumber(result.toString()),
        humanized: new BigNumber(result.toString()).dividedBy(
          new BigNumber(10).pow(this.decimals!)
        ),
      };

      return size;
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }
    return zero;
  }

  async getUserMintedOptions(params: {
    user: string;
    provider?: IProvider;
  }): Promise<IValue> {
    const { user, provider } = params;

    expect(this.decimals, "decimals");
    expect(this.provider || provider, "provider");
    expect(user, "user (address)");

    try {
      const contract = contracts.instances.option(
        (this.provider || provider)!,
        this.address
      );

      const result = await contract.mintedOptions(user);

      const size: IValue = {
        raw: new BigNumber(result.toString()),
        humanized: new BigNumber(result.toString()).dividedBy(
          new BigNumber(10).pow(this.decimals!)
        ),
      };

      return size;
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }
    return zero;
  }

  /**
   *
   * @param {object} params
   * @param {string} params.user User wallet address
   * @returns {Promise<IValue[]>} [UnderylyingBalance, StrikeBalance]
   */
  async getUserWithdrawBalances(params: {
    user: string;
    provider?: IProvider;
  }): Promise<IValue[]> {
    const { user, provider } = params;

    expect(this.underlying, "underlying");
    expect(this.strike, "strike");
    expect(this.provider || provider, "provider");
    expect(user, "user (address)");

    try {
      const contract = contracts.instances.option(
        (this.provider || provider)!,
        this.address
      );
      const result = await contract.getSellerWithdrawAmounts(user);

      const SB: IValue = {
        raw: new BigNumber(result[0].toString()),
        humanized: new BigNumber(result[0].toString()).dividedBy(
          new BigNumber(10).pow(this.strike!.decimals)
        ),
      };

      const UB: IValue = {
        raw: new BigNumber(result[1].toString()),
        humanized: new BigNumber(result[1].toString()).dividedBy(
          new BigNumber(10).pow(this.underlying!.decimals)
        ),
      };

      return [UB, SB];
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }
    return [zero, zero];
  }
}
