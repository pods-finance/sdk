import BigNumber from "bignumber.js";
import { IOptionBuilderParams } from "./optionBuilder";

export interface IPositionBuilderParams {
  id: string;
  networkId: number;

  premiumPaid: BigNumber;
  premiumReceived: BigNumber;

  optionsBought: BigNumber;
  optionsSold: BigNumber;
  optionsResold: BigNumber;

  optionsMinted: BigNumber;
  optionsUnminted: BigNumber;
  optionsExercised: BigNumber;

  optionsSent: BigNumber;
  optionsReceived: BigNumber;

  underlyingWithdrawn: BigNumber;
  collateralWithdrawn: BigNumber;

  initialOptionsProvided: BigNumber;
  initialTokensProvided: BigNumber;

  finalOptionsRemoved: BigNumber;
  finalTokensRemoved: BigNumber;

  optionAddress: string;
  poolAddress: string;
  userAddress: string;

  option?: IOptionBuilderParams;
}

export interface IPositionBuilder {}
