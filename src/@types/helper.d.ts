import _ from "lodash";
import BigNumber from "bignumber.js";
import { IOption } from "./option";
import { IProvider, ISigner, Optional } from "./atoms";

export interface IHelper {
  readonly address: string;
  readonly networkId: number;
  readonly provider: IProvider;
  /** The signer should not optional! This is meant to enable throwable errors for failing/undefined signers. */
  readonly signer: Optional<ISigner>;

  /** Buy an exact optionAmount with an estimated premiumAmount. Use humanized values (no decimal padding) */
  doBuyExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Buy an estimated optionAmount with a fixed premiumAmount. Use humanized values (no decimal padding) */
  doBuyEstimated(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Mint (lock collateral for) and sell optionAmount for a (minimum) premiumAmount . Use humanized values (no decimal padding) */
  doMintAndSellExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Sell an exact optionAmount, already minted/bought, for a (min) premiumAmount. Use humanized values (no decimal padding) */
  doSellExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Alias for doSellExact */
  doResellExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Add single liquidity. Use humanized values (no decimal padding) */
  doAddSingleLiquidity(params: {
    option: IOption;
    strikeAmount: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Add dual liquidity. Use humanized values (no decimal padding) */
  doAddDualLiquidity(params: {
    option: IOption;
    tokenAAmount: BigNumber;
    tokenBAmount: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Remove dual liquidity. Use integer values from 0 to 100 */
  doRemoveLiquidity(params: {
    option: IOption;
    percentA: BigNumber;
    percentB: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Mint (lock collateral for) optionAmount. Use humanized values (no decimal padding) */
  doMint(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Unmint (unlock collateral for) optionAmount. Use humanized values (no decimal padding). At contract level, this action is triggered from the option contract, not the helper. */
  doUnmint(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Exercise optionAmount for ERC20s. Use humanized values (no decimal padding). At contract level, this action is triggered from the option contract, not the helper. Different method for utility tokens (e.g. ETH, MATIC) */
  doExerciseERC20(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Exercise optionAmount for utility tokens (ETH, MATIC, ...). Use humanized values (no decimal padding). At contract level, this action is triggered from the option contract, not the helper. Different method for utility tokens (e.g. ETH, MATIC) */
  doExerciseUtility(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function;
  }): Promise<void>;

  /** Withdraw everything available. Use humanized values (no decimal padding). At contract level, this action is triggered from the option contract, not the helper.*/
  doWithdraw(params: { option: IOption; callback?: Function }): Promise<void>;
}
