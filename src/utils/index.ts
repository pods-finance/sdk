import _ from "lodash";
import BigNumber from "bignumber.js";
import { IProvider, IValue, IHelperOverrides } from "@types";
import { DEFAULT_TIMEOUT, ALLOW_LOGS } from "../constants/globals";
declare module "lodash" {
  interface LoDashStatic {
    isNilOrEmptyString(value: any): boolean;
    attemptAsync(func: () => {}, ...args: any[]): Promise<any | Error>;
  }
  interface LoDashExplicitWrapper<TValue> {
    isNilOrEmptyString(value: any): LoDashExplicitWrapper<TValue>;
    attemptAsync(
      func: Function<any>,
      ...args: any[]
    ): LoDashExplicitWrapper<TValue>;
  }
}

export function isNilOrEmptyString(value: any): boolean {
  return _.isNil(value) || String(value).length === 0;
}

export async function attemptAsync(
  func: Function,
  ...args: any[]
): Promise<any | Error> {
  try {
    return await func(...args);
  } catch (e) {
    return e;
  }
}

export function config() {
  _.mixin({ isNilOrEmptyString });
  _.mixin({ attemptAsync });
}

export const zero: IValue = {
  raw: new BigNumber(0),
  humanized: new BigNumber(0),
};

export function expect(
  value: any,
  identifier: string = "unknown",
  strongType?: string
) {
  if (value === undefined || _.isNil(value))
    throw new Error(`Missing parameter: ${identifier}`);
  if (!_.isNilOrEmptyString(strongType) && typeof value !== strongType)
    throw new Error(
      `Unexpected type for parameter: ${identifier}, ${strongType}, got ${typeof value}`
    );
}

export async function getDefaultDeadline(
  provider: IProvider
): Promise<BigNumber> {
  expect(provider, "provider");
  const index = await provider.getBlockNumber();
  const block = await provider.getBlock(index);

  return new BigNumber(block.timestamp).plus(new BigNumber(DEFAULT_TIMEOUT));
}

export async function getOwner(provider: IProvider): Promise<string> {
  expect(provider, "provider");

  const signer = provider.getSigner();
  expect(signer, "signer");

  const account = await signer.getAddress();
  return account;
}

/**
 * Convert raw numbers into humanized values (strip the decimals)
 * @param raw
 * @param decimals
 * @returns {BigNumber} humanized value
 */
export function humanize(raw: BigNumber, decimals: BigNumber| number = 18): BigNumber {
  return raw.dividedBy(new BigNumber(10).pow(decimals));
}

export async function getOverrides(
  params: IHelperOverrides | undefined,
  estimate: Function,
  args: any[]
): Promise<{ [key: string]: string }> {
  if (_.isNilOrEmptyString(params)) return {};

  const overrides: { [key: string]: string } = {};
  const { gasLimit } = params!;

  /**
   * Gas limit, especially for sidechains
   */

  try {
    if (!_.isNilOrEmptyString(gasLimit) && gasLimit !== false) {
      if (gasLimit !== true)
        overrides.gasLimit = (gasLimit as BigNumber).toString();
      else {
        const limit = await estimate(...args);
        if (limit) {
          overrides.gasLimit = new BigNumber(limit.toString())
            .multipliedBy(120)
            .dividedBy(100)
            .toFixed(0)
            .toString();
        }
      }
    }
  } catch (error) {
    if (ALLOW_LOGS()) console.error("Pods SDK", " Gas Simulator", error);
  }

  /**
   * Gas price is not handled yet
   */

  return overrides;
}

/**
 * Multiply numbers by 10^decimals.
 */
 export function scaleUp(raw: BigNumber, decimals: BigNumber| number = 18): BigNumber {
  return raw.multipliedBy(new BigNumber(10).pow(decimals));
}

const utils = {
  config,
  isNilOrEmptyString,
  attemptAsync,
  zero,
  expect,
  getDefaultDeadline,
  getOwner,
  humanize,
  scaleUp
};
export default utils;
