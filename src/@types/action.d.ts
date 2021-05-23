import BigNumber from "bignumber.js";
import { ActionType } from "../constants/globals";
import { IOption } from "./option";
import { IValue } from "./value";

export interface IAction {
  /** LIGHT */

  readonly id: string;
  readonly networkId: number;
  readonly type: ActionType;
  readonly hash: string;
  readonly from: string;
  readonly timestamp: number;

  readonly inputTokenA: BigNumber;
  readonly inputTokenB: BigNumber;
  readonly outputTokenA: BigNumber;
  readonly outputTokenB: BigNumber;

  readonly optionAddress: string;
  readonly poolAddress: string;
  readonly userAddress: string;

  option?: IOption;

  /** HEAVY */

  spotPrice?: BigNumber;
  metadataOptionsMintedAndSold?: BigNumber;
  nextSigma?: BigNumber;
  nextSellingPrice?: BigNumber;
  nextBuyingPrice?: BigNumber;
  nextDynamicSellingPrice?: BigNumber;
  nextDynamicBuyingPrice?: BigNumber;
  nextUserTokenALiquidity?: BigNumber;
  nextUserTokenBLiquidity?: BigNumber;
  nextTBA?: BigNumber;
  nextTBB?: BigNumber;
  nextDBA?: BigNumber;
  nextDBB?: BigNumber;
  nextFeesA?: BigNumber;
  nextFeesB?: BigNumber;
  nextCollateralTVL?: BigNumber;
  nextPoolTokenATVL?: BigNumber;
  nextPoolTokenBTVL?: BigNumber;
  nextUserSnapshotFIMP?: BigNumber;
  nextUserTokenAOriginalBalance?: BigNumber;
  nextUserTokenBOriginalBalance?: BigNumber;

  /** LIGHT VALUE GETTERS */

  getInputTokenAValue(): IValue;
  getInputTokenBValue(): IValue;
  getOutputTokenAValue(): IValue;
  getOutputTokenBValue(): IValue;

  /** HEAVY VALUE GETTERS */

  getMetadataOptionsMintedAndSoldValue(): IValue;
  getSpotPriceValue(): IValue;
  getNextSellingPriceValue(): IValue;
  getNextBuyingPriceValue(): IValue;
  getNextDynamicSellingPriceValue(): IValue;
  getNextDynamicBuyingPriceValue(): IValue;
  getNextUserTokenALiquidityValue(): IValue;
  getNextUserTokenBLiquidityValue(): IValue;
  getNextTBAValue(): IValue;
  getNextTBBValue(): IValue;
  getNextDBAValue(): IValue;
  getNextDBBValue(): IValue;
  getNextFeesAValue(): IValue;
  getNextFeesBValue(): IValue;
}
