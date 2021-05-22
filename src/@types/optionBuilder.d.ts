import BigNumber from "bignumber.js";
import { IOption } from "./option";

export interface IOptionBuilderParams {
  address?: string;
  networkId?: number;
  type: number;

  underlyingAsset: string;
  underlyingAssetDecimals: BigNumber;
  underlyingAssetSymbol: string;
  strikeAsset: string;
  strikeAssetDecimals: BigNumber;
  strikeAssetSymbol: string;
  strikePrice: BigNumber;
  expiration: number;
  exerciseStart: number;
  exerciseWindowSize: number;

  factoryAddress: string;
  poolAddress: string;
}

export interface IOptionBuilder {}
