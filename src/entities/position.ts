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

import { expect } from "../utils";

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
  public readonly collateralWithdrawn: BigNumber;

  public readonly initialOptionsProvided: BigNumber;
  public readonly initialTokensProvided: BigNumber;

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
    this.collateralWithdrawn = params.collateralWithdrawn;

    this.initialOptionsProvided = params.initialOptionsProvided;
    this.initialTokensProvided = params.initialTokensProvided;

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
      humanized: new BigNumber(this.premiumPaid!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
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
      humanized: new BigNumber(this.premiumReceived!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
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
      humanized: new BigNumber(this.optionsBought!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
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
      humanized: new BigNumber(this.optionsSold!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
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
      humanized: new BigNumber(this.optionsResold!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
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
      humanized: new BigNumber(this.optionsMinted!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
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
      humanized: new BigNumber(this.optionsUnminted!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
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
      humanized: new BigNumber(this.optionsExercised!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
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
      humanized: new BigNumber(this.optionsSent!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
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
      humanized: new BigNumber(this.optionsReceived!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
    };

    return value;
  }

  public getUnderlyingWithdrawnValue(): IValue {
    expect(this.underlyingWithdrawn, "underlyingWithdrawn");
    expect(this.option, "option");
    expect(this.option?.underlying, "option underlying");

    const value: IValue = {
      raw: new BigNumber(this.underlyingWithdrawn!),
      humanized: new BigNumber(this.underlyingWithdrawn!).dividedBy(
        new BigNumber(10).pow(this.option!.underlying!.decimals)
      ),
    };

    return value;
  }

  public getCollateralWithdrawnValue(): IValue {
    expect(this.collateralWithdrawn, "collateralWithdrawn");
    expect(this.option, "option");
    expect(this.option?.strike, "option strike");

    const value: IValue = {
      raw: new BigNumber(this.collateralWithdrawn!),
      humanized: new BigNumber(this.collateralWithdrawn!).dividedBy(
        new BigNumber(10).pow(this.option!.strike!.decimals)
      ),
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
      humanized: new BigNumber(this.initialOptionsProvided!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
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
      humanized: new BigNumber(this.initialTokensProvided!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
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
      humanized: new BigNumber(this.finalOptionsRemoved!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
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
      humanized: new BigNumber(this.finalTokensRemoved!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
    };

    return value;
  }
}
