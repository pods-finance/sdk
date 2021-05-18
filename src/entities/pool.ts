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
  IPoolMetrics,
} from "@types";
import Token from "./token";

export default class Pool implements IPool {
  public readonly address: string;
  public readonly networkId: number;

  public readonly tokenA: IToken;
  public readonly tokenB: IToken;

  public readonly factoryAddress: string;
  public readonly optionAddress: string;

  constructor(params: IPoolBuilderParams) {
    this.address = params.address.toLowerCase();
    this.networkId = params.networkId;

    this.factoryAddress = _.toString(params.factoryAddress).toLowerCase();
    this.optionAddress = _.toString(params.optionAddress).toLowerCase();

    this.tokenA = new Token({
      address: params.tokenA,
      symbol: params.tokenASymbol,
      decimals: params.tokenADecimals,
      networkId: params.networkId,
    });

    this.tokenB = new Token({
      address: params.tokenB,
      symbol: params.tokenBSymbol,
      decimals: params.tokenBDecimals,
      networkId: params.networkId,
    });
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

  async getBuyingPrice(
    params: { web3: Web3; amount: BigNumber },
    padding: number | null = null
  ): Promise<IValue> {
    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(
          _.isNumber(padding) ? padding : this.tokenA.decimals
        )
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
          new BigNumber(10).pow(this.tokenB.decimals)
        ),
      };

      return price;
    } catch (error) {
      console.error("Pods SDK", error);
    }
    return zero;
  }

  async getSellingPrice(
    params: { web3: Web3; amount: BigNumber },
    padding: number | null = null
  ): Promise<IValue> {
    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(
          _.isNumber(padding) ? padding : this.tokenA.decimals
        )
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
          new BigNumber(10).pow(this.tokenB.decimals)
        ),
      };

      return price;
    } catch (error) {
      console.error("Pods SDK", error);
    }
    return zero;
  }

  async getBuyingEstimateForPrice(
    params: { web3: Web3; amount: BigNumber },
    padding: number | null = null
  ): Promise<IValue> {
    try {
      const sanitized = params.amount.multipliedBy(
        new BigNumber(10).pow(
          _.isNumber(padding) ? padding : this.tokenB.decimals
        )
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
          new BigNumber(10).pow(this.tokenA.decimals)
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
    const contract = contracts.instances.pool(params.web3, this.address);
    const resultDBA = await contract.methods.deamortizedTokenABalance().call();
    const resultDBB = await contract.methods.deamortizedTokenBBalance().call();

    const DBA: IValue = {
      raw: resultDBA,
      humanized: resultDBA.dividedBy(new BigNumber(10).pow(18)),
    };

    const DBB: IValue = {
      raw: resultDBB,
      humanized: resultDBB.dividedBy(new BigNumber(10).pow(18)),
    };

    return [DBA, DBB];
  }

  async getFeeBalances(params: { web3: Web3 }): Promise<IValue[]> {
    const contract = contracts.instances.pool(params.web3, this.address);

    const feePoolAAddress = await contract.methods.feePoolA().call();
    const feePoolBAddress = await contract.methods.feePoolB().call();
    const feeBalanceA = await this.tokenB.getBalance({
      web3: params.web3,
      owner: feePoolAAddress,
    });
    const feeBalanceB = await this.tokenB.getBalance({
      web3: params.web3,
      owner: feePoolBAddress,
    });

    const FBA: IValue = {
      raw: new BigNumber(feeBalanceA),
      humanized: new BigNumber(feeBalanceA).dividedBy(
        new BigNumber(10).pow(this.tokenB.decimals)
      ),
    };

    const FBB: IValue = {
      raw: new BigNumber(feeBalanceB),
      humanized: new BigNumber(feeBalanceB).dividedBy(
        new BigNumber(10).pow(this.tokenB.decimals)
      ),
    };

    return [FBA, FBB];
  }

  async getTotalBalances(params: { web3: Web3 }): Promise<IValue[]> {
    const contract = contracts.instances.pool(params.web3, this.address);
    const result = await contract.methods.getPoolBalances().call();
    const TBA: IValue = {
      raw: new BigNumber(result[0]),
      humanized: new BigNumber(result[0]).dividedBy(
        new BigNumber(10).pow(this.tokenA.decimals)
      ),
    };
    const TBB: IValue = {
      raw: new BigNumber(result[1]),
      humanized: new BigNumber(result[1]).dividedBy(
        new BigNumber(10).pow(this.tokenB.decimals)
      ),
    };
    return [TBA, TBB];
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

    return result;
  }

  async getMetrics(params: { web3: Web3 }): Promise<IPoolMetrics> {
    const result: IPoolMetrics = {};
    console.log(params);
    return result;
  }
}
