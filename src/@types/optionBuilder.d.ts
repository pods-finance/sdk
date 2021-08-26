import BigNumber from "bignumber.js";
import { IProvider } from "./atoms";
import { IPoolBuilderParams } from "./poolBuilder";

export interface IOptionBuilderParams {
  address?: string;
  networkId?: number;
  provider?: IProvider;
  type: number;

  exerciseType: number;

  symbol: string;
  decimals: BigNumber;
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

  pool?: IPoolBuilderParams;
}

export interface IOptionBuilder {}
