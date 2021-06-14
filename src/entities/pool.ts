import _ from "lodash";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import Token from "./token";
import contracts from "../contracts";
import { zero } from "../utils";

import {
  IToken,
  IValue,
  IPool,
  IPoolBuilderParams,
  IPoolIndicators,
  Optional,
} from "@types";
import { ALLOW_LOGS } from "../constants/globals";
import { expect } from "../utils";

export default class Pool implements IPool {
  /**
   * ---------- VARIABLES ----------
   */

  public readonly address: string;
  public readonly networkId: number;

  private _web3?: Web3;

  private _tokenA?: IToken;
  private _tokenB?: IToken;

  private _factoryAddress?: string;
  private _optionAddress?: string;

  /**
   * ---------- SETTERS & GETTERS ----------
   */

  public get web3(): Optional<Web3> {
    return this._web3;
  }
  public set web3(value: Optional<Web3>) {
    this._web3 = value;
  }

  public get tokenA(): Optional<IToken> {
    return this._tokenA;
  }
  public set tokenA(value: Optional<IToken>) {
    this._tokenA = value;
  }
  public get tokenB(): Optional<IToken> {
    return this._tokenB;
  }
  public set tokenB(value: Optional<IToken>) {
    this._tokenB = value;
  }

  public get factoryAddress(): Optional<string> {
    return this._factoryAddress;
  }
  public set factoryAddress(value: Optional<string>) {
    this._factoryAddress = value;
  }

  public get optionAddress(): Optional<string> {
    return this._optionAddress;
  }
  public set optionAddress(value: Optional<string>) {
    this._optionAddress = value;
  }

  /**
   * ---------- CONSTRUCTOR & METHODS ----------
   */

  constructor(params: { address: string; networkId: number }) {
    this.address = params.address.toLowerCase();
    this.networkId = params.networkId;
  }

  init(params: IPoolBuilderParams): IPool {
    this.factoryAddress = _.toString(params.factoryAddress).toLowerCase();
    this.optionAddress = _.toString(params.optionAddress).toLowerCase();

    this.web3 = params.web3;

    this.tokenA = new Token({
      address: params.tokenA,
      symbol: params.tokenASymbol,
      decimals: params.tokenADecimals,
      networkId: this.networkId,
    });

    this.tokenB = new Token({
      address: params.tokenB,
      symbol: params.tokenBSymbol,
      decimals: params.tokenBDecimals,
      networkId: this.networkId,
    });

    return this;
  }

  async getIV(params: { web3?: Web3 } = {}): Promise<IValue> {
    expect(this.web3 || params.web3, "web3");

    const contract = contracts.instances.pool(
      (this.web3 || params.web3)!,
      this.address
    );
    const properties = await contract.methods.priceProperties().call();

    const IV: IValue = {
      raw: new BigNumber(_.get(properties, "currentIV")),
      humanized: new BigNumber(_.get(properties, "currentIV")).dividedBy(
        new BigNumber(10).pow(18)
      ),
    };

    return IV;
  }

