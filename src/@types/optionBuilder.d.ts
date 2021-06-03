import BigNumber from "bignumber.js";
import Web3 from "web3";
import { IPoolBuilderParams } from "./poolBuilder";

export interface IOptionBuilderParams {
  address?: string;
  networkId?: number;
  web3?: Web3;
  type: number;

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
