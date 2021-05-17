import _ from "lodash";
export function isNilOrEmptyString(value: any) {
  return _.isNil(value) || String(value).length === 0;
}

export function config() {
  _.mixin({ isNilOrEmptyString });
}

const utils = {
  config,
  isNilOrEmptyString,
};
export default utils;
