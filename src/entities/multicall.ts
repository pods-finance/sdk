import _ from "lodash";
import BigNumber from "bignumber.js";

import {
  Multicall as Engine,
  ContractCallContext as CallContext,
  ContractCallReturnContext as Response,
  ContractCallContext as Context,
  CallReturnContext as Result,
} from "ethereum-multicall";

import contracts from "../contracts";
import {
  IMulticall,
  IOption,
  IPool,
  IProvider,
  IValue,
  IPoolGeneralMetrics,
  Optional,
} from "@types";

import { ALLOW_LOGS } from "../constants/globals";
import { networks } from "../constants";
import { expect, zero } from "../utils";
import { ethers } from "ethers";

export default class Multicall implements IMulticall {
  private static _interpretBuyingPrice(params: {
    result: Result;
    pool: IPool;
  }): { [key: string]: IValue } {
    try {
      const { result, pool } = params;
      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error("Buying price unretrievable");

      expect(pool, "option pool");
      expect(pool?.tokenB, "option pool tokenB");

      const amountBIn = ethers.BigNumber.from(values[0]).toString();
      const feesTokenA = ethers.BigNumber.from(values[2]).toString();
      const feesTokenB = ethers.BigNumber.from(values[3]).toString();

      const value: IValue = {
        raw: new BigNumber(amountBIn),
        humanized: new BigNumber(amountBIn).dividedBy(
          new BigNumber(10).pow(pool!.tokenB!.decimals)
        ),
      };

      const feesA: IValue = {
        raw: new BigNumber(feesTokenA),
        humanized: new BigNumber(feesTokenA).dividedBy(
          new BigNumber(10).pow(pool!.tokenB!.decimals)
        ),
      };

      const feesB: IValue = {
        raw: new BigNumber(feesTokenB),
        humanized: new BigNumber(feesTokenB).dividedBy(
          new BigNumber(10).pow(pool!.tokenB!.decimals)
        ),
      };

      return { value, feesA, feesB };
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return { value: zero, feesA: zero, feesB: zero };
  }

  private static _interpretSellingPrice(params: {
    result: Result;
    pool: IPool;
  }): { [key: string]: IValue } {
    try {
      const { result, pool } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error("Selling price unretrievable");

      expect(pool, "option pool");
      expect(pool!.tokenB, "option pool tokenB");

      const amountBOut = ethers.BigNumber.from(values[0]).toString();
      const feesTokenA = ethers.BigNumber.from(values[2]).toString();
      const feesTokenB = ethers.BigNumber.from(values[3]).toString();

      const value: IValue = {
        raw: new BigNumber(amountBOut),
        humanized: new BigNumber(amountBOut).dividedBy(
          new BigNumber(10).pow(pool!.tokenB!.decimals)
        ),
      };

      const feesA: IValue = {
        raw: new BigNumber(feesTokenA),
        humanized: new BigNumber(feesTokenA).dividedBy(
          new BigNumber(10).pow(pool!.tokenB!.decimals)
        ),
      };

      const feesB: IValue = {
        raw: new BigNumber(feesTokenB),
        humanized: new BigNumber(feesTokenB).dividedBy(
          new BigNumber(10).pow(pool!.tokenB!.decimals)
        ),
      };

      return { value, feesA, feesB };
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return { value: zero, feesA: zero, feesB: zero };
  }

  private static _interpretABPrice(params: {
    result: Result;
    pool: IPool;
  }): { [key: string]: IValue } {
    try {
      const { result, pool } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error("AB price unretrievable");

      expect(pool, "option pool");
      expect(pool!.tokenB, "option pool tokenB");

      const amount = ethers.BigNumber.from(values[0]).toString();

      const value: IValue = {
        raw: new BigNumber(amount),
        humanized: new BigNumber(amount).dividedBy(
          new BigNumber(10).pow(pool!.tokenB!.decimals)
        ),
      };

      return { value };
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return { value: zero };
  }

  private static _interpretIV(params: { result: Result; pool: IPool }): IValue {
    try {
      const { result, pool } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error("Price properties unretrievable");

      expect(pool, "option pool");
      expect(pool!.tokenB, "option pool tokenB");

      const IV = ethers.BigNumber.from(values[5]).toString();

      const value: IValue = {
        raw: new BigNumber(IV),
        humanized: new BigNumber(IV).dividedBy(new BigNumber(10).pow(18)),
      };

      return value;
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return zero;
  }

  private static _interpretTotalBalances(params: {
    result: Result;
    pool: IPool;
  }): IValue[] {
    try {
      const { result, pool } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error("Price properties unretrievable");

      expect(pool, "option pool");
      expect(pool!.tokenB, "option pool tokenB");
      expect(pool!.tokenA, "option pool tokenA");

      const rTBA = ethers.BigNumber.from(values[0]).toString();
      const rTBB = ethers.BigNumber.from(values[1]).toString();

      const TBA: IValue = {
        label: "TBA",
        raw: new BigNumber(rTBA),
        humanized: new BigNumber(rTBA).dividedBy(
          new BigNumber(10).pow(pool!.tokenA!.decimals)
        ),
      };

      const TBB: IValue = {
        label: "TBB",
        raw: new BigNumber(rTBB),
        humanized: new BigNumber(rTBB).dividedBy(
          new BigNumber(10).pow(pool!.tokenB!.decimals)
        ),
      };

      return [TBA, TBB];
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return [zero, zero];
  }

  private static _interpretUserPositions(params: {
    result: Result;
    pool: IPool;
  }): IValue[] {
    try {
      const { result, pool } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error("User position unretrievable");

      expect(pool, "option pool");
      expect(pool!.tokenB, "option pool tokenB");
      expect(pool!.tokenA, "option pool tokenA");

      const rUBA = ethers.BigNumber.from(values[0]).toString();
      const rUBB = ethers.BigNumber.from(values[1]).toString();

      const UBA: IValue = {
        label: "Balance tokenA",
        raw: new BigNumber(rUBA),
        humanized: new BigNumber(rUBA).dividedBy(
          new BigNumber(10).pow(pool.tokenA!.decimals)
        ),
      };
      const UBB: IValue = {
        label: "Balance tokenB",
        raw: new BigNumber(rUBB),
        humanized: new BigNumber(rUBB).dividedBy(
          new BigNumber(10).pow(pool.tokenB!.decimals)
        ),
      };

      return [UBA, UBB];
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return [zero, zero];
  }

  private static _interpretUserOptionWithdrawAmounts(params: {
    result: Result;
    option: IOption;
  }): IValue[] {
    try {
      const { result, option } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error("Withdrawable amounts unretrievable");

      expect(option, "option");
      expect(option?.underlying, "option underlying");
      expect(option?.strike, "option strike");

      const rSB = ethers.BigNumber.from(values[0]).toString();
      const rUB = ethers.BigNumber.from(values[1]).toString();

      const SB: IValue = {
        label: "Balance token",
        raw: new BigNumber(rSB),
        humanized: new BigNumber(rSB).dividedBy(
          new BigNumber(10).pow(option.strike!.decimals)
        ),
      };

      const UB: IValue = {
        label: "Balance underlying",
        raw: new BigNumber(rUB),
        humanized: new BigNumber(rUB).dividedBy(
          new BigNumber(10).pow(option.underlying!.decimals)
        ),
      };

      return [UB, SB];
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return [zero, zero];
  }

  private static _interpretUserOptionMintedAmount(params: {
    result: Result;
    option: IOption;
  }): IValue {
    try {
      const { result, option } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error("User minted options unretrievable");

      expect(option, "option");
      expect(option?.decimals, "option decimals");

      const amount = ethers.BigNumber.from(values[0]).toString();

      const value: IValue = {
        label: "Balance option tokens",
        raw: new BigNumber(amount),
        humanized: new BigNumber(amount).dividedBy(
          new BigNumber(10).pow(option.decimals!)
        ),
      };

      return value;
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return zero;
  }

  private static _interpretUserOptionBalance(params: {
    result: Result;
    option: IOption;
  }): IValue {
    try {
      const { result, option } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error("User option balance unretrievable");

      expect(option, "option");
      expect(option?.decimals, "option decimals");

      const amount = ethers.BigNumber.from(values[0]).toString();

      const value: IValue = {
        label: "Balance option tokens in wallet",
        raw: new BigNumber(amount),
        humanized: new BigNumber(amount).dividedBy(
          new BigNumber(10).pow(option.decimals!)
        ),
      };

      return value;
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return zero;
  }

  static async getGeneralDynamics(params: {
    provider: IProvider;
    options: IOption[];
  }): Promise<Optional<{ [key: string]: IPoolGeneralMetrics }>> {
    const { provider: base, options } = params;
    expect(base, "ethers provider");
    const networkId = ((await base.getNetwork()) || {}).chainId;
    expect(networkId, "ethers provider networkId");

    const engine = new Engine({
      ethersProvider: base,
      tryAggregate: true,
      multicallCustomContractAddress: networks[networkId].multicall2,
    });

    expect(engine, "multicall provider");
    const calls: CallContext[] = [];

    options.forEach((option) => {
      try {
        expect(option?.pool?.tokenA, "option pool tokenA");
        const pool = option.pool!;
        const one = new BigNumber(1).times(
          new BigNumber(10).pow(pool!.tokenA!.decimals)
        );

        const instructions: CallContext = {
          reference: option.address!,
          contractAddress: option.poolAddress!,
          abi: contracts.abis.PoolABI,
          calls: [
            {
              reference: "sellingPrice",
              methodName: "getOptionTradeDetailsExactAInput",
              methodParameters: [one.toFixed(0).toString()],
            },
            {
              reference: "buyingPrice",
              methodName: "getOptionTradeDetailsExactAOutput",
              methodParameters: [one.toFixed(0).toString()],
            },
            {
              reference: "abPrice",
              methodName: "getABPrice",
              methodParameters: [],
            },
            {
              reference: "IV",
              methodName: "priceProperties",
              methodParameters: [],
            },
            {
              reference: "totalBalances",
              methodName: "getPoolBalances",
              methodParameters: [],
            },
          ],
          context: {
            address: option.address,
          },
        };

        calls.push(instructions);
      } catch (error) {
        if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
      }
    });

    try {
      const request = await engine.call(calls);
      const items = request.results;
      const dynamics: { [key: string]: IPoolGeneralMetrics } = {};

      Object.keys(items).forEach((key) => {
        const response: Response = items[key];
        const context: Context = response.originalContractCallContext;
        const results: Result[] = response.callsReturnContext;

        const metrics: IPoolGeneralMetrics = {};
        const address = _.get(context, "context.address");
        const option: IOption = options.find((o) => o.address === address)!;
        const pool: IPool = option!.pool!;

        results.forEach((result: Result) => {
          const reference = result.reference;
          switch (reference) {
            case "sellingPrice":
              metrics.sellingPrice = Multicall._interpretSellingPrice({
                pool,
                result,
              });
              break;
            case "buyingPrice":
              metrics.buyingPrice = Multicall._interpretBuyingPrice({
                pool,
                result,
              });
              break;
            case "abPrice":
              metrics.abPrice = Multicall._interpretABPrice({
                pool,
                result,
              });
              break;
            case "IV":
              metrics.IV = Multicall._interpretIV({
                pool,
                result,
              });
              break;
            case "totalBalances":
              metrics.totalBalances = Multicall._interpretTotalBalances({
                pool,
                result,
              });
              break;
            default:
              break;
          }
        });

        dynamics[option.address] = metrics;
      });

      return dynamics;
    } catch (error) {
      if (ALLOW_LOGS())
        console.error("Pods SDK - Multicall General", error, {
          options,
          networkId,
        });
    }

    return undefined;
  }

  static async getUserDynamics(params: {
    provider: IProvider;
    user: string;
    options: IOption[];
  }): Promise<Optional<{ [key: string]: IPoolGeneralMetrics }>> {
    const { provider: base, options, user } = params;
    expect(base, "ethers provider");

    const networkId = ((await base.getNetwork()) || {}).chainId;
    expect(networkId, "ethers provider networkId");

    const engine = new Engine({
      ethersProvider: base,
      tryAggregate: true,
      multicallCustomContractAddress: networks[networkId].multicall2,
    });

    expect(engine, "multicall provider");
    const calls: CallContext[] = [];

    options.forEach((option) => {
      try {
        expect(option?.pool?.tokenA, "option pool tokenA");

        const poolInstructions: CallContext = {
          reference: `p-${option.address!}`,
          contractAddress: option.poolAddress!,
          abi: contracts.abis.PoolABI,
          calls: [
            {
              reference: "userPositions",
              methodName: "getRemoveLiquidityAmounts",
              methodParameters: [
                new BigNumber(100).toString(),
                new BigNumber(100).toString(),
                user,
              ],
            },
          ],
          context: {
            address: option.address,
          },
        };

        const optionInstructions: CallContext = {
          reference: `o-${option.address!}`,
          contractAddress: option.address!,
          abi: contracts.abis.OptionABI,
          calls: [
            {
              reference: "userOptionWithdrawAmounts",
              methodName: "getSellerWithdrawAmounts",
              methodParameters: [user],
            },
            {
              reference: "userOptionMintedAmount",
              methodName: "mintedOptions",
              methodParameters: [user],
            },
          ],
          context: {
            address: option.address,
          },
        };

        const tokenInstructions: CallContext = {
          reference: `t-${option.address!}`,
          contractAddress: option.address!,
          abi: contracts.abis.ERC20ABI,
          calls: [
            {
              reference: "userOptionBalance",
              methodName: "balanceOf",
              methodParameters: [user],
            },
          ],
          context: {
            address: option.address,
          },
        };

        calls.push(poolInstructions);
        calls.push(optionInstructions);
        calls.push(tokenInstructions);
      } catch (error) {
        if (ALLOW_LOGS())
          console.error("Pods SDK - Multicall User", error, {
            user,
            options,
            networkId,
          });
      }
    });

    try {
      const request = await engine.call(calls);
      const items = request.results;
      const dynamics: { [key: string]: IPoolGeneralMetrics } = {};

      Object.keys(items).forEach((key) => {
        const response: Response = items[key];
        const context: Context = response.originalContractCallContext;
        const results: Result[] = response.callsReturnContext;

        const metrics: IPoolGeneralMetrics = {};
        const address = _.get(context, "context.address");
        const option: IOption = options.find((o) => o.address === address)!;
        const pool: IPool = option!.pool!;

        results.forEach((result: Result) => {
          const reference = result.reference;

          switch (reference) {
            case "userPositions":
              metrics.userPositions = Multicall._interpretUserPositions({
                pool,
                result,
              });
              break;

            case "userOptionWithdrawAmounts":
              metrics.userOptionWithdrawAmounts = Multicall._interpretUserOptionWithdrawAmounts(
                {
                  option,
                  result,
                }
              );
              break;

            case "userOptionMintedAmount":
              metrics.userOptionMintedAmount = Multicall._interpretUserOptionMintedAmount(
                {
                  option,
                  result,
                }
              );
              break;

            case "userOptionBalance":
              metrics.userOptionBalance = Multicall._interpretUserOptionBalance(
                {
                  option,
                  result,
                }
              );
              break;

            default:
              break;
          }
        });
        if (_.has(dynamics, option.address))
          dynamics[option.address] = {
            ...dynamics[option.address],
            ...metrics,
          };
        else dynamics[option.address] = metrics;
      });
      return dynamics;
    } catch (error) {
      console.error("Pods SDK - Multicall User", error, {
        user,
        options,
        networkId,
      });
    }

    return undefined;
  }
}
