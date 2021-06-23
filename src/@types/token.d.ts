import BigNumber from "bignumber.js";
import { IProvider } from "./atoms";

export interface IToken {
  readonly address: string;
  readonly decimals: BigNumber;
  readonly symbol: string;
  readonly name: string;
  readonly networkId: number;

  getBalance(params: {
    provider: IProvider;
    owner: string;
  }): Promise<BigNumber>;
  /**
   * Check the ERC20 allowance for
   * @param params
   */
  getAllowance(params: {
    provider: IProvider;
    owner: string;
    spender?: string;
  }): Promise<BigNumber>;
}
