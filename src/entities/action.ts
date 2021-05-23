import _ from "lodash";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

import {
  IAction,
  IOption,
  IActionBuilderParams,
  Optional,
  IValue,
} from "@types";

import { ActionType } from "../constants/globals";
import { expect, zero } from "../utils";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export default class Action implements IAction {
  /**
   * ---------- VARIABLES ----------
   */

  public readonly id: string;
  public readonly networkId: number;
  public readonly type: ActionType;
  public readonly hash: string;
  public readonly from: string;
  public readonly timestamp: number;
  public readonly inputTokenA: BigNumber;
  public readonly inputTokenB: BigNumber;
  public readonly outputTokenA: BigNumber;
  public readonly outputTokenB: BigNumber;
  public readonly optionAddress: string;
  public readonly poolAddress: string;
  public readonly userAddress: string;

  private _option?: IOption;

  private _spotPrice?: BigNumber;
  private _metadataOptionsMintedAndSold?: BigNumber;
  private _nextSigma?: BigNumber;
  private _nextSellingPrice?: BigNumber;
  private _nextBuyingPrice?: BigNumber;
  private _nextDynamicSellingPrice?: BigNumber;
  private _nextDynamicBuyingPrice?: BigNumber;
  private _nextUserTokenALiquidity?: BigNumber;
  private _nextUserTokenBLiquidity?: BigNumber;
  private _nextTBA?: BigNumber;
  private _nextTBB?: BigNumber;
  private _nextDBA?: BigNumber;
  private _nextDBB?: BigNumber;
  private _nextFeesA?: BigNumber;
  private _nextFeesB?: BigNumber;
  private _nextCollateralTVL?: BigNumber;
  private _nextPoolTokenATVL?: BigNumber;
  private _nextPoolTokenBTVL?: BigNumber;
  private _nextUserSnapshotFIMP?: BigNumber;
  private _nextUserTokenAOriginalBalance?: BigNumber;
  private _nextUserTokenBOriginalBalance?: BigNumber;

  /**
   * ---------- SETTERS & GETTERS ----------
   */

  public get option(): Optional<IOption> {
    return this._option;
  }
  public set option(value: Optional<IOption>) {
    this._option = value;
  }

  public get spotPrice(): Optional<BigNumber> {
    return this._spotPrice;
  }
  public set spotPrice(value: Optional<BigNumber>) {
    this._spotPrice = value;
  }

  public get metadataOptionsMintedAndSold(): Optional<BigNumber> {
    return this._metadataOptionsMintedAndSold;
  }
  public set metadataOptionsMintedAndSold(value: Optional<BigNumber>) {
    this._metadataOptionsMintedAndSold = value;
  }

  public get nextSigma(): Optional<BigNumber> {
    return this._nextSigma;
  }
  public set nextSigma(value: Optional<BigNumber>) {
    this._nextSigma = value;
  }

  public get nextSellingPrice(): Optional<BigNumber> {
    return this._nextSellingPrice;
  }
  public set nextSellingPrice(value: Optional<BigNumber>) {
    this._nextSellingPrice = value;
  }

  public get nextBuyingPrice(): Optional<BigNumber> {
    return this._nextBuyingPrice;
  }
  public set nextBuyingPrice(value: Optional<BigNumber>) {
    this._nextBuyingPrice = value;
  }

  public get nextDynamicSellingPrice(): Optional<BigNumber> {
    return this._nextDynamicSellingPrice;
  }
  public set nextDynamicSellingPrice(value: Optional<BigNumber>) {
    this._nextDynamicSellingPrice = value;
  }

  public get nextDynamicBuyingPrice(): Optional<BigNumber> {
    return this._nextDynamicBuyingPrice;
  }
  public set nextDynamicBuyingPrice(value: Optional<BigNumber>) {
    this._nextDynamicBuyingPrice = value;
  }

  public get nextUserTokenALiquidity(): Optional<BigNumber> {
    return this._nextUserTokenALiquidity;
  }
  public set nextUserTokenALiquidity(value: Optional<BigNumber>) {
    this._nextUserTokenALiquidity = value;
  }

  public get nextUserTokenBLiquidity(): Optional<BigNumber> {
    return this._nextUserTokenBLiquidity;
  }
  public set nextUserTokenBLiquidity(value: Optional<BigNumber>) {
    this._nextUserTokenBLiquidity = value;
  }
  public get nextTBA(): Optional<BigNumber> {
    return this._nextTBA;
  }
  public set nextTBA(value: Optional<BigNumber>) {
    this._nextTBA = value;
  }

  public get nextTBB(): Optional<BigNumber> {
    return this._nextTBB;
  }
  public set nextTBB(value: Optional<BigNumber>) {
    this._nextTBB = value;
  }

  public get nextDBA(): Optional<BigNumber> {
    return this._nextDBA;
  }
  public set nextDBA(value: Optional<BigNumber>) {
    this._nextDBA = value;
  }

  public get nextDBB(): Optional<BigNumber> {
    return this._nextDBB;
  }
  public set nextDBB(value: Optional<BigNumber>) {
    this._nextDBB = value;
  }

  public get nextFeesA(): Optional<BigNumber> {
    return this._nextFeesA;
  }
  public set nextFeesA(value: Optional<BigNumber>) {
    this._nextFeesA = value;
  }

  public get nextFeesB(): Optional<BigNumber> {
    return this._nextFeesB;
  }
  public set nextFeesB(value: Optional<BigNumber>) {
    this._nextFeesB = value;
  }

  public get nextCollateralTVL(): Optional<BigNumber> {
    return this._nextCollateralTVL;
  }
  public set nextCollateralTVL(value: Optional<BigNumber>) {
    this._nextCollateralTVL = value;
  }

  public get nextPoolTokenATVL(): Optional<BigNumber> {
    return this._nextPoolTokenATVL;
  }
  public set nextPoolTokenATVL(value: Optional<BigNumber>) {
    this._nextPoolTokenATVL = value;
  }

  public get nextPoolTokenBTVL(): Optional<BigNumber> {
    return this._nextPoolTokenBTVL;
  }
  public set nextPoolTokenBTVL(value: Optional<BigNumber>) {
    this._nextPoolTokenBTVL = value;
  }

  public get nextUserSnapshotFIMP(): Optional<BigNumber> {
    return this._nextUserSnapshotFIMP;
  }
  public set nextUserSnapshotFIMP(value: Optional<BigNumber>) {
    this._nextUserSnapshotFIMP = value;
  }

  public get nextUserTokenAOriginalBalance(): Optional<BigNumber> {
    return this._nextUserTokenAOriginalBalance;
  }
  public set nextUserTokenAOriginalBalance(value: Optional<BigNumber>) {
    this._nextUserTokenAOriginalBalance = value;
  }

  public get nextUserTokenBOriginalBalance(): Optional<BigNumber> {
    return this._nextUserTokenBOriginalBalance;
  }
  public set nextUserTokenBOriginalBalance(value: Optional<BigNumber>) {
    this._nextUserTokenBOriginalBalance = value;
  }

  /**
   * ---------- CONSTRUCTOR & METHODS ----------
   */

  constructor(params: IActionBuilderParams) {
    this.id = params.id;
    this.networkId = params.networkId;
    this.type = params.type;
    this.hash = params.hash;
    this.from = params.from;
    this.timestamp = params.timestamp;
    this.inputTokenA = params.inputTokenA;
    this.inputTokenB = params.inputTokenB;
    this.outputTokenA = params.outputTokenA;
    this.outputTokenB = params.outputTokenB;

    this.optionAddress = _.toString(params.optionAddress).toLowerCase();
    this.userAddress = _.toString(params.userAddress).toLowerCase();
    this.poolAddress = _.toString(params.poolAddress).toLowerCase();

    this.spotPrice = params.spotPrice;
    this.metadataOptionsMintedAndSold = params.metadataOptionsMintedAndSold;
    this.nextSigma = params.nextSigma;
    this.nextSellingPrice = params.nextSellingPrice;
    this.nextBuyingPrice = params.nextBuyingPrice;
    this.nextDynamicBuyingPrice = params.nextDynamicBuyingPrice;
    this.nextDynamicSellingPrice = params.nextDynamicSellingPrice;
    this.nextUserTokenALiquidity = params.nextUserTokenALiquidity;
    this.nextUserTokenBLiquidity = params.nextUserTokenBLiquidity;
    this.nextTBA = params.nextTBA;
    this.nextTBB = params.nextTBB;
    this.nextDBA = params.nextDBA;
    this.nextDBB = params.nextDBB;
    this.nextFeesA = params.nextFeesA;
    this.nextFeesB = params.nextFeesB;
    this.nextCollateralTVL = params.nextCollateralTVL;
    this.nextPoolTokenATVL = params.nextPoolTokenATVL;
    this.nextPoolTokenBTVL = params.nextPoolTokenBTVL;
    this.nextUserSnapshotFIMP = params.nextUserSnapshotFIMP;
    this.nextUserTokenAOriginalBalance = params.nextUserTokenAOriginalBalance;
    this.nextUserTokenBOriginalBalance = params.nextUserTokenBOriginalBalance;
  }

  public getInputTokenAValue(): IValue {
    expect(this.inputTokenA, "inputTokenA");
    expect(this.type, "type");
    expect(this.option, "option");

    if (
      [
        ActionType.Resell,
        ActionType.AddLiquidity,
        ActionType.Unmint,
        ActionType.TransferFrom,
      ].includes(this.type)
    ) {
      expect(
        this.option?.pool?.tokenA?.decimals,
        "decimals (option pool tokenA)"
      );

      const value: IValue = {
        raw: new BigNumber(this.inputTokenA!),
        humanized: new BigNumber(this.inputTokenA!).dividedBy(
          new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
        ),
      };

      return value;
    } else if ([ActionType.Exercise].includes(this.type)) {
      expect(this.option?.underlying?.decimals, "decimals (option underlying)");

      const value: IValue = {
        raw: new BigNumber(this.inputTokenA!),
        humanized: new BigNumber(this.inputTokenA!).dividedBy(
          new BigNumber(10).pow(this.option!.underlying!.decimals)
        ),
      };

      return value;
    }

    return zero;
  }

  public getInputTokenBValue(): IValue {
    expect(this.inputTokenB, "inputTokenB");
    expect(this.type, "type");
    expect(this.option, "option");

    if ([ActionType.AddLiquidity].includes(this.type)) {
      expect(
        this.option?.pool?.tokenB?.decimals,
        "decimals (option pool tokenB)"
      );

      const value: IValue = {
        raw: new BigNumber(this.inputTokenB!),
        humanized: new BigNumber(this.inputTokenB!).dividedBy(
          new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
        ),
      };

      return value;
    } else if (
      [ActionType.Buy, ActionType.Sell, ActionType.Mint].includes(this.type)
    ) {
      expect(this.option?.strike?.decimals, "decimals (option strike)");

      const value: IValue = {
        raw: new BigNumber(this.inputTokenB!),
        humanized: new BigNumber(this.inputTokenB!).dividedBy(
          new BigNumber(10).pow(this.option!.strike!.decimals)
        ),
      };

      return value;
    }

    return zero;
  }

  public getOutputTokenAValue(): IValue {
    expect(this.outputTokenA, "outputTokenA");
    expect(this.type, "type");
    expect(this.option, "option");

    if (
      [
        ActionType.Buy,
        ActionType.Mint,
        ActionType.RemoveLiquidity,
        ActionType.TransferTo,
      ].includes(this.type)
    ) {
      expect(
        this.option?.pool?.tokenA?.decimals,
        "decimals (option pool tokenA)"
      );

      const value: IValue = {
        raw: new BigNumber(this.outputTokenA!),
        humanized: new BigNumber(this.outputTokenA!).dividedBy(
          new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
        ),
      };

      return value;
    } else if ([ActionType.Withdraw].includes(this.type)) {
      expect(this.option?.underlying?.decimals, "decimals (option underlying)");

      const value: IValue = {
        raw: new BigNumber(this.outputTokenA!),
        humanized: new BigNumber(this.outputTokenA!).dividedBy(
          new BigNumber(10).pow(this.option!.underlying!.decimals)
        ),
      };

      return value;
    }

    return zero;
  }

  public getOutputTokenBValue(): IValue {
    expect(this.outputTokenB, "outputTokenB");
    expect(this.type, "type");
    expect(this.option, "option");

    if ([ActionType.RemoveLiquidity].includes(this.type)) {
      expect(
        this.option?.pool?.tokenB?.decimals,
        "decimals (option pool tokenB)"
      );

      const value: IValue = {
        raw: new BigNumber(this.outputTokenB!),
        humanized: new BigNumber(this.outputTokenB!).dividedBy(
          new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
        ),
      };

      return value;
    } else if (
      [
        ActionType.Sell,
        ActionType.Resell,
        ActionType.Unmint,
        ActionType.Exercise,
        ActionType.Withdraw,
      ].includes(this.type)
    ) {
      expect(this.option?.strike?.decimals, "decimals (option strike)");

      const value: IValue = {
        raw: new BigNumber(this.inputTokenB!),
        humanized: new BigNumber(this.outputTokenB!).dividedBy(
          new BigNumber(10).pow(this.option!.strike!.decimals)
        ),
      };

      return value;
    }

    return zero;
  }

  public getMetadataOptionsMintedAndSoldValue(): IValue {
    expect(
      this.metadataOptionsMintedAndSold,
      "metadataOptionsMintedAndSold (pack:heavy)"
    );
    expect(this.option, "option");
    expect(this.option?.decimals, "decimals (option)");

    const value: IValue = {
      raw: new BigNumber(this.metadataOptionsMintedAndSold!),
      humanized: new BigNumber(this.metadataOptionsMintedAndSold!).dividedBy(
        new BigNumber(10).pow(this.option!.decimals!)
      ),
    };

    return value;
  }

  public getSpotPriceValue(): IValue {
    expect(this.spotPrice, "spotPrice (pack:heavy)");
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenB?.decimals,
      "decimals (option pool tokenB)"
    );

    const value: IValue = {
      raw: new BigNumber(this.spotPrice!),
      humanized: new BigNumber(this.spotPrice!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
    };

    return value;
  }

  public getNextSellingPriceValue(): IValue {
    expect(this.nextSellingPrice, "nextSellingPrice (pack:heavy)");
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenB?.decimals,
      "decimals (option pool tokenB)"
    );

    const value: IValue = {
      raw: new BigNumber(this.nextSellingPrice!),
      humanized: new BigNumber(this.nextSellingPrice!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
    };

    return value;
  }

  public getNextBuyingPriceValue(): IValue {
    expect(this.nextBuyingPrice, "nextBuyingPrice (pack:heavy)");
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenB?.decimals,
      "decimals (option pool tokenB)"
    );

    const value: IValue = {
      raw: new BigNumber(this.nextBuyingPrice!),
      humanized: new BigNumber(this.nextBuyingPrice!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
    };

    return value;
  }

  public getNextDynamicSellingPriceValue(): IValue {
    expect(
      this.nextDynamicSellingPrice,
      "nextDynamicSellingPrice (pack:heavy)"
    );
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenB?.decimals,
      "decimals (option pool tokenB)"
    );

    const value: IValue = {
      raw: new BigNumber(this.nextDynamicSellingPrice!),
      humanized: new BigNumber(this.nextDynamicSellingPrice!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
    };

    return value;
  }

  public getNextDynamicBuyingPriceValue(): IValue {
    expect(this.nextDynamicBuyingPrice, "nextDynamicBuyingPrice (pack:heavy)");
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenB?.decimals,
      "decimals (option pool tokenB)"
    );

    const value: IValue = {
      raw: new BigNumber(this.nextDynamicBuyingPrice!),
      humanized: new BigNumber(this.nextDynamicBuyingPrice!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
    };

    return value;
  }

  public getNextUserTokenALiquidityValue(): IValue {
    expect(
      this.nextUserTokenALiquidity,
      "nextUserTokenALiquidity (pack:heavy)"
    );
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenA?.decimals,
      "decimals (option pool tokenA)"
    );

    const value: IValue = {
      raw: new BigNumber(this.nextUserTokenALiquidity!),
      humanized: new BigNumber(this.nextUserTokenALiquidity!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
    };

    return value;
  }

  public getNextUserTokenBLiquidityValue(): IValue {
    expect(
      this.nextUserTokenBLiquidity,
      "nextUserTokenBLiquidity (pack:heavy)"
    );
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenB?.decimals,
      "decimals (option pool tokenB)"
    );

    const value: IValue = {
      raw: new BigNumber(this.nextUserTokenBLiquidity!),
      humanized: new BigNumber(this.nextUserTokenBLiquidity!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
    };

    return value;
  }

  public getNextTBAValue(): IValue {
    expect(this.nextTBA, "nextTBA (pack:heavy)");
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenA?.decimals,
      "decimals (option pool tokenA)"
    );

    const value: IValue = {
      raw: new BigNumber(this.nextTBA!),
      humanized: new BigNumber(this.nextTBA!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
    };

    return value;
  }

  public getNextTBBValue(): IValue {
    expect(this.nextTBB, "nextTBB (pack:heavy)");
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenB?.decimals,
      "decimals (option pool tokenB)"
    );

    const value: IValue = {
      raw: new BigNumber(this.nextTBB!),
      humanized: new BigNumber(this.nextTBB!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
    };

    return value;
  }

  public getNextDBAValue(): IValue {
    expect(this.nextDBA, "nextDBA (pack:heavy)");
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenA?.decimals,
      "decimals (option pool tokenA)"
    );

    const value: IValue = {
      raw: new BigNumber(this.nextDBA!),
      humanized: new BigNumber(this.nextDBA!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenA!.decimals)
      ),
    };

    return value;
  }

  public getNextDBBValue(): IValue {
    expect(this.nextDBB, "nextDBB (pack:heavy)");
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenB?.decimals,
      "decimals (option pool tokenB)"
    );

    const value: IValue = {
      raw: new BigNumber(this.nextDBB!),
      humanized: new BigNumber(this.nextDBB!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
    };

    return value;
  }

  public getNextFeesAValue(): IValue {
    expect(this.nextFeesA, "nextFeesA (pack:heavy)");
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenB?.decimals,
      "decimals (option pool tokenB)"
    );

    /**
     * Fees will be denominated in tokenB
     */

    const value: IValue = {
      raw: new BigNumber(this.nextFeesA!),
      humanized: new BigNumber(this.nextFeesA!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
    };

    return value;
  }

  public getNextFeesBValue(): IValue {
    expect(this.nextFeesB, "nextFeesB (pack:heavy)");
    expect(this.option, "option");
    expect(
      this.option?.pool?.tokenB?.decimals,
      "decimals (option pool tokenB)"
    );

    /**
     * Fees will be denominated in tokenB
     */

    const value: IValue = {
      raw: new BigNumber(this.nextFeesB!),
      humanized: new BigNumber(this.nextFeesB!).dividedBy(
        new BigNumber(10).pow(this.option!.pool!.tokenB!.decimals)
      ),
    };

    return value;
  }
}
