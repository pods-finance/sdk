import _ from "lodash";
import BigNumber from "bignumber.js";

import {
  ContractCallContext as CallContext,
  ContractCallReturnContext as Response,
  ContractCallContext as Context,
  CallReturnContext as Result,
} from "ethereum-multicall";

import contracts from "../../contracts";
import {
  IPosition,
  IOption,
  IPool,
  IProvider,
  IPoolGeneralMetrics,
  Optional,
} from "@types";

import { ALLOW_LOGS } from "../../constants/globals";
import { expect, zero } from "../../utils";

import MulticallParser from "./parser";
import MulticallEngine from "./engine";

export default class MulticallAggregator {
  static async getOptionsStatics(params: {
    provider: IProvider;
    addresses: string[];
  }): Promise<Optional<{ [key: string]: any }>> {
    const { provider, addresses } = params;
    const calls: CallContext[] = [];

    addresses.forEach((address) => {
      try {
        const instructionsString: CallContext = {
          reference: `os-${address}`,
          contractAddress: address,
          abi: contracts.abis.OptionABI,
          context: {
            id: address,
            isString: true,
          },
          calls: ["name", "symbol", "underlyingAsset", "strikeAsset"].map(
            (name) => ({
              reference: name,
              methodName: name,
              methodParameters: [],
            })
          ),
        };

        const instructionsNumber: CallContext = {
          reference: `on-${address}`,
          contractAddress: address,
          abi: contracts.abis.OptionABI,
          context: {
            id: address,
            isNumber: true,
          },
          calls: [
            "decimals",
            "optionType",
            "exerciseType",
            "underlyingAssetDecimals",
            "strikeAssetDecimals",
            "strikePrice",
            "strikePriceDecimals",
            "expiration",
            "startOfExerciseWindow",
          ].map((name) => ({
            reference: name,
            methodName: name,
            methodParameters: [],
          })),
        };

        calls.push(instructionsString);
        calls.push(instructionsNumber);
      } catch (error) {
        if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
      }
    });

    try {
      const items = await MulticallEngine.use({
        provider,
        calls,
      });

      if (_.isNil(items)) return undefined;

      const options = await MulticallEngine.parse({
        items,
      });

      return options;
    } catch (error) {
      if (ALLOW_LOGS())
        console.error("Pods SDK - Multicall General", error, {
          addresses,
        });
    }

    return undefined;
  }

  static async getPoolsStatics(params: {
    provider: IProvider;
    addresses: string[];
  }): Promise<Optional<{ [key: string]: any }>> {
    const { provider, addresses: _addresses } = params;
    const addresses = _.uniq(_addresses);
    const calls: CallContext[] = [];

    addresses.forEach((address) => {
      try {
        const instructionsString: CallContext = {
          reference: `ps-${address}`,
          contractAddress: address,
          abi: contracts.abis.PoolABI,
          context: {
            id: address,
            isString: true,
          },
          calls: ["tokenA", "tokenB"].map((name) => ({
            reference: name,
            methodName: name,
            methodParameters: [],
          })),
        };

        const instructionsNumber: CallContext = {
          reference: `pn-${address}`,
          contractAddress: address,
          abi: contracts.abis.PoolABI,
          context: {
            id: address,
            isNumber: true,
          },
          calls: ["tokenADecimals", "tokenBDecimals"].map((name) => ({
            reference: name,
            methodName: name,
            methodParameters: [],
          })),
        };

        calls.push(instructionsString);
        calls.push(instructionsNumber);
      } catch (error) {
        if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
      }
    });

    try {
      const items = await MulticallEngine.use({
        provider,
        calls,
      });

      if (_.isNil(items)) return undefined;

      const options = await MulticallEngine.parse({
        items,
      });

      return options;
    } catch (error) {
      if (ALLOW_LOGS())
        console.error("Pods SDK - Multicall General", error, {
          addresses,
        });
    }

    return undefined;
  }

  static async getTokensSymbols(params: {
    provider: IProvider;
    addresses: string[];
  }): Promise<Optional<{ [key: string]: any }>> {
    const { provider, addresses } = params;
    const calls: CallContext[] = [];

    addresses.forEach((address) => {
      try {
        const instructions: CallContext = {
          reference: address,
          contractAddress: address,
          abi: contracts.abis.ERC20ABI,
          context: {
            id: address,
            isString: true,
          },
          calls: ["symbol"].map((name) => ({
            reference: name,
            methodName: name,
            methodParameters: [],
          })),
        };
        calls.push(instructions);
      } catch (error) {
        if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
      }
    });

    try {
      const items = await MulticallEngine.use({
        provider,
        calls,
      });

      if (_.isNil(items)) return undefined;

      const tokens = await MulticallEngine.parse({
        items,
      });

      return tokens;
    } catch (error) {
      if (ALLOW_LOGS())
        console.error("Pods SDK - Multicall General", error, {
          addresses,
        });
    }

    return undefined;
  }

