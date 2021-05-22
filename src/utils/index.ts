import _ from "lodash";
import BigNumber from "bignumber.js";
import { IValue } from "@types";
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
      `Unexpected type for parameter: ${identifier}, ${strongType}`
    );
}

const utils = {
  config,
  isNilOrEmptyString,
  attemptAsync,
  zero,
  expect,
};
export default utils;
