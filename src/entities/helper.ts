import _ from "lodash";
import BigNumber from "bignumber.js";
import {
  ISigner,
  IHelper,
  IHelperOverrides,
  IOption,
  IProvider,
  ITransactionError,
  Optional,
} from "@types";
import { expect, getDefaultDeadline, getOverrides, scaleUp } from "../utils";
import contracts from "../contracts";
import { ALLOW_LOGS } from "../constants/globals";

export default class Helper implements IHelper {
  address: string;
  networkId: number;
  provider: IProvider;
  signer: Optional<ISigner>;

  /**
   * ---------- CONSTRUCTOR & METHODS ----------
   */

  constructor(params: {
    address: string;
    networkId: number;
    provider: IProvider;
  }) {
    this.address = params.address.toLowerCase();
    this.networkId = params.networkId;
    this.provider = params.provider;
    try {
      this.signer = params.provider.getSigner();
    } catch (error) {
      this.signer = undefined;
      if (ALLOW_LOGS())
        console.error("Pods SDK", {
          pods: "The expected JSONRpcProvider dosn't have a proper signer.",
          ethers: error,
        });
    }
  }

  async doBuyExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber | undefined;
    overrides?: IHelperOverrides;
    callback: Function | undefined;
  }): Promise<void> {
    const { option, premiumAmount, optionAmount, deadline, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.pool, "pool (option)");
    expect(option.pool?.tokenB, "tokenB (option pool)");
    expect(option.pool?.tokenB?.decimals, "decimals (option pool tokenB)");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");
    expect(premiumAmount, "premiumAmount", "object");

    const input = scaleUp(premiumAmount, option.pool!.tokenB!.decimals);
    const output = scaleUp(optionAmount, option.decimals!);

    const IV = await option.pool!.getIV({ provider: this.provider });

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const args = [
      option.address,
      output.toFixed(0).toString(),
      input.toFixed(0).toString(),
      (deadline || (await getDefaultDeadline(this.provider)))
        .toFixed(0)
        .toString(),
      IV.raw.toFixed(0).toString(),
    ];

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.buyExactOptions,
      args
    );

    const transaction = await contract.buyExactOptions(...args, overrides);

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }
  async doBuyEstimated(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber | undefined;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, premiumAmount, optionAmount, deadline, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.pool, "pool (option)");
    expect(option.pool?.tokenB, "tokenB (option pool)");
    expect(option.pool?.tokenB?.decimals, "decimals (option pool tokenB)");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");
    expect(premiumAmount, "premiumAmount", "object");

    const input = scaleUp(premiumAmount, option.pool!.tokenB!.decimals);
    const output = scaleUp(optionAmount, option.decimals!);

    const IV = await option.pool!.getIV({ provider: this.provider });

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const args = [
      option.address,
      output.toFixed(0).toString(),
      input.toFixed(0).toString(),
      (deadline || (await getDefaultDeadline(this.provider)))
        .toFixed(0)
        .toString(),
      IV.raw.toFixed(0).toString(),
    ];

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.buyOptionsWithExactTokens,
      args
    );

    const transaction = await contract.buyOptionsWithExactTokens(
      ...args,
      overrides
    );

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }

  /**
   * Mint and sell an exact amount of options, labeled as "writing" in the app
   * @param params
   */
  async doMintAndSellExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber | undefined;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, premiumAmount, optionAmount, deadline, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.pool, "pool (option)");
    expect(option.pool?.tokenB, "tokenB (option pool)");
    expect(option.pool?.tokenB?.decimals, "decimals (option pool tokenB)");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");
    expect(premiumAmount, "premiumAmount", "object");

    const input = scaleUp(optionAmount, option.decimals!);
    const output = scaleUp(premiumAmount, option.pool!.tokenB!.decimals);

    const IV = await option.pool!.getIV({ provider: this.provider });

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const args = [
      option.address,
      input.toFixed(0).toString(),
      output.toFixed(0).toString(),
      (deadline || (await getDefaultDeadline(this.provider)))
        .toFixed(0)
        .toString(),
      IV.raw.toFixed(0).toString(),
    ];

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.mintAndSellOptions,
      args
    );

    const transaction = await contract.mintAndSellOptions(...args, overrides);

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }

  async doSellExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber | undefined;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, premiumAmount, optionAmount, deadline, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.pool, "pool (option)");
    expect(option.pool?.tokenB, "tokenB (option pool)");
    expect(option.pool?.tokenB?.decimals, "decimals (option pool tokenB)");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");
    expect(premiumAmount, "premiumAmount", "object");

    const input = scaleUp(optionAmount, option.decimals!);
    const output = scaleUp(premiumAmount, option.pool!.tokenB!.decimals);

    const IV = await option.pool!.getIV({ provider: this.provider });

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const args = [
      option.address,
      input.toFixed(0).toString(),
      output.toFixed(0).toString(),
      (deadline || (await getDefaultDeadline(this.provider)))
        .toFixed(0)
        .toString(),
      IV.raw.toFixed(0).toString(),
    ];

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.sellExactOptions,
      args
    );

    const transaction = await contract.sellExactOptions(...args, overrides);

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }
  async doResellExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber | undefined;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    return this.doSellExact(params);
  }
  async doRemoveLiquidity(params: {
    option: IOption;
    percentA: BigNumber;
    percentB: BigNumber;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, percentA, percentB, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.pool, "pool (option)");
    expect(percentA, "percentA", "object");
    expect(percentB, "percentB", "object");

    const contract = contracts.instances.pool(
      this.signer!,
      option.pool!.address
    );

    const args = [
      percentA.toFixed(0).toString(),
      percentB.toFixed(0).toString(),
    ];

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.removeLiquidity,
      args
    );

    const transaction = await contract.removeLiquidity(...args, overrides);

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }

  async doAddLiquidityWithOptionsAndStrike(params: {
    option: IOption;
    tokenAAmount: BigNumber;
    tokenBAmount: BigNumber;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, tokenAAmount, tokenBAmount, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.pool, "pool (option)");
    expect(option.pool?.tokenB, "tokenB (option pool)");
    expect(option.pool?.tokenB?.decimals, "decimals (option pool tokenB)");
    expect(option.decimals, "decimals");
    expect(tokenAAmount, "tokenAAmount", "object");
    expect(tokenBAmount, "tokenBAmount", "object");

    const amountA = scaleUp(tokenAAmount, option.decimals!);
    const amountB = scaleUp(tokenBAmount, option.pool!.tokenB!.decimals);

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const args = [
      option.address,
      amountA.toFixed(0).toString(),
      amountB.toFixed(0).toString(),
    ];

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.addLiquidity,
      args
    );

    const transaction = await contract.addLiquidity(...args, overrides);

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }

  async doMintPutAndAddLiquidityWithCollateral(params: {
    option: IOption;
    tokenBAmount: BigNumber;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, tokenBAmount, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.pool, "pool (option)");
    expect(option.pool?.tokenB, "tokenB (option pool)");
    expect(option.pool?.tokenB?.decimals, "decimals (option pool tokenB)");
    expect(tokenBAmount, "tokenBAmount", "object");

    if (option.isCall())
      throw new Error(
        "Adding liquidity with a single asset is not allowed for calls."
      );

    const amountB = scaleUp(tokenBAmount, option.pool!.tokenB!.decimals);

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const args = [option.address, amountB.toFixed(0).toString()];

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.mintAndAddLiquidityWithCollateral,
      args
    );

    const transaction = await contract.mintAndAddLiquidityWithCollateral(
      ...args,
      overrides
    );

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }

  async doMintAndAddLiquidityWithCollateralAndStrike(params: {
    option: IOption;
    tokenAAmount: BigNumber;
    tokenBAmount: BigNumber;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, tokenAAmount, tokenBAmount, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.collateral, "collateral (option)");
    expect(option.collateral?.decimals, "decimals (option collateral)");
    expect(option.pool?.tokenB?.decimals, "decimals (option pool tokenB)");
    expect(option.pool, "pool (option)");
    expect(option.pool?.tokenB, "tokenB (option pool)");
    expect(option.pool?.tokenB?.decimals, "decimals (option pool tokenB)");
    expect(tokenAAmount, "tokenAAmount", "object");
    expect(tokenBAmount, "tokenBAmount", "object");

    const amountA = scaleUp(tokenAAmount, option.collateral!.decimals!);
    const amountB = scaleUp(tokenBAmount, option.pool!.tokenB!.decimals);

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const args = [
      option.address,
      amountA.toFixed(0).toString(),
      amountB.toFixed(0).toString(),
    ];

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.mintAndAddLiquidity,
      args
    );

    const transaction = await contract.mintAndAddLiquidity(...args, overrides);

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }

  async doMint(params: {
    option: IOption;
    optionAmount: BigNumber;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(option.collateral, "collateral (option)");
    expect(optionAmount, "optionAmount", "object");

    if (option.isCall() && option.collateral!.isUtility())
      throw new Error(
        "Minting from the Option Helper with utility tokens (e.g. ETH, MATIC) is not allowed for calls. Please interact with the option contract itself."
      );

    const output = scaleUp(optionAmount, option.decimals!);
    

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const args = [option.address, output.toFixed(0).toString()];

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.mint,
      args
    );

    const transaction = await contract.mint(...args, overrides);
    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }

  async doUnmint(params: {
    option: IOption;
    optionAmount: BigNumber;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const contract = contracts.instances.option(this.signer!, option.address);

    const input = scaleUp(optionAmount, option.decimals!);

    const args = [input.toFixed(0).toString()];

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.unmint,
      args
    );

    const transaction = await contract.unmint(...args, overrides);

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }
  async doExerciseERC20(params: {
    option: IOption;
    optionAmount: BigNumber;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const input = scaleUp(optionAmount, option.decimals!);

    const contract = contracts.instances.option(this.signer!, option.address);

    const args = [input.toFixed(0).toString()];

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.exercise,
      args
    );

    const transaction = await contract.exercise(...args, overrides);

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }

  async doExerciseUtility(params: {
    option: IOption;
    optionAmount: BigNumber;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const input = scaleUp(optionAmount, option.decimals!);

    const contract = contracts.instances.option(this.signer!, option.address);

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.exerciseEth,
      []
    );

    const transaction = await contract.exerciseEth({
      ...overrides,
      value: input.toFixed(0).toString(),
    });

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }

  async doWithdraw(params: {
    option: IOption;
    overrides?: IHelperOverrides;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");

    const contract = contracts.instances.option(this.signer!, option.address);

    const overrides = await getOverrides(
      params.overrides,
      contract.estimateGas.withdraw,
      []
    );

    const transaction = await contract.withdraw(overrides);

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, (error as ITransactionError).transactionHash);
    }
  }
}
