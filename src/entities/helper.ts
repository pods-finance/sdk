import _ from "lodash";
import BigNumber from "bignumber.js";
import { ISigner, IHelper, IOption, IProvider } from "@types";
import { expect, getDefaultDeadline, getOwner } from "../utils";
import contracts from "../contracts";

export default class Helper implements IHelper {
  address: string;
  networkId: number;
  provider: IProvider;
  signer: ISigner;

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
    this.signer = params.provider.getSigner();
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
      this.signer,
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

    const owner = await getOwner(this.provider);

    const IV = await option.pool!.getIV({ provider: this.provider });

    const contract = contracts.instances.optionHelper(
      this.provider,
      this.address
    );

    await contract.methods
      .buyOptionsWithExactTokens(
        option.address,
        output.toFixed(0).toString(),
        input.toFixed(0).toString(),
        (deadline || (await getDefaultDeadline(this.provider)))
          .toFixed(0)
          .toString(),
        IV.raw.toFixed(0).toString()
      )
      .send(
        {
          from: owner,
        },
        callback || _.noop
      );
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

    const owner = await getOwner(this.provider);

    const IV = await option.pool!.getIV({ provider: this.provider });

    const contract = contracts.instances.optionHelper(
      this.provider,
      this.address
    );

    await contract.methods
      .mintAndSellOptions(
        option.address,
        input.toFixed(0).toString(),
        output.toFixed(0).toString(),
        (deadline || (await getDefaultDeadline(this.provider)))
          .toFixed(0)
          .toString(),
        IV.raw.toFixed(0).toString()
      )
      .send(
        {
          from: owner,
        },
        callback || _.noop
      );
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

    const owner = await getOwner(this.provider);

    const IV = await option.pool!.getIV({ provider: this.provider });

    const contract = contracts.instances.optionHelper(
      this.provider,
      this.address
    );

    await contract.methods
      .sellExactOptions(
        option.address,
        input.toFixed(0).toString(),
        output.toFixed(0).toString(),
        (deadline || (await getDefaultDeadline(this.provider)))
          .toFixed(0)
          .toString(),
        IV.raw.toFixed(0).toString()
      )
      .send(
        {
          from: owner,
        },
        callback || _.noop
      );
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

    const owner = await getOwner(this.provider);
    const contract = contracts.instances.optionHelper(
      this.provider,
      this.address
    );

    await contract.methods
      .addLiquidity(
        option.address,
        amountA.toFixed(0).toString(),
        amountB.toFixed(0).toString()
      )
      .send(
        {
          from: owner,
        },
        callback || _.noop
      );
  }
  async doRemoveLiquidity(params: {
    option: IOption;
    percentA: BigNumber;
    percentB: BigNumber;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, percentA, percentB, callback } = params;

    expect(this.provider, "provider");
    expect(option, "option");
    expect(option.pool, "pool (option)");
    expect(percentA, "percentA", "object");
    expect(percentB, "percentB", "object");

    const owner = await getOwner(this.provider);
    const contract = contracts.instances.pool(
      this.provider,
      option.pool!.address
    );

    await contract.methods
      .removeLiquidity(
        percentA.toFixed(0).toString(),
        percentB.toFixed(0).toString()
      )
      .send(
        {
          from: owner,
        },
        callback || _.noop
      );
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
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const output = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const owner = await getOwner(this.provider);

    const contract = contracts.instances.optionHelper(
      this.provider,
      this.address
    );

    await contract.methods
      .mint(option.address, output.toFixed(0).toString())
      .send(
        {
          from: owner,
        },
        callback || _.noop
      );
  }
  async doUnmint(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.provider, "provider");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const owner = await getOwner(this.provider);

    const contract = contracts.instances.option(this.provider, option.address);

    const input = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    await contract.methods.unmint(input.toFixed(0).toString()).send(
      {
        from: owner,
      },
      callback || _.noop
    );
  }
  async doExerciseERC20(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.provider, "provider");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const input = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const owner = await getOwner(this.provider);

    const contract = contracts.instances.option(this.provider, option.address);

    await contract.methods.exercise(input.toFixed(0).toString()).send(
      {
        from: owner,
      },
      callback || _.noop
    );
  }

  async doExerciseUtility(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.provider, "provider");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const input = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const owner = await getOwner(this.provider);

    const contract = contracts.instances.option(this.provider, option.address);

    await contract.methods.exerciseEth().send(
      {
        from: owner,
        value: input.toFixed(0).toString(), // The amount of underlying will be 1:1 with the amount of options
      },
      callback || _.noop
    );
  }

  async doWithdraw(params: {
    option: IOption;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, callback } = params;

    expect(this.provider, "provider");
    expect(option, "option");

    const owner = await getOwner(this.provider);
    const contract = contracts.instances.option(this.provider, option.address);

    await contract.methods.withdraw().send(
      {
        from: owner,
      },
      callback || _.noop
    );
  }
}
