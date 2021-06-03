import _ from "lodash";
import Web3 from "web3";
import { IOption, IOptionBuilder, IOptionBuilderParams } from "@types";
import { Option } from "../entities";
import PoolBuilder from "./pool";

export default class OptionBuilder implements IOptionBuilder {
  private constructor() {}

  public static fromData(params: {
    source: { [key: string]: any };
    networkId: number;
    web3?: Web3;
  }): IOption {
    const body = { ...params.source };

    body.web3 = params.web3;
    body.networkId = params.networkId;
    body.address = _.get(body, "id");
    body.poolAddress = _.get(body, "pool.id");
    body.factoryAddress = _.get(body, "factory.id");

    const option = new Option({
      address: body.address,
      networkId: body.networkId,
    }).init(body as IOptionBuilderParams);

    if (_.has(body, "pool") && _.has(body, "pool.id")) {
      const pool = PoolBuilder.fromData({
        web3: params.web3,
        source: _.get(body, "pool"),
        networkId: body.networkId,
      });

      option.pool = pool;
    }

    return option;
  }
}
