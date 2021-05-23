import _ from "lodash";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import { IValue } from "./value";
import { IOption } from "./option";

export interface IHelper {
  readonly address: string;

  /** Buy an exact optionAmount with an estimated premiumAmount. Use humanized values (no decimal padding) */
  doBuy(params: {
    web3: Web3;
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber;
    callback?: Function;
  }): Promise<IValue>;

  /** Buy an estimated optionAmount with a fixed premiumAmount. Use humanized values (no decimal padding) */
  doEstimateBuy(params: {
    web3: Web3;
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber;
    callback?: Function;
  }): Promise<IValue>;

  /** Mint (lock collateral for) and sell optionAmount for a (minimum) premiumAmount . Use humanized values (no decimal padding) */
  doMintAndSell(params: {
    web3: Web3;
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber;
    callback?: Function;
  }): Promise<IValue>;

  /** Sell an exact optionAmount, already minted/bought, for a (min) premiumAmount. Use humanized values (no decimal padding) */
  doSell(params: {
    web3: Web3;
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber;
    callback?: Function;
  }): Promise<IValue>;

  /** Add liquidity. Use humanized values (no decimal padding) */
  doAddLiquidity(params: {
    web3: Web3;
    option: IOption;
    tokenAAmount: BigNumber;
    tokenBAmount: BigNumber;
    callback?: Function;
  }): Promise<IValue>;

  /** Remove liquidity. Use integer values from 0 to 100 */
  doRemoveLiquidity(params: {
    web3: Web3;
    option: IOption;
    percentA: BigNumber;
    percentB: BigNumber;
    callback?: Function;
  }): Promise<IValue>;

  /** Mint (lock collateral for) optionAmount. Use humanized values (no decimal padding) */
  doMint(params: {
    web3: Web3;
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function;
  }): Promise<IValue>;

  /** Unmint (unlock collateral for) optionAmount. Use humanized values (no decimal padding). At contract level, this action is triggered from the option contract, not the helper. */
  doUnmint(params: {
    web3: Web3;
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function;
  }): Promise<IValue>;

  /** Exercise optionAmount. Use humanized values (no decimal padding). At contract level, this action is triggered from the option contract, not the helper. Different method for utility tokens (e.g. ETH, MATIC) */
  doExercise(params: {
    web3: Web3;
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function;
  }): Promise<IValue>;

  /** Withdraw everything available. Use humanized values (no decimal padding). At contract level, this action is triggered from the option contract, not the helper.*/
  doWithdraw(params: {
    web3: Web3;
    option: IOption;
    callback?: Function;
  }): void;
}
