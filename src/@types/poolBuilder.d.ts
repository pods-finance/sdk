import BigNumber from "bignumber.js";

export interface IPoolBuilderParams {
  address?: string;
  networkId?: number;

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
