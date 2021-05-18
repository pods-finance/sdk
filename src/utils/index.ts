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

const utils = {
  config,
  isNilOrEmptyString,
};
export default utils;
