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
  strikeWithdrawn: BigNumber;

  initialOptionsProvided: BigNumber;
  initialTokensProvided: BigNumber;

  remainingOptionsProvided: BigNumber;
  remainingTokensProvided: BigNumber;

  finalOptionsRemoved: BigNumber;
  finalTokensRemoved: BigNumber;

  optionAddress: string;
  poolAddress: string;
  userAddress: string;

  option?: IOptionBuilderParams;
}

export interface IPositionBuilder {}
