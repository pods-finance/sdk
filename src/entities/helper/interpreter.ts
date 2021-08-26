import _ from "lodash";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { CallReturnContext as Result } from "ethereum-multicall";

import { IOption, IPool, IValue } from "@types";

import { ALLOW_LOGS } from "../../constants/globals";
import { expect, zero } from "../../utils";

export default class Interpreter {
  public static interpretBuyingPrice(params: {
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

  public static interpretSellingPrice(params: {
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

  public static interpretABPrice(params: {
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

  public static interpretIV(params: { result: Result; pool: IPool }): IValue {
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

  public static interpretAdjustedIV(params: {
    result: Result;
    pool: IPool;
  }): IValue {
    try {
      const { result, pool } = params;

      const status = _.get(result, "success");
      const values = _.get(result, "returnValues");

      if (!status || !_.isArray(values) || values.length === 0)
        throw new Error("Price properties unretrievable");

      expect(pool, "option pool");
      expect(pool!.tokenB, "option pool tokenB");

      const adjustedIV = ethers.BigNumber.from(values[0]).toString();

      const value: IValue = {
        raw: new BigNumber(adjustedIV),
        humanized: new BigNumber(adjustedIV).dividedBy(
          new BigNumber(10).pow(18)
        ),
      };

      return value;
    } catch (error) {
      if (ALLOW_LOGS()) console.error("Pods SDK - Multicall", error);
    }

    return zero;
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

  public static interpretUserPositions(params: {
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

  public static interpretUserOptionWithdrawAmounts(params: {
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
}
