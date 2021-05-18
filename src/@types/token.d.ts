import BigNumber from "bignumber.js";
import Web3 from "web3";

export interface IToken {
  readonly address: string;
  readonly decimals: BigNumber;
  readonly symbol: string;
  readonly name: string;
  readonly networkId: number;

  getBalance(params: { web3: Web3; owner: string }): Promise<BigNumber>;
  /**
   * Check the ERC20 allowance for
   * @param params
   */
  getAllowance(params: {
    web3: Web3;
    owner: string;
    spender?: string;
  }): Promise<BigNumber>;
}
