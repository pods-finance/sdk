import BigNumber from "bignumber.js";
import { IProvider } from "./atoms";

export interface IPoolBuilderParams {
  address?: string;
  networkId?: number;

  provider?: IProvider;

  factoryAddress: string;
  optionAddress: string;

  tokenA: string;
  tokenADecimals: BigNumber;
  tokenASymbol: string;

  tokenB: string;
  tokenBDecimals: BigNumber;
  tokenBSymbol: string;
}

export interface IPoolBuilder {}
