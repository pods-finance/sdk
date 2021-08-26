import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { IProvider, ISigner, Optional } from "./atoms";

export interface IToken {
  readonly address: string;
  readonly decimals: BigNumber;
  readonly symbol: string;
  readonly name: string;
  readonly networkId: number;

  isUtility(): boolean;
  isUtilityWrapped(): boolean;

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

  /**
   * Allow an ERC20 spending
   * @param params
   */
  doAllow(params: {
    signer: ISigner;
    spender?: string;
    amount?: BigNumber;
  }): Promise<Optional<ethers.providers.TransactionReceipt>>;
}
