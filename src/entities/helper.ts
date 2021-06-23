import _ from "lodash";
import BigNumber from "bignumber.js";
import { ISigner, IHelper, IOption, IProvider, Optional } from "@types";
import { expect, getDefaultDeadline } from "../utils";
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
      if (ALLOW_LOGS)
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

    const input = new BigNumber(premiumAmount).multipliedBy(
      new BigNumber(10).pow(option.pool!.tokenB!.decimals)
    );
    const output = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const IV = await option.pool!.getIV({ provider: this.provider });

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const transaction = await contract.buyExactOptions(
      option.address,
      output.toFixed(0).toString(),
      input.toFixed(0).toString(),
      (deadline || (await getDefaultDeadline(this.provider)))
        .toFixed(0)
        .toString(),
      IV.raw.toFixed(0).toString()
    );

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, error.transactionHash);
    }
  }
  async doBuyEstimated(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber | undefined;
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

    const input = new BigNumber(premiumAmount).multipliedBy(
      new BigNumber(10).pow(option.pool!.tokenB!.decimals)
    );
    const output = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const IV = await option.pool!.getIV({ provider: this.provider });

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const transaction = await contract.buyOptionsWithExactTokens(
      option.address,
      output.toFixed(0).toString(),
      input.toFixed(0).toString(),
      (deadline || (await getDefaultDeadline(this.provider)))
        .toFixed(0)
        .toString(),
      IV.raw.toFixed(0).toString()
    );

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, error.transactionHash);
    }
  }

  async doMintAndSellExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber | undefined;
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

    const input = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const output = new BigNumber(premiumAmount).multipliedBy(
      new BigNumber(10).pow(option.pool!.tokenB!.decimals)
    );

    const IV = await option.pool!.getIV({ provider: this.provider });

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const transaction = await contract.mintAndSellOptions(
      option.address,
      input.toFixed(0).toString(),
      output.toFixed(0).toString(),
      (deadline || (await getDefaultDeadline(this.provider)))
        .toFixed(0)
        .toString(),
      IV.raw.toFixed(0).toString()
    );

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, error.transactionHash);
    }
  }

  async doSellExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber | undefined;
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

    const input = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const output = new BigNumber(premiumAmount).multipliedBy(
      new BigNumber(10).pow(option.pool!.tokenB!.decimals)
    );

    const IV = await option.pool!.getIV({ provider: this.provider });

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const transaction = await contract.sellExactOptions(
      option.address,
      input.toFixed(0).toString(),
      output.toFixed(0).toString(),
      (deadline || (await getDefaultDeadline(this.provider)))
        .toFixed(0)
        .toString(),
      IV.raw.toFixed(0).toString()
    );

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, error.transactionHash);
    }
  }
  async doResellExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber | undefined;
    callback?: Function | undefined;
  }): Promise<void> {
    return this.doSellExact(params);
  }

  async doAddDualLiquidity(params: {
    option: IOption;
    tokenAAmount: BigNumber;
    tokenBAmount: BigNumber;
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

    const amountA = new BigNumber(tokenAAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const amountB = new BigNumber(tokenBAmount).multipliedBy(
      new BigNumber(10).pow(option.pool!.tokenB!.decimals)
    );

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const transaction = await contract.addLiquidity(
      option.address,
      amountA.toFixed(0).toString(),
      amountB.toFixed(0).toString()
    );

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, error.transactionHash);
    }
  }
  async doRemoveLiquidity(params: {
    option: IOption;
    percentA: BigNumber;
    percentB: BigNumber;
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

    const transaction = await contract.removeLiquidity(
      percentA.toFixed(0).toString(),
      percentB.toFixed(0).toString()
    );

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, error.transactionHash);
    }
  }

  async doAddSingleLiquidity(params: {
    option: IOption;
    strikeAmount: BigNumber;
    callback?: Function | undefined;
  }): Promise<void> {
    console.info({ params });
    throw new Error("Method not implemented yet.");
  }

  async doMint(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const output = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const contract = contracts.instances.optionHelper(
      this.signer!,
      this.address
    );

    const transaction = await contract.mint(
      option.address,
      output.toFixed(0).toString()
    );
    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, error.transactionHash);
    }
  }
  async doUnmint(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const contract = contracts.instances.option(this.signer!, option.address);

    const input = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const transaction = await contract.unmint(input.toFixed(0).toString());

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, error.transactionHash);
    }
  }
  async doExerciseERC20(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const input = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const contract = contracts.instances.option(this.signer!, option.address);

    const transaction = await contract.exercise(input.toFixed(0).toString());

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, error.transactionHash);
    }
  }

  async doExerciseUtility(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const input = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const contract = contracts.instances.option(this.signer!, option.address);

    const transaction = await contract.exerciseEth({
      value: input,
    });

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, error.transactionHash);
    }
  }

  async doWithdraw(params: {
    option: IOption;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, callback } = params;

    expect(this.provider, "provider");
    expect(this.signer, "signer");
    expect(option, "option");

    const contract = contracts.instances.option(this.signer!, option.address);

    const transaction = await contract.withdraw();

    try {
      const receipt = await transaction.wait();
      (callback || _.noop)(null, receipt.transactionHash, receipt);
    } catch (error) {
      (callback || _.noop)(error, error.transactionHash);
    }
  }
}
