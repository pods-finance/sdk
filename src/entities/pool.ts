import _ from "lodash";
import BigNumber from "bignumber.js";
import Token from "./token";
import contracts from "../contracts";
import { zero } from "../utils";

import {
  IProvider,
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

  private _provider?: IProvider;

  private _tokenA?: IToken;
  private _tokenB?: IToken;

  private _factoryAddress?: string;
  private _optionAddress?: string;

  private _feePoolAAddress?: string;
  private _feePoolBAddress?: string;

  /**
   * ---------- SETTERS & GETTERS ----------
   */

  public get provider(): Optional<IProvider> {
    return this._provider;
  }
  public set provider(value: Optional<IProvider>) {
    this._provider = value;
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

  public get feePoolAAddress(): Optional<string> {
    return this._feePoolAAddress;
  }
  public set feePoolAAddress(value: Optional<string>) {
    this._feePoolAAddress = value;
  }

  public get feePoolBAddress(): Optional<string> {
    return this._feePoolBAddress;
  }
  public set feePoolBAddress(value: Optional<string>) {
    this._feePoolBAddress = value;
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

    this.feePoolAAddress = _.toString(params.feePoolAAddress).toLowerCase();
    this.feePoolBAddress = _.toString(params.feePoolBAddress).toLowerCase();

    this.provider = params.provider;

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

  async getIV(params: { provider?: IProvider } = {}): Promise<IValue> {
    expect(this.provider || params.provider, "provider");

    const contract = contracts.instances.pool(
      (this.provider || params.provider)!,
      this.address
    );
    const properties = await contract.priceProperties();

    const IV: IValue = {
      raw: new BigNumber(_.get(properties, "currentIV").toString()),
      humanized: new BigNumber(
        _.get(properties, "currentIV").toString()
      ).dividedBy(new BigNumber(10).pow(18)),
    };

    return IV;
  }

  async getAdjustedIV(params: { provider?: IProvider } = {}): Promise<IValue> {
    expect(this.provider || params.provider, "provider");

    const contract = contracts.instances.pool(
      (this.provider || params.provider)!,
      this.address
    );
    const result = await contract.getAdjustedIV();

    const adjustedIV: IValue = {
      raw: new BigNumber(result.toString()),
      humanized: new BigNumber(result.toString()).dividedBy(
        new BigNumber(10).pow(18)
      ),
    };

    return adjustedIV;
  }

  async getBuyingPrice(params: {
    amount: BigNumber;
    provider?: IProvider;
  }): Promise<{ [key: string]: IValue }> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");
    expect(this.provider || params.provider, "provider");

    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(this.tokenA!.decimals)
      );
      const contract = contracts.instances.pool(
        (this.provider || params.provider)!,
        this.address
      );

      const {
        amountBIn,
        feesTokenA,
        feesTokenB,
      } = await contract.getOptionTradeDetailsExactAOutput(
        sanitized.toFixed(0).toString()
      );

      const value: IValue = {
        raw: new BigNumber(amountBIn.toString()),
        humanized: new BigNumber(amountBIn.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const feesA: IValue = {
        raw: new BigNumber(feesTokenA.toString()),
        humanized: new BigNumber(feesTokenA.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const feesB: IValue = {
        raw: new BigNumber(feesTokenB.toString()),
        humanized: new BigNumber(feesTokenB.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return { value, feesA, feesB };
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }
    return { value: zero, feesA: zero, feesB: zero };
  }

  async getSellingPrice(params: {
    amount: BigNumber;
    provider?: IProvider;
  }): Promise<{ [key: string]: IValue }> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");
    expect(this.provider || params.provider, "provider");

    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(this.tokenA!.decimals)
      );
      const contract = contracts.instances.pool(
        (this.provider || params.provider)!,
        this.address
      );

      const {
        amountBOut,
        feesTokenA,
        feesTokenB,
      } = await contract.getOptionTradeDetailsExactAInput(
        sanitized.toFixed(0).toString()
      );

      const value: IValue = {
        raw: new BigNumber(amountBOut.toString()),
        humanized: new BigNumber(amountBOut.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const feesA: IValue = {
        raw: new BigNumber(feesTokenA.toString()),
        humanized: new BigNumber(feesTokenA.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const feesB: IValue = {
        raw: new BigNumber(feesTokenB.toString()),
        humanized: new BigNumber(feesTokenB.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return { value, feesA, feesB };
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }
    return { value: zero, feesA: zero, feesB: zero };
  }

  async getABPrice(
    params: { provider?: IProvider } = {}
  ): Promise<{ [key: string]: IValue }> {
    expect(this.tokenB, "tokenB");
    expect(this.provider || params.provider, "provider");

    try {
      const contract = contracts.instances.pool(
        (this.provider || params.provider)!,
        this.address
      );

      const result = await contract.getABPrice();

      const value: IValue = {
        raw: new BigNumber(result.toString()),
        humanized: new BigNumber(result.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return { value };
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }
    return { value: zero };
  }

  async getBuyingEstimateForPrice(params: {
    amount: BigNumber;
    provider?: IProvider;
  }): Promise<{ [key: string]: IValue }> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");
    expect(this.provider || params.provider, "provider");

    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(this.tokenB!.decimals)
      );
      const contract = contracts.instances.pool(
        (this.provider || params.provider)!,
        this.address
      );

      const {
        amountAOut,
        feesTokenA,
        feesTokenB,
      } = await contract.getOptionTradeDetailsExactBInput(
        sanitized.toFixed(0).toString()
      );

      const value: IValue = {
        raw: new BigNumber(amountAOut.toString()),
        humanized: new BigNumber(amountAOut.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenA!.decimals)
        ),
      };

      const feesA: IValue = {
        raw: new BigNumber(feesTokenA.toString()),
        humanized: new BigNumber(feesTokenA.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const feesB: IValue = {
        raw: new BigNumber(feesTokenB.toString()),
        humanized: new BigNumber(feesTokenB.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return { value, feesA, feesB };
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }
    return { value: zero, feesA: zero, feesB: zero };
  }

  async getDeamortizedBalances(
    params: { provider?: IProvider } = {}
  ): Promise<IValue[]> {
    expect(this.provider || params.provider, "provider");
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");

    try {
      const contract = contracts.instances.pool(
        (this.provider || params.provider)!,
        this.address
      );
      const resultDBA = await contract.deamortizedTokenABalance();
      const resultDBB = await contract.deamortizedTokenBBalance();

      const DBA: IValue = {
        raw: new BigNumber(resultDBA.toString()),
        humanized: new BigNumber(resultDBA.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenA!.decimals)
        ),
      };

      const DBB: IValue = {
        raw: new BigNumber(resultDBB.toString()),
        humanized: new BigNumber(resultDBB.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return [DBA, DBB];
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }

    return [zero, zero];
  }

  async getFeeBalances(
    params: { provider?: IProvider } = {}
  ): Promise<IValue[]> {
    expect(this.tokenB, "tokenB");
    expect(this.provider || params.provider, "provider");

    try {
      const contract = contracts.instances.pool(
        (this.provider || params.provider)!,
        this.address
      );

      const feePoolAAddress = await contract.feePoolA();
      const feePoolBAddress = await contract.feePoolB();
      const feeBalanceA = await this.tokenB!.getBalance({
        provider: (this.provider || params.provider)!,
        owner: feePoolAAddress,
      });
      const feeBalanceB = await this.tokenB!.getBalance({
        provider: (this.provider || params.provider)!,
        owner: feePoolBAddress,
      });

      const FBA: IValue = {
        raw: new BigNumber(feeBalanceA.toString()),
        humanized: new BigNumber(feeBalanceA.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      const FBB: IValue = {
        raw: new BigNumber(feeBalanceB.toString()),
        humanized: new BigNumber(feeBalanceB.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return [FBA, FBB];
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }

    return [zero, zero];
  }

  async getTotalBalances(
    params: { provider?: IProvider } = {}
  ): Promise<IValue[]> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");
    expect(this.provider || params.provider, "provider");

    try {
      const contract = contracts.instances.pool(
        (this.provider || params.provider)!,
        this.address
      );
      const result = await contract.getPoolBalances();
      const TBA: IValue = {
        raw: new BigNumber(result[0].toString()),
        humanized: new BigNumber(result[0].toString()).dividedBy(
          new BigNumber(10).pow(this.tokenA!.decimals)
        ),
      };
      const TBB: IValue = {
        raw: new BigNumber(result[1].toString()),
        humanized: new BigNumber(result[1].toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };
      return [TBA, TBB];
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }

    return [zero, zero];
  }

  async getParameters(
    params: { provider?: IProvider } = {}
  ): Promise<IPoolIndicators> {
    expect(this.provider || params.provider, "provider");

    if (!this.provider) this.provider = params.provider;

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

  async getCap(params: {
    provider?: IProvider;
    manager: string;
  }): Promise<IValue> {
    const { provider, manager } = params;

    expect(this.provider || provider, "provider");
    expect(this.tokenB, "tokenB");
    expect(manager, "manager (address)");

    try {
      const managerContract = contracts.instances.configurationManager(
        (this.provider || params.provider)!,
        manager
      );
      const providerAddress = await managerContract.getCapProvider();

      const providerContract = contracts.instances.capProvider(
        (this.provider || params.provider)!,
        providerAddress
      );
      const result = await providerContract.getCap(this.address);

      const size: IValue = {
        raw: new BigNumber(result.toString()),
        humanized: new BigNumber(result.toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return size;
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }

    return zero;
  }

  async getUserPosition(params: {
    user: string;
    provider?: IProvider;
  }): Promise<IValue[]> {
    const { user, provider } = params;

    expect(this.tokenB, "tokenA");
    expect(this.tokenB, "tokenB");
    expect(this.provider || provider, "provider");
    expect(user, "user (address)");

    try {
      const contract = contracts.instances.pool(
        (this.provider || params.provider)!,
        this.address
      );
      const result = await contract.getRemoveLiquidityAmounts(
        new BigNumber(100).toString(),
        new BigNumber(100).toString(),
        user
      );

      const UBA: IValue = {
        raw: new BigNumber(result[0].toString()),
        humanized: new BigNumber(result[0].toString()).dividedBy(
          new BigNumber(10).pow(this.tokenA!.decimals)
        ),
      };
      const UBB: IValue = {
        raw: new BigNumber(result[1].toString()),
        humanized: new BigNumber(result[1].toString()).dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return [UBA, UBB];
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK", error);
    }

    return [zero, zero];
  }
}
