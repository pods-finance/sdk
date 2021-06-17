import _ from "lodash";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import { IHelper, IOption } from "@types";
import { expect, getDefaultDeadline, getWeb3Owner } from "../utils";
import contracts from "../contracts";

export default class Helper implements IHelper {
  address: string;
  networkId: number;
  web3: Web3;

  /**
   * ---------- CONSTRUCTOR & METHODS ----------
   */

  constructor(params: { address: string; networkId: number; web3: Web3 }) {
    this.address = params.address.toLowerCase();
    this.networkId = params.networkId;
    this.web3 = params.web3;
  }

  async doBuyExact(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber | undefined;
    callback: Function | undefined;
  }): Promise<void> {
    const { option, premiumAmount, optionAmount, deadline, callback } = params;

    expect(this.web3, "web3");
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

    const owner = await getWeb3Owner(this.web3);

    const IV = await option.pool!.getIV({ web3: this.web3 });

    const contract = contracts.instances.optionHelper(this.web3, this.address);

    await contract.methods
      .buyExactOptions(
        option.address,
        output.toFixed(0).toString(),
        input.toFixed(0).toString(),
        (deadline || (await getDefaultDeadline(this.web3)))
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
  async doBuyEstimated(params: {
    option: IOption;
    optionAmount: BigNumber;
    premiumAmount: BigNumber;
    deadline?: BigNumber | undefined;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, premiumAmount, optionAmount, deadline, callback } = params;

    expect(this.web3, "web3");
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

    const owner = await getWeb3Owner(this.web3);

    const IV = await option.pool!.getIV({ web3: this.web3 });

    const contract = contracts.instances.optionHelper(this.web3, this.address);

    await contract.methods
      .buyOptionsWithExactTokens(
        option.address,
        output.toFixed(0).toString(),
        input.toFixed(0).toString(),
        (deadline || (await getDefaultDeadline(this.web3)))
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

    expect(this.web3, "web3");
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

    const owner = await getWeb3Owner(this.web3);

    const IV = await option.pool!.getIV({ web3: this.web3 });

    const contract = contracts.instances.optionHelper(this.web3, this.address);

    await contract.methods
      .mintAndSellOptions(
        option.address,
        input.toFixed(0).toString(),
        output.toFixed(0).toString(),
        (deadline || (await getDefaultDeadline(this.web3)))
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

    expect(this.web3, "web3");
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

    const owner = await getWeb3Owner(this.web3);

    const IV = await option.pool!.getIV({ web3: this.web3 });

    const contract = contracts.instances.optionHelper(this.web3, this.address);

    await contract.methods
      .sellExactOptions(
        option.address,
        input.toFixed(0).toString(),
        output.toFixed(0).toString(),
        (deadline || (await getDefaultDeadline(this.web3)))
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

  async doAddLiquidity(params: {
    option: IOption;
    tokenAAmount: BigNumber;
    tokenBAmount: BigNumber;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, tokenAAmount, tokenBAmount, callback } = params;

    expect(this.web3, "web3");
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

    const owner = await getWeb3Owner(this.web3);
    const contract = contracts.instances.optionHelper(this.web3, this.address);

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

    expect(this.web3, "web3");
    expect(option, "option");
    expect(option.pool, "pool (option)");
    expect(percentA, "percentA", "object");
    expect(percentB, "percentB", "object");

    const owner = await getWeb3Owner(this.web3);
    const contract = contracts.instances.pool(this.web3, option.pool!.address);

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
  async doMint(params: {
    option: IOption;
    optionAmount: BigNumber;
    callback?: Function | undefined;
  }): Promise<void> {
    const { option, optionAmount, callback } = params;

    expect(this.web3, "web3");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const output = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const owner = await getWeb3Owner(this.web3);

    const contract = contracts.instances.optionHelper(this.web3, this.address);

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

    expect(this.web3, "web3");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const owner = await getWeb3Owner(this.web3);

    const contract = contracts.instances.option(this.web3, option.address);

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

    expect(this.web3, "web3");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const input = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const owner = await getWeb3Owner(this.web3);

    const contract = contracts.instances.option(this.web3, option.address);

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

    expect(this.web3, "web3");
    expect(option, "option");
    expect(option.decimals, "decimals");
    expect(optionAmount, "optionAmount", "object");

    const input = new BigNumber(optionAmount).multipliedBy(
      new BigNumber(10).pow(option.decimals!)
    );

    const owner = await getWeb3Owner(this.web3);

    const contract = contracts.instances.option(this.web3, option.address);

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

    expect(this.web3, "web3");
    expect(option, "option");

    const owner = await getWeb3Owner(this.web3);
    const contract = contracts.instances.option(this.web3, option.address);

    await contract.methods.withdraw().send(
      {
        from: owner,
      },
      callback || _.noop
    );
  }
}
