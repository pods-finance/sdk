import _ from "lodash";
import { ethers } from "ethers";

import {
  Multicall as Engine,
  ContractCallContext as CallContext,
  ContractCallReturnContext as Response,
  ContractCallContext as Context,
  CallReturnContext as Result,
} from "ethereum-multicall";

import { IProvider, Optional } from "@types";

import { ALLOW_LOGS } from "../../constants/globals";
import { networks } from "../../constants";
import { expect } from "../../utils";

export default class MulticallEngine {
  /**
   * Pass the instructions/calls to the multicall engine and wait for them to be processed or "used"
   * [!] Please pass an "id" to the context of the instructions for MulticallEngine.parse to work as intended
   *
   * @param {object} params
   * @param {IProvider} params.provider Etheres provider
   * @param {CallContext[]} params.calls Array of sets of instructions {reference, contractAddress, abi, context, calls: [{reference, methodName, methodParameters}]}
   * @returns
   */
  static async use(params: {
    provider: IProvider;
    calls: CallContext[];
  }): Promise<Optional<{ [key: string]: Response }>> {
    const { provider: base, calls } = params;
    expect(base, "ethers provider");
    const networkId = ((await base.getNetwork()) || {}).chainId;
    expect(networkId, "ethers provider networkId");

    const engine = new Engine({
      ethersProvider: base,
      tryAggregate: true,
      multicallCustomContractAddress: networks[networkId].multicall2,
    });

    expect(engine, "multicall provider");
    try {
      const request = await engine.call(calls);
      const { results } = request;
      return results;
    } catch (error) {
      if (ALLOW_LOGS())
        console.error("Pods SDK - Multicall General", error, {
          networkId,
        });
    }

    return undefined;
  }

  /**
   * Pass the results to the multicall usage call for them to be interpreted
   * [!] Please check that an "id" is passed to the context of the instructions for parse to work as intended
   *
   * @param {object} params
   * @param {object} params.items Items resulting from MulticallEngine.use
   * @returns
   */
  static async parse(params: {
    items: { [key: string]: Response };
  }): Promise<Optional<{ [key: string]: any }>> {
    const { items } = params;
    const parsed: { [key: string]: any } = {};

    Object.keys(items).forEach((key) => {
      const response: Response = items[key];
      const context: Context = response.originalContractCallContext;
      const results: Result[] = response.callsReturnContext;

      const details: { [key: string]: any } = {};

      const id = _.get(context, "context.id");
      const isNumber = _.get(context, "context.isNumber");
      const isString = _.get(context, "context.isString");
      const isNumbers = _.get(context, "context.isNumbers");

      results.forEach((result: Result) => {
        const reference = _.get(result, "reference");
        const status = _.get(result, "success");
        const values = _.get(result, "returnValues");

        if (!status || !_.isArray(values) || values.length === 0)
          details[reference] = undefined;
        else {
          let detail: unknown = values;
          if (isString) {
            detail = String(values[0]);
          } else if (isNumber) {
            detail = _.attempt(() =>
              ethers.BigNumber.from(values[0]).toString()
            );
          } else if (isNumbers) {
            detail = _.attempt(() =>
              values.map((v) => ethers.BigNumber.from(v).toString())
            );
          } else {
            console.warn(
              "Pods SDK",
              "The multicall engine parser cannot find a specified result type (e.g. isNumber/isNumbers/isString)."
            );
          }
          details[reference] = detail;
        }
      });

      if (_.has(parsed, id))
        parsed[id] = {
          ...parsed[id],
          ...details,
        };
      else parsed[id] = details;
    });

    return parsed;
  }
}
