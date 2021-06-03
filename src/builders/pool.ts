import _ from "lodash";
import { IPool, IPoolBuilder, IPoolBuilderParams } from "@types";
import { Pool } from "../entities";
import Web3 from "web3";

export default class PoolBuilder implements IPoolBuilder {
  private constructor() {}

  public static fromData(params: {
    source: { [key: string]: any };
    networkId: number;
    web3?: Web3;
  }): IPool {
    const body = { ...params.source };

    body.web3 = params.web3;
    body.networkId = params.networkId;
    body.address = _.get(body, "id");
    body.factoryAddress = _.get(body, "factory.id");
    body.optionAddress = _.get(body, "option.id");

    const pool = new Pool({
      address: body.address,
      networkId: body.networkId,
    }).init(body as IPoolBuilderParams);

    return pool;
  }
}
