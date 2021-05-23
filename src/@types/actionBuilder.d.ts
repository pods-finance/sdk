import BigNumber from "bignumber.js";
import { ActionType } from "../constants/globals";
import { IOptionBuilderParams } from "./optionBuilder";

export interface IActionBuilderParams {
  /** LIGHT */
  id: string;
  networkId: number;
  type: ActionType;
  hash: string;
  from: string;
  timestamp: number;

  inputTokenA: BigNumber;
  inputTokenB: BigNumber;
  outputTokenA: BigNumber;
  outputTokenB: BigNumber;

  optionAddress: string;
  poolAddress: string;
  userAddress: string;

  option?: IOptionBuilderParams;

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
}

export interface IActionBuilder {}