  static async getGeneralDynamics(params: {
    provider: IProvider;
    options: IOption[];
  }): Promise<Optional<{ [key: string]: IPoolGeneralMetrics }>> {
    const { provider, options } = params;
    const calls: CallContext[] = [];

    options.forEach((option) => {
      try {
        expect(option?.pool?.tokenA, "option pool tokenA");
        const pool = option.pool!;
        const one = new BigNumber(1).times(
          new BigNumber(10).pow(pool!.tokenA!.decimals)
        );

        const poolInstructions: CallContext = {
          reference: `p-${option.address!}`,
          contractAddress: option.poolAddress!,
          abi: contracts.abis.PoolABI,
          context: {
            id: option.address,
          },
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
              reference: "adjustedIV",
              methodName: "getAdjustedIV",
              methodParameters: [],
            },
            {
              reference: "totalBalances",
              methodName: "getPoolBalances",
              methodParameters: [],
            },
          ],
        };

        const optionInstructions: CallContext = {
          reference: `o-${option.address!}`,
          contractAddress: option.address!,
          abi: contracts.abis.OptionABI,
          context: {
            id: option.address,
          },
          calls: [
            {
              reference: "totalSupply",
              methodName: "totalSupply",
              methodParameters: [],
            },
          ],
        };

        calls.push(poolInstructions);
        calls.push(optionInstructions);
      } catch (error) {
        if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
      }
    });

    try {
      const items = await MulticallEngine.use({
        provider,
        calls,
      });
      if (_.isNil(items)) return undefined;

      const dynamics: { [key: string]: IPoolGeneralMetrics } = {};

      Object.keys(items).forEach((key) => {
        const response: Response = items[key];
        const context: Context = response.originalContractCallContext;
        const results: Result[] = response.callsReturnContext;

        const metrics: IPoolGeneralMetrics = {};
        const address = _.get(context, "context.id");
        const option: IOption = options.find((o) => o.address === address)!;
        const pool: IPool = option!.pool!;

        results.forEach((result: Result) => {
          const reference = result.reference;
          switch (reference) {
            case "sellingPrice":
              metrics.sellingPrice = MulticallParser.interpretSellingPrice({
                pool,
                result,
              });
              break;
            case "buyingPrice":
              metrics.buyingPrice = MulticallParser.interpretBuyingPrice({
                pool,
                result,
              });
              break;
            case "abPrice":
              metrics.abPrice = MulticallParser.interpretABPrice({
                pool,
                result,
              });
              break;
            case "IV":
              metrics.IV = MulticallParser.interpretIV({
                pool,
                result,
              });
              break;
            case "adjustedIV":
              metrics.adjustedIV = MulticallParser.interpretAdjustedIV({
                pool,
                result,
              });
              break;
            case "totalBalances":
              metrics.totalBalances = MulticallParser.interpretTotalBalances({
                pool,
                result,
              });
              break;
            case "totalSupply":
              metrics.totalSupply = MulticallParser.interpretTotalSupply({
                pool,
                result,
              });
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
      if (ALLOW_LOGS())
        console.error("Pods SDK - Multicall General", error, {
          options,
        });
    }

    return undefined;
  }

  static async getUserDynamics(params: {
    provider: IProvider;
    user: string;
    options: IOption[];
  }): Promise<Optional<{ [key: string]: IPoolGeneralMetrics }>> {
    const { provider, options, user } = params;
    const calls: CallContext[] = [];

    options.forEach((option) => {
      try {
        expect(option?.pool?.tokenA, "option pool tokenA");

        const poolInstructions: CallContext = {
          reference: `p-${option.address!}`,
          contractAddress: option.poolAddress!,
          abi: contracts.abis.PoolABI,
          context: {
            id: option.address,
          },
          calls: [
            {
              reference: "userPositions",
              methodName: "getRemoveLiquidityAmounts",
              methodParameters: [
                new BigNumber(100).toString(),
                new BigNumber(100).toString(),
                _.toString(user).toLowerCase(),
              ],
            },
          ],
        };

        const optionInstructions: CallContext = {
          reference: `o-${option.address!}`,
          contractAddress: option.address!,
          abi: contracts.abis.OptionABI,
          context: {
            id: option.address,
          },
          calls: [
            {
              reference: "userOptionWithdrawAmounts",
              methodName: "getSellerWithdrawAmounts",
              methodParameters: [_.toString(user).toLowerCase()],
            },
            {
              reference: "userOptionMintedAmount",
              methodName: "mintedOptions",
              methodParameters: [_.toString(user).toLowerCase()],
            },
          ],
        };

        const tokenInstructions: CallContext = {
          reference: `t-${option.address!}`,
          contractAddress: option.address!,
          abi: contracts.abis.ERC20ABI,
          context: {
            id: option.address,
          },
          calls: [
            {
              reference: "userOptionBalance",
              methodName: "balanceOf",
              methodParameters: [_.toString(user).toLowerCase()],
            },
          ],
        };

        calls.push(poolInstructions);
        calls.push(optionInstructions);
        calls.push(tokenInstructions);
      } catch (error) {
        if (ALLOW_LOGS())
          console.error("Pods SDK - Multicall User", error, {
            user,
            options,
          });
      }
    });

    try {
      const items = await MulticallEngine.use({
        provider,
        calls,
      });
      if (_.isNil(items)) return undefined;

      const dynamics: { [key: string]: IPoolGeneralMetrics } = {};

      Object.keys(items).forEach((key) => {
        const response: Response = items[key];
        const context: Context = response.originalContractCallContext;
        const results: Result[] = response.callsReturnContext;

        const metrics: IPoolGeneralMetrics = {};
        const address = _.get(context, "context.id");
        const option: IOption = options.find((o) => o.address === address)!;
        const pool: IPool = option!.pool!;

        results.forEach((result: Result) => {
          const reference = result.reference;

          switch (reference) {
            case "userPositions":
              metrics.userPositions = MulticallParser.interpretUserPositions({
                pool,
                result,
              });
              break;

            case "userOptionWithdrawAmounts":
              metrics.userOptionWithdrawAmounts = MulticallParser.interpretUserOptionWithdrawAmounts(
                {
                  option,
                  result,
                }
              );
              break;

            case "userOptionMintedAmount":
              metrics.userOptionMintedAmount = MulticallParser.interpretUserOptionMintedAmount(
                {
                  option,
                  result,
                }
              );
              break;

            case "userOptionBalance":
              metrics.userOptionBalance = MulticallParser.interpretUserOptionBalance(
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
      });
    }

    return undefined;
  }

  static async getUserRebalanceDynamics(params: {
    provider: IProvider;
    user: string;
    options: IOption[];
    positions: { [key: string]: Optional<IPosition> };
  }): Promise<Optional<{ [key: string]: IPoolGeneralMetrics }>> {
    const { provider, options, user, positions } = params;
    const calls: CallContext[] = [];

    const dynamics = await MulticallAggregator.getUserDynamics({
      provider,
      user,
      options,
    });

    if (_.isNil(dynamics)) return undefined;

    options.forEach((option) => {
      try {
        expect(option?.pool?.tokenA, "option pool tokenA");
        const address = option.address;
        const position = positions[address];
        const dynamic: IPoolGeneralMetrics = _.get(dynamics, option.address);
        const liquidity = dynamic.userPositions;
        let [surplus, shortage]: BigNumber[] = [zero.humanized, zero.humanized];

        if (liquidity?.length && position) {
          const deposits = position.getInitialOptionsProvidedValue().humanized;
          const removals = position.getFinalOptionsRemovedValue().humanized;
          const initials: BigNumber = deposits.minus(removals);
          const removable = liquidity[0]; // The user's option token position for pool side A
          const difference: BigNumber = removable.humanized.minus(initials);

          if (difference.isGreaterThan(zero.humanized)) {
            surplus = difference
              .absoluteValue()
              .times(new BigNumber(10).pow(option!.pool!.tokenA!.decimals));
          } else {
            shortage = difference
              .absoluteValue()
              .times(new BigNumber(10).pow(option!.pool!.tokenA!.decimals));
          }
        }

        const poolInstructions: CallContext = {
          reference: `p-${option.address!}`,
          contractAddress: option.poolAddress!,
          abi: contracts.abis.PoolABI,
          context: {
            id: option.address,
            surplus, // Handle the IValue transition in the interpretor
            shortage, // Handle the IValue transition in the interpretor,
            position,
            isNumbers: true,
            isShortage: !shortage.isEqualTo(zero.raw),
            isSurplus: !surplus.isEqualTo(zero.raw),
          },
          calls: [
            shortage.isEqualTo(zero.raw)
              ? {
                  reference: "rebalancePrice",
                  methodName: "getOptionTradeDetailsExactAInput",
                  methodParameters: [surplus.toFixed(0).toString()],
                }
              : {
                  reference: "rebalancePrice",
                  methodName: "getOptionTradeDetailsExactAOutput",
                  methodParameters: [shortage.toFixed(0).toString()],
                },
          ],
        };

        calls.push(poolInstructions);
      } catch (error) {
        if (ALLOW_LOGS())
          console.error("Pods SDK - Multicall Surplus", error, {
            user,
            options,
            positions,
          });
      }
    });

    try {
      const items = await MulticallEngine.use({
        provider,
        calls,
      });

      if (_.isNil(items)) return undefined;

      const dynamics: { [key: string]: IPoolGeneralMetrics } = {};

      Object.keys(items).forEach((key) => {
        const response: Response = items[key];
        const context: Context = response.originalContractCallContext;
        const results: Result[] = response.callsReturnContext;

        const metrics: IPoolGeneralMetrics = {};
        const address = _.get(context, "context.id");
        const option: IOption = options.find((o) => o.address === address)!;
        const pool: IPool = option!.pool!;

        results.forEach((result: Result) => {
          const reference = result.reference;
          switch (reference) {
            case "rebalancePrice":
              metrics.rebalancePrice = MulticallParser.interpretRebalancePrice({
                pool,
                result,
                context: _.get(context, "context"),
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
        console.error("Pods SDK - Multicall Surplus", error, {
          dynamics,
        });
    }

    return undefined;
  }
}