  async getBuyingPrice(params: {
    amount: BigNumber;
    web3?: Web3;
  }): Promise<{ [key: string]: IValue }> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");
    expect(this.web3 || params.web3, "web3");

    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(this.tokenA!.decimals)
      );
      const contract = contracts.instances.pool(
        (this.web3 || params.web3)!,
        this.address
      );

      const {
        amountBIn,
        feesTokenA,
        feesTokenB,
      } = await contract.methods
        .getOptionTradeDetailsExactAOutput(sanitized.toFixed(0).toString())
        .call();

      const value: IValue = {
        raw: new BigNumber(amountBIn),
        humanized: new BigNumber(amountBIn).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const feesA: IValue = {
        raw: new BigNumber(feesTokenA),
        humanized: new BigNumber(feesTokenA).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const feesB: IValue = {
        raw: new BigNumber(feesTokenB),
        humanized: new BigNumber(feesTokenB).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return { value, feesA, feesB };
    } catch (error) {
      if (ALLOW_LOGS) console.error("Pods SDK", error);
    }
    return { value: zero, feesA: zero, feesB: zero };
  }

  async getSellingPrice(params: {
    amount: BigNumber;
    web3?: Web3;
  }): Promise<{ [key: string]: IValue }> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");
    expect(this.web3 || params.web3, "web3");

    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(this.tokenA!.decimals)
      );
      const contract = contracts.instances.pool(
        (this.web3 || params.web3)!,
        this.address
      );

      const {
        amountBOut,
        feesTokenA,
        feesTokenB,
      } = await contract.methods
        .getOptionTradeDetailsExactAInput(sanitized.toFixed(0).toString())
        .call();

      const value: IValue = {
        raw: new BigNumber(amountBOut),
        humanized: new BigNumber(amountBOut).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const feesA: IValue = {
        raw: new BigNumber(feesTokenA),
        humanized: new BigNumber(feesTokenA).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const feesB: IValue = {
        raw: new BigNumber(feesTokenB),
        humanized: new BigNumber(feesTokenB).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return { value, feesA, feesB };
    } catch (error) {
      if (ALLOW_LOGS) console.error("Pods SDK", error);
    }
    return { value: zero, feesA: zero, feesB: zero };
  }

  async getABPrice(
    params: { web3?: Web3 } = {}
  ): Promise<{ [key: string]: IValue }> {
    expect(this.tokenB, "tokenB");
    expect(this.web3 || params.web3, "web3");

    try {
      const contract = contracts.instances.pool(
        (this.web3 || params.web3)!,
        this.address
      );

      const { 0: result } = await contract.methods.getABPrice().call();

      const value: IValue = {
        raw: new BigNumber(result),
        humanized: new BigNumber(result).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return { value };
    } catch (error) {
      if (ALLOW_LOGS) console.error("Pods SDK", error);
    }
    return { value: zero };
  }

  async getBuyingEstimateForPrice(params: {
    amount: BigNumber;
    web3?: Web3;
  }): Promise<{ [key: string]: IValue }> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");
    expect(this.web3 || params.web3, "web3");

    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(this.tokenB!.decimals)
      );
      const contract = contracts.instances.pool(
        (this.web3 || params.web3)!,
        this.address
      );

      const {
        amountAOut,
        feesTokenA,
        feesTokenB,
      } = await contract.methods
        .getOptionTradeDetailsExactBInput(sanitized.toFixed(0).toString())
        .call();

      const value: IValue = {
        raw: new BigNumber(amountAOut),
        humanized: new BigNumber(amountAOut).dividedBy(
          new BigNumber(10).pow(this.tokenA!.decimals)
        ),
      };

      const feesA: IValue = {
        raw: new BigNumber(feesTokenA),
        humanized: new BigNumber(feesTokenA).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const feesB: IValue = {
        raw: new BigNumber(feesTokenB),
        humanized: new BigNumber(feesTokenB).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return { value, feesA, feesB };
    } catch (error) {
      if (ALLOW_LOGS) console.error("Pods SDK", error);
    }
    return { value: zero, feesA: zero, feesB: zero };
  }

  async getDeamortizedBalances(
    params: { web3?: Web3 } = {}
  ): Promise<IValue[]> {
    expect(this.web3 || params.web3, "web3");
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");

    try {
      const contract = contracts.instances.pool(
        (this.web3 || params.web3)!,
        this.address
      );
      const resultDBA = await contract.methods
        .deamortizedTokenABalance()
        .call();
      const resultDBB = await contract.methods
        .deamortizedTokenBBalance()
        .call();

      const DBA: IValue = {
        raw: new BigNumber(resultDBA),
        humanized: new BigNumber(resultDBA).dividedBy(
          new BigNumber(10).pow(this.tokenA!.decimals)
        ),
      };

      const DBB: IValue = {
        raw: new BigNumber(resultDBB),
        humanized: new BigNumber(resultDBB).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return [DBA, DBB];
    } catch (error) {
      if (ALLOW_LOGS) console.error("Pods SDK", error);
    }

    return [zero, zero];
  }

  async getFeeBalances(params: { web3?: Web3 } = {}): Promise<IValue[]> {
    expect(this.tokenB, "tokenB");
    expect(this.web3 || params.web3, "web3");

    try {
      const contract = contracts.instances.pool(
        (this.web3 || params.web3)!,
        this.address
      );

      const feePoolAAddress = await contract.methods.feePoolA().call();
      const feePoolBAddress = await contract.methods.feePoolB().call();
      const feeBalanceA = await this.tokenB!.getBalance({
        web3: (this.web3 || params.web3)!,
        owner: feePoolAAddress,
      });
      const feeBalanceB = await this.tokenB!.getBalance({
        web3: (this.web3 || params.web3)!,
        owner: feePoolBAddress,
      });

      const FBA: IValue = {
        raw: new BigNumber(feeBalanceA),
        humanized: new BigNumber(feeBalanceA).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const FBB: IValue = {
        raw: new BigNumber(feeBalanceB),
        humanized: new BigNumber(feeBalanceB).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return [FBA, FBB];
    } catch (error) {
      if (ALLOW_LOGS) console.error("Pods SDK", error);
    }

    return [zero, zero];
  }

  async getTotalBalances(params: { web3?: Web3 } = {}): Promise<IValue[]> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");
    expect(this.web3 || params.web3, "web3");

    try {
      const contract = contracts.instances.pool(
        (this.web3 || params.web3)!,
        this.address
      );
      const result = await contract.methods.getPoolBalances().call();
      const TBA: IValue = {
        raw: new BigNumber(result[0]),
        humanized: new BigNumber(result[0]).dividedBy(
          new BigNumber(10).pow(this.tokenA!.decimals)
        ),
      };
      const TBB: IValue = {
        raw: new BigNumber(result[1]),
        humanized: new BigNumber(result[1]).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };
      return [TBA, TBB];
    } catch (error) {
      if (ALLOW_LOGS) console.error("Pods SDK", error);
    }

    return [zero, zero];
  }

  async getParameters(params: { web3?: Web3 } = {}): Promise<IPoolIndicators> {
    expect(this.web3 || params.web3, "web3");

    if (!this.web3) this.web3 = params.web3;

    const result: IPoolIndicators = {};
    const queryIV = await _.attemptAsync(async () => this.getIV());
    result.impliedVolatility = _.isError(queryIV) ? null : queryIV;

    const totalBalances = await _.attemptAsync(async () =>
      this.getTotalBalances()
    );
    result.totalBalanceA = totalBalances[0];
    result.totalBalanceB = totalBalances[1];

    const deamortizedBalances = await _.attemptAsync(async () =>
      this.getTotalBalances()
    );
    result.deamortizedBalanceA = deamortizedBalances[0];
    result.deamortizedBalanceB = deamortizedBalances[1];

    const feeBalances = await _.attemptAsync(async () => this.getFeeBalances());
    result.feeAmountPoolA = feeBalances[0];
    result.feeAmountPoolB = feeBalances[1];

    const abPrice = await _.attemptAsync(async () => this.getABPrice());
    result.abPrice = abPrice;

    return result;
  }

  async getCap(params: { web3?: Web3; manager: string }): Promise<IValue> {
    const { web3, manager } = params;

    expect(this.web3 || web3, "web3");
    expect(this.tokenB, "tokenB");
    expect(manager, "manager (address)");

    try {
      const managerContract = contracts.instances.configurationManager(
        (this.web3 || params.web3)!,
        manager
      );
      const providerAddress = await managerContract.methods
        .getCapProvider()
        .call();
      const providerContract = contracts.instances.capProvider(
        (this.web3 || params.web3)!,
        providerAddress
      );
      const result = await providerContract.methods.getCap(this.address).call();

      const size: IValue = {
        raw: new BigNumber(result),
        humanized: new BigNumber(result).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return size;
    } catch (error) {
      if (ALLOW_LOGS) console.error("Pods SDK", error);
    }

    return zero;
  }

  async getUserPosition(params: {
    user: string;
    web3?: Web3;
  }): Promise<IValue[]> {
    const { user, web3 } = params;

    expect(this.tokenB, "tokenA");
    expect(this.tokenB, "tokenB");
    expect(this.web3 || web3, "web3");
    expect(user, "user (address)");

    try {
      const contract = contracts.instances.pool(
        (this.web3 || params.web3)!,
        this.address
      );
      const result = await contract.methods
        .getRemoveLiquidityAmounts(
          new BigNumber(100).toString(),
          new BigNumber(100).toString(),
          user
        )
        .call();

      const UBA: IValue = {
        raw: new BigNumber(result[0]),
        humanized: new BigNumber(result[0]).dividedBy(
          new BigNumber(10).pow(this.tokenA!.decimals)
        ),
      };
      const UBB: IValue = {
        raw: new BigNumber(result[1]),
        humanized: new BigNumber(result[1]).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return [UBA, UBB];
    } catch (error) {
      if (ALLOW_LOGS) console.error("Pods SDK", error);
    }

    return [zero, zero];
  }
}
