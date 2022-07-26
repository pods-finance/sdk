import _ from "lodash";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";

import {
  CallReturnContext as Result,
  ContractCallContext as CallContext,
} from "ethereum-multicall";

import { IOption, IPool, IValue } from "@types";

import { ALLOW_LOGS, ALLOW_LOGS_LVL2 } from "../../constants/globals";
import { expect, humanize, zero } from "../../utils";

export default class Parser {
  /**
   *
   * Errors have been suppressed from pricing methods
   *
   * @param params
   * @returns
   */
  public static interpretBuyingPrice(params: {
    result: Result;
    pool: IPool;
  }): { [key: string]: IValue } {
    try {
      const { result, pool } = params;
      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0) {
        if (ALLOW_LOGS_LVL2())
          throw new Error(
            "Buying price unretrievable - possible pool imbalance"
          );
        else return { value: zero, feesA: zero, feesB: zero };
      }

      expect(pool, "option pool");
      expect(pool?.tokenB, "option pool tokenB");

      const amountBIn = ethers.BigNumber.from(values[0]).toString();
      const feesTokenA = ethers.BigNumber.from(values[2]).toString();
      const feesTokenB = ethers.BigNumber.from(values[3]).toString();

      const value: IValue = {
        raw: new BigNumber(amountBIn),
        humanized: humanize(new BigNumber(amountBIn), pool!.tokenB!.decimals)
      };

      const feesA: IValue = {
        raw: new BigNumber(feesTokenA),
        humanized: humanize(new BigNumber(feesTokenA), pool!.tokenA!.decimals)
      };

      const feesB: IValue = {
        raw: new BigNumber(feesTokenB),
        humanized: humanize(new BigNumber(feesTokenB), pool!.tokenB!.decimals)
      };

      return { value, feesA, feesB };
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return { value: zero, feesA: zero, feesB: zero };
  }

  public static interpretSellingPrice(params: {
    result: Result;
    pool: IPool;
  }): { [key: string]: IValue } {
    try {
      const { result, pool } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0) {
        if (ALLOW_LOGS_LVL2())
          throw new Error(
            "Selling price unretrievable - possible pool imbalance"
          );
        else return { value: zero, feesA: zero, feesB: zero };
      }

      expect(pool, "option pool");
      expect(pool!.tokenB, "option pool tokenB");

      const amountBOut = ethers.BigNumber.from(values[0]).toString();
      const feesTokenA = ethers.BigNumber.from(values[2]).toString();
      const feesTokenB = ethers.BigNumber.from(values[3]).toString();

      const value: IValue = {
        raw: new BigNumber(amountBOut),
        humanized: humanize(new BigNumber(amountBOut), pool!.tokenB!.decimals)
      };

      const feesA: IValue = {
        raw: new BigNumber(feesTokenA),
        humanized: humanize(new BigNumber(feesTokenA), pool!.tokenA!.decimals)
      };

      const feesB: IValue = {
        raw: new BigNumber(feesTokenB),
        humanized: humanize(new BigNumber(feesTokenB), pool!.tokenB!.decimals)
      };

      return { value, feesA, feesB };
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return { value: zero, feesA: zero, feesB: zero };
  }

  public static interpretTotalBalances(params: {
    result: Result;
    pool: IPool;
  }): IValue[] {
    try {
      const { result, pool } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error("Total balances unretrievable");

      expect(pool, "option pool");
      expect(pool!.tokenB, "option pool tokenB");
      expect(pool!.tokenA, "option pool tokenA");

      const rTBA = ethers.BigNumber.from(values[0]).toString();
      const rTBB = ethers.BigNumber.from(values[1]).toString();

      const TBA: IValue = {
        label: "TBA",
        raw: new BigNumber(rTBA),
        humanized: humanize(new BigNumber(rTBA), pool!.tokenA!.decimals)
      };

      const TBB: IValue = {
        label: "TBB",
        raw: new BigNumber(rTBB),
        humanized: humanize(new BigNumber(rTBB), pool!.tokenB!.decimals)
      };

      return [TBA, TBB];
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error, params);
    }

