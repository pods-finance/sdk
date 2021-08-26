import BigNumber from "bignumber.js";
import { IOption } from "./option";
import { IValue } from "./value";

export interface IPosition {
  readonly id: string;
  readonly networkId: number;

  readonly premiumPaid: BigNumber;
  readonly premiumReceived: BigNumber;

  readonly optionsBought: BigNumber;
  readonly optionsSold: BigNumber;
  readonly optionsResold: BigNumber;

  readonly optionsMinted: BigNumber;
  readonly optionsUnminted: BigNumber;
  readonly optionsExercised: BigNumber;

  readonly optionsSent: BigNumber;
  readonly optionsReceived: BigNumber;

  readonly underlyingWithdrawn: BigNumber;
  readonly strikeWithdrawn: BigNumber;

  readonly initialOptionsProvided: BigNumber;
  readonly initialTokensProvided: BigNumber;

  readonly finalOptionsRemoved: BigNumber;
  readonly finalTokensRemoved: BigNumber;

  readonly optionAddress: string;
  readonly poolAddress: string;
  readonly userAddress: string;

  option?: IOption;

  getPremiumPaidValue(): IValue;
  getPremiumReceivedValue(): IValue;

  getOptionsBoughtValue(): IValue;
  getOptionsSoldValue(): IValue;
  getOptionsResoldValue(): IValue;

  getOptionsMintedValue(): IValue;
  getOptionsUnmintedValue(): IValue;
  getOptionsExercisedValue(): IValue;

  getOptionsSentValue(): IValue;
  getOptionsReceivedValue(): IValue;

  getUnderlyingWithdrawnValue(): IValue;
  getStrikeWithdrawnValue(): IValue;

  getInitialOptionsProvidedValue(): IValue;
  getInitialTokensProvidedValue(): IValue;

  getFinalOptionsRemovedValue(): IValue;
  getFinalTokensRemovedValue(): IValue;
}
