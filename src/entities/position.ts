import _ from "lodash";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

import {
  IPosition,
  IOption,
  Optional,
  IValue,
  IPositionBuilderParams,
} from "@types";

import { expect, humanize } from "../utils";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export default class Position implements IPosition {
  /**
   * ---------- VARIABLES ----------
   */

  public readonly id: string;
  public readonly networkId: number;

  public readonly premiumPaid: BigNumber;
  public readonly premiumReceived: BigNumber;

  public readonly optionsBought: BigNumber;
  public readonly optionsSold: BigNumber;
  public readonly optionsResold: BigNumber;

  public readonly optionsMinted: BigNumber;
  public readonly optionsUnminted: BigNumber;
  public readonly optionsExercised: BigNumber;

  public readonly optionsSent: BigNumber;
  public readonly optionsReceived: BigNumber;

  public readonly underlyingWithdrawn: BigNumber;
  public readonly strikeWithdrawn: BigNumber;

  public readonly initialOptionsProvided: BigNumber;
  public readonly initialTokensProvided: BigNumber;

  public readonly remainingOptionsProvided: BigNumber;
  public readonly remainingTokensProvided: BigNumber;

  public readonly finalOptionsRemoved: BigNumber;
  public readonly finalTokensRemoved: BigNumber;

  readonly optionAddress: string;
  readonly poolAddress: string;
  readonly userAddress: string;

  private _option?: IOption;

  /**
   * ---------- SETTERS & GETTERS ----------
   */

  public get option(): Optional<IOption> {
    return this._option;
  }
  public set option(value: Optional<IOption>) {
    this._option = value;
  }

  /**
   * ---------- CONSTRUCTOR & METHODS ----------
   */

  constructor(params: IPositionBuilderParams) {
    this.id = params.id;
    this.networkId = params.networkId;

    this.premiumPaid = params.premiumPaid;
    this.premiumReceived = params.premiumReceived;

    this.optionsBought = params.optionsBought;
    this.optionsSold = params.optionsSold;
    this.optionsResold = params.optionsResold;

    this.optionsMinted = params.optionsMinted;
    this.optionsUnminted = params.optionsUnminted;
    this.optionsExercised = params.optionsExercised;

    this.optionsSent = params.optionsSent;
    this.optionsReceived = params.optionsReceived;

    this.underlyingWithdrawn = params.underlyingWithdrawn;
    this.strikeWithdrawn = params.strikeWithdrawn;

    this.initialOptionsProvided = params.initialOptionsProvided;
    this.initialTokensProvided = params.initialTokensProvided;

    this.remainingOptionsProvided = params.remainingOptionsProvided;
    this.remainingTokensProvided = params.remainingTokensProvided;

    this.finalOptionsRemoved = params.finalOptionsRemoved;
    this.finalTokensRemoved = params.finalTokensRemoved;

    this.optionAddress = _.toString(params.optionAddress).toLowerCase();
    this.userAddress = _.toString(params.userAddress).toLowerCase();
    this.poolAddress = _.toString(params.poolAddress).toLowerCase();
  }

  public getPremiumPaidValue(): IValue {
    expect(this.premiumPaid, "premiumPaid");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenB, "option pool tokenB");

    const value: IValue = {
      raw: new BigNumber(this.premiumPaid!),
      humanized: humanize(new BigNumber(this.premiumPaid!), this.option!.pool!.tokenB!.decimals)
    };

    return value;
  }

  public getPremiumReceivedValue(): IValue {
    expect(this.premiumReceived, "premiumReceived");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenB, "option pool tokenB");

    const value: IValue = {
      raw: new BigNumber(this.premiumReceived!),
      humanized: humanize(new BigNumber(this.premiumReceived!), this.option!.pool!.tokenB!.decimals)
    };

    return value;
  }

  public getOptionsBoughtValue(): IValue {
    expect(this.optionsBought, "optionsBought");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenA, "option pool tokenA");

    const value: IValue = {
      raw: new BigNumber(this.optionsBought!),
      humanized: humanize(new BigNumber(this.optionsBought!), this.option!.pool!.tokenA!.decimals)
    };

    return value;
  }

  public getOptionsSoldValue(): IValue {
    expect(this.optionsSold, "optionsSold");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenA, "option pool tokenA");

    const value: IValue = {
      raw: new BigNumber(this.optionsSold!),
      humanized: humanize(new BigNumber(this.optionsSold!), this.option!.pool!.tokenA!.decimals)
    };

    return value;
  }

  public getOptionsResoldValue(): IValue {
    expect(this.optionsResold, "optionsResold");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenA, "option pool tokenA");

    const value: IValue = {
      raw: new BigNumber(this.optionsResold!),
      humanized: humanize(new BigNumber(this.optionsResold!), this.option!.pool!.tokenA!.decimals)
    };

    return value;
  }

  public getOptionsMintedValue(): IValue {
    expect(this.optionsMinted, "optionsMinted");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenA, "option pool tokenA");

    const value: IValue = {
      raw: new BigNumber(this.optionsMinted!),
      humanized: humanize(new BigNumber(this.optionsMinted!), this.option!.pool!.tokenA!.decimals)
    };

    return value;
  }

  public getOptionsUnmintedValue(): IValue {
    expect(this.optionsUnminted, "optionsUnminted");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenA, "option pool tokenA");

    const value: IValue = {
      raw: new BigNumber(this.optionsUnminted!),
      humanized: humanize(new BigNumber(this.optionsUnminted!), this.option!.pool!.tokenA!.decimals)
    };

    return value;
  }

  public getOptionsExercisedValue(): IValue {
    expect(this.optionsExercised, "optionsExercised");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenA, "option pool tokenA");

    const value: IValue = {
      raw: new BigNumber(this.optionsExercised!),
      humanized: humanize(new BigNumber(this.optionsExercised!), this.option!.pool!.tokenA!.decimals)
    };

    return value;
  }

  public getOptionsSentValue(): IValue {
    expect(this.optionsSent, "optionsSent");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenA, "option pool tokenA");

    const value: IValue = {
      raw: new BigNumber(this.optionsSent!),
      humanized: humanize(new BigNumber(this.optionsSent!), this.option!.pool!.tokenA!.decimals)
    };

    return value;
  }

  public getOptionsReceivedValue(): IValue {
    expect(this.optionsReceived, "optionsReceived");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenA, "option pool tokenA");

    const value: IValue = {
      raw: new BigNumber(this.optionsReceived!),
      humanized: humanize(new BigNumber(this.optionsReceived!), this.option!.pool!.tokenA!.decimals)
    };

    return value;
  }

  public getUnderlyingWithdrawnValue(): IValue {
    expect(this.underlyingWithdrawn, "underlyingWithdrawn");
    expect(this.option, "option");
    expect(this.option?.underlying, "option underlying");

    const value: IValue = {
      raw: new BigNumber(this.underlyingWithdrawn!),
      humanized: humanize(new BigNumber(this.underlyingWithdrawn!), this.option!.underlying!.decimals)
    };

    return value;
  }

  public getStrikeWithdrawnValue(): IValue {
    expect(this.strikeWithdrawn, "strikeWithdrawn");
    expect(this.option, "option");
    expect(this.option?.strike, "option strike");

    const value: IValue = {
      raw: new BigNumber(this.strikeWithdrawn!),
      humanized: humanize(new BigNumber(this.strikeWithdrawn!), this.option!.strike!.decimals)
    };

    return value;
  }

  public getInitialOptionsProvidedValue(): IValue {
    expect(this.initialOptionsProvided, "initialOptionsProvided");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenA, "option pool tokenA");

    const value: IValue = {
      raw: new BigNumber(this.initialOptionsProvided!),
      humanized: humanize(new BigNumber(this.initialOptionsProvided!), this.option!.pool!.tokenA!.decimals)
    };

    return value;
  }

  public getInitialTokensProvidedValue(): IValue {
    expect(this.initialTokensProvided, "initialTokensProvided");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenB, "option pool tokenB");

    const value: IValue = {
      raw: new BigNumber(this.initialTokensProvided!),
      humanized: humanize(new BigNumber(this.initialTokensProvided!), this.option!.pool!.tokenB!.decimals)
    };

    return value;
  }

  public getFinalOptionsRemovedValue(): IValue {
    expect(this.finalOptionsRemoved, "finalOptionsRemoved");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenA, "option pool tokenA");

    const value: IValue = {
      raw: new BigNumber(this.finalOptionsRemoved!),
      humanized: humanize(new BigNumber(this.finalOptionsRemoved!), this.option!.pool!.tokenA!.decimals)
    };

    return value;
  }

  public getFinalTokensRemovedValue(): IValue {
    expect(this.finalTokensRemoved, "finalTokensRemoved");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenB, "option pool tokenB");

    const value: IValue = {
      raw: new BigNumber(this.finalTokensRemoved!),
      humanized: humanize(new BigNumber(this.finalTokensRemoved!), this.option!.pool!.tokenB!.decimals)
    };

    return value;
  }

  public getRemainingOptionsProvidedValue(): IValue {
    expect(this.remainingOptionsProvided, "remainingOptionsProvided");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenA, "option pool tokenA");

    const value: IValue = {
      raw: new BigNumber(this.remainingOptionsProvided!),
      humanized: humanize(new BigNumber(this.remainingOptionsProvided!), this.option!.pool!.tokenA!.decimals)
    };

    return value;
  }

  public getRemainingTokensProvidedValue(): IValue {
    expect(this.remainingTokensProvided, "remainingTokensProvided");
    expect(this.option, "option");
    expect(this.option?.pool, "option pool");
    expect(this.option?.pool?.tokenB, "option pool tokenB");

    const value: IValue = {
      raw: new BigNumber(this.remainingTokensProvided!),
      humanized: humanize(new BigNumber(this.remainingTokensProvided!), this.option!.pool!.tokenB!.decimals)
    };

    return value;
  }
}
