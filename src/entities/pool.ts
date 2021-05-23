import _ from "lodash";
import BigNumber from "bignumber.js";
import Web3 from "web3";
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
import { expect } from "../utils";
import Token from "./token";

export default class Pool implements IPool {
  /**
   * ---------- VARIABLES ----------
   */

  public readonly address: string;
  public readonly networkId: number;

  private _tokenA?: IToken;
  private _tokenB?: IToken;

  private _factoryAddress?: string;
  private _optionAddress?: string;

  /**
   * ---------- SETTERS & GETTERS ----------
   */

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
  async getIV(params: { web3: Web3 }): Promise<IValue> {
    const contract = contracts.instances.pool(params.web3, this.address);
    const properties = await contract.methods.priceProperties().call();

    const IV: IValue = {
      raw: new BigNumber(_.get(properties, "currentSigma")),
      humanized: new BigNumber(_.get(properties, "currentSigma")).dividedBy(
        new BigNumber(10).pow(18)
      ),
    };

    return IV;
  }

  async getBuyingPrice(params: {
    web3: Web3;
    amount: BigNumber;
  }): Promise<IValue> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");

    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(this.tokenA!.decimals)
      );
      const contract = contracts.instances.pool(params.web3, this.address);

      const {
        0: result,
      } = await contract.methods
        .getOptionTradeDetailsExactAOutput(sanitized.toFixed(0).toString())
        .call();

      const price: IValue = {
        raw: result,
        humanized: result.dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return price;
    } catch (error) {
      console.error("Pods SDK", error);
    }
    return zero;
  }

  async getSellingPrice(params: {
    web3: Web3;
    amount: BigNumber;
  }): Promise<IValue> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");

    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(this.tokenA!.decimals)
      );
      const contract = contracts.instances.pool(params.web3, this.address);

      const {
        0: result,
      } = await contract.methods
        .getOptionTradeDetailsExactAInput(sanitized.toFixed(0).toString())
        .call();

      const price: IValue = {
        raw: result,
        humanized: result.dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return price;
    } catch (error) {
      console.error("Pods SDK", error);
    }
    return zero;
  }

  async getABPrice(params: { web3: Web3 }): Promise<IValue> {
    expect(this.tokenB, "tokenB");

    try {
      const contract = contracts.instances.pool(params.web3, this.address);

      const { 0: result } = await contract.methods.getABPrice().call();

      const price: IValue = {
        raw: result,
        humanized: result.dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return price;
    } catch (error) {
      console.error("Pods SDK", error);
    }
    return zero;
  }

  async getBuyingEstimateForPrice(params: {
    web3: Web3;
    amount: BigNumber;
  }): Promise<IValue> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");

    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(this.tokenB!.decimals)
      );
      const contract = contracts.instances.pool(params.web3, this.address);

      const {
        0: result,
      } = await contract.methods
        .getOptionTradeDetailsExactBInput(sanitized.toFixed(0).toString())
        .call();

      const price: IValue = {
        raw: result,
        humanized: result.dividedBy(
          new BigNumber(10).pow(this.tokenA!.decimals)
        ),
      };

      return price;
    } catch (error) {
      console.error("Pods SDK", error);
    }
    return zero;
  }

  async getDeamortizedBalances(params: {
    web3: Web3;
    amount: BigNumber;
  }): Promise<IValue[]> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");

    try {
      const contract = contracts.instances.pool(params.web3, this.address);
      const resultDBA = await contract.methods
        .deamortizedTokenABalance()
        .call();
      const resultDBB = await contract.methods
        .deamortizedTokenBBalance()
        .call();

      const DBA: IValue = {
        raw: resultDBA,
        humanized: resultDBA.dividedBy(
          new BigNumber(10).pow(this.tokenA!.decimals)
        ),
      };

      const DBB: IValue = {
        raw: resultDBB,
        humanized: resultDBB.dividedBy(
          new BigNumber(10).pow(this.tokenB!.decimals)
        ),
      };

      return [DBA, DBB];
    } catch (error) {
      console.error("Pods SDK", error);
    }

    return [zero, zero];
  }

  async getFeeBalances(params: { web3: Web3 }): Promise<IValue[]> {
    expect(this.tokenB, "tokenB");

    try {
      const contract = contracts.instances.pool(params.web3, this.address);

      const feePoolAAddress = await contract.methods.feePoolA().call();
      const feePoolBAddress = await contract.methods.feePoolB().call();
      const feeBalanceA = await this.tokenB!.getBalance({
        web3: params.web3,
        owner: feePoolAAddress,
      });
      const feeBalanceB = await this.tokenB!.getBalance({
        web3: params.web3,
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
      console.error("Pods SDK", error);
    }

    return [zero, zero];
  }

  async getTotalBalances(params: { web3: Web3 }): Promise<IValue[]> {
    expect(this.tokenA, "tokenA");
    expect(this.tokenB, "tokenB");

    try {
      const contract = contracts.instances.pool(params.web3, this.address);
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
      console.error("Pods SDK", error);
    }

    return [zero, zero];
  }

  async getParameters(params: { web3: Web3 }): Promise<IPoolIndicators> {
    const result: IPoolIndicators = {};
    const { web3 } = params;
    const queryIV = await _.attemptAsync(async () => this.getIV({ web3 }));
    result.impliedVolatility = _.isError(queryIV) ? null : queryIV;

    const totalBalances = await _.attemptAsync(async () =>
      this.getTotalBalances({ web3 })
    );
    result.totalBalanceA = totalBalances[0];
    result.totalBalanceB = totalBalances[1];

    const deamortizedBalances = await _.attemptAsync(async () =>
      this.getTotalBalances({ web3 })
    );
    result.deamortizedBalanceA = deamortizedBalances[0];
    result.deamortizedBalanceB = deamortizedBalances[1];

    const feeBalances = await _.attemptAsync(async () =>
      this.getFeeBalances({ web3 })
    );
    result.feeAmountPoolA = feeBalances[0];
    result.feeAmountPoolB = feeBalances[1];

    const abPrice = await _.attemptAsync(async () => this.getABPrice({ web3 }));
    result.abPrice = abPrice;

    return result;
  }

  async getCap(params: { web3: Web3; manager: string }): Promise<IValue> {
    const { web3, manager } = params;

    expect(this.tokenB, "tokenB");
    expect(manager, "manager (address)");

    try {
      const managerContract = contracts.instances.configurationManager(
        web3,
        manager
      );
      const providerAddress = await managerContract.methods
        .getCapProvider()
        .call();
      const providerContract = contracts.instances.capProvider(
        web3,
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
      console.error("Pods SDK", error);
    }

    return zero;
  }

  async getUserPosition(params: {
    web3: Web3;
    user: string;
  }): Promise<IValue[]> {
    const { web3, user } = params;

    expect(this.tokenB, "tokenA");
    expect(this.tokenB, "tokenB");
    expect(user, "user (address)");

    try {
      const contract = contracts.instances.pool(web3, this.address);
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
      console.error("Pods SDK", error);
    }

    return [zero, zero];
  }
}