    return [zero, zero];
  }

  public static interpretUserPositions(params: {
    result: Result;
    pool: IPool;
  }): IValue[] {
    try {
      const { result, pool } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0) {
        if (ALLOW_LOGS_LVL2())
          /**
           * This error will require ALLOW_LOGS_LVL2 because
           *      the contract method reverts not only on-error, but also when
           *      the withdrawable values per wallet addres are [0,0]
           */
          throw new Error("User position unretrievable");
        else return [zero, zero];
      }

      expect(pool, "option pool");
      expect(pool!.tokenB, "option pool tokenB");
      expect(pool!.tokenA, "option pool tokenA");

      const rUBA = ethers.BigNumber.from(values[0]).toString();
      const rUBB = ethers.BigNumber.from(values[1]).toString();

      const UBA: IValue = {
        label: "Balance tokenA",
        raw: new BigNumber(rUBA),
        humanized: humanize(new BigNumber(rUBA), pool!.tokenA!.decimals)
      };
      const UBB: IValue = {
        label: "Balance tokenB",
        raw: new BigNumber(rUBB),
        humanized: humanize(new BigNumber(rUBB), pool!.tokenB!.decimals)
      };

      return [UBA, UBB];
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error, params);
    }

    return [zero, zero];
  }

  public static interpretUserOptionWithdrawAmounts(params: {
    result: Result;
    option: IOption;
  }): IValue[] {
    try {
      const { result, option } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        if (ALLOW_LOGS_LVL2())
          /**
           * This error will require ALLOW_LOGS_LVL2 because
           *      the contract method reverts not only on-error, but also when
           *      the withdrawable values per wallet addres are [0,0]
           */
          throw new Error("Withdrawable amounts unretrievable");
        else return [zero, zero];

      expect(option, "option");
      expect(option?.underlying, "option underlying");
      expect(option?.strike, "option strike");

      const rSB = ethers.BigNumber.from(values[0]).toString();
      const rUB = ethers.BigNumber.from(values[1]).toString();

      const SB: IValue = {
        label: "Balance token",
        raw: new BigNumber(rSB),
        humanized: humanize(new BigNumber(rSB), option!.strike!.decimals)
      };

      const UB: IValue = {
        label: "Balance underlying",
        raw: new BigNumber(rUB),
        humanized: humanize(new BigNumber(rUB), option!.underlying!.decimals)
      };

      return [UB, SB];
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error, params);
    }

    return [zero, zero];
  }

  public static interpretUserOptionMintedAmount(params: {
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
        humanized: humanize(new BigNumber(amount), option!.decimals)
      };

      return value;
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error, params);
    }

    return zero;
  }

  public static interpretUserOptionBalance(params: {
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
        humanized: humanize(new BigNumber(amount), option!.decimals)
      };

      return value;
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error, params);
    }

    return zero;
  }

  public static interpretRebalancePrice(params: {
    result: Result;
    pool: IPool;
    context: { [key: string]: unknown };
  }): { [key: string]: IValue | unknown } {
    try {
      const { result, pool, context: _context } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error(
          "Selling price unretrievable - possible pool imbalance"
        );

      expect(pool, "option pool");
      expect(pool!.tokenB, "option pool tokenB");
      expect(pool!.tokenA, "option pool tokenA");

      const amount = ethers.BigNumber.from(values[0]).toString();
      const feesTokenA = ethers.BigNumber.from(values[2]).toString();
      const feesTokenB = ethers.BigNumber.from(values[3]).toString();

      const value: IValue = {
        raw: new BigNumber(amount),
        humanized: humanize(new BigNumber(amount), pool!.tokenB!.decimals)
      };

      const feesA: IValue = {
        raw: new BigNumber(feesTokenA),
        humanized: humanize(new BigNumber(feesTokenA), pool!.tokenA!.decimals)
      };

      const feesB: IValue = {
        raw: new BigNumber(feesTokenB),
        humanized: humanize(new BigNumber(feesTokenB), pool!.tokenB!.decimals)
      };

      const surplus: IValue = {
        raw: new BigNumber((_context.surplus as string) || 0),
        humanized: humanize(new BigNumber((_context.surplus as string) || 0), pool!.tokenA!.decimals)
      };

      const shortage: IValue = {
        raw: new BigNumber((_context.shortage as string) || 0),
        humanized: humanize(new BigNumber((_context.shortage as string) || 0), pool!.tokenA!.decimals)
      };

      const context = {
        ..._context,
        surplus,
        shortage,
      };

      return { value, feesA, feesB, context };
    } catch (error) {
      if (false && ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return { value: zero, feesA: zero, feesB: zero };
  }

  public static interpretSingleAmount(params: {
    result: Result;
    decimals: BigNumber;
    label: string;
    position?: number;
  }): IValue {
    try {
      const { result, decimals, label, position } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error(`Unretrievable: ${label}`);

      expect(label, `Missing label, cannot interpret amount`);
      expect(decimals, `Missing decimals, cannot interpret: ${label}`);

      const _amout = values[position || 0];
      if (_.isNilOrEmptyString(_amout))
        throw new Error(`Missing value in result for: ${label}`);

      const amount = ethers.BigNumber.from(_amout).toString();

      const value: IValue = {
        label,
        raw: new BigNumber(amount),
        humanized: humanize(new BigNumber(amount), decimals)
      };

      return value;
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error, params);
    }

    return zero;
  }

  public static call(
    reference: string,
    methodName: string,
    methodParameters: any[]
  ): { reference: string; methodName: string; methodParameters: any[] } {
    return {
      reference,
      methodName,
      methodParameters,
    };
  }

  public static instructions(
    reference: string,
    contractAddress: string,
    abi: any[],
    context: { [key: string]: string; id: string },
    calls: { reference: string; methodName: string; methodParameters: any[] }[]
  ): CallContext {
    return {
      reference,
      contractAddress,
      abi,
      context,
      calls,
    };
  }
}
