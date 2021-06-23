import _ from "lodash";
import { IProvider, IPool, IPoolBuilder, IPoolBuilderParams } from "@types";
import { Pool } from "../entities";

export default class PoolBuilder implements IPoolBuilder {
  private constructor() {}

  public static fromData(params: {
    source: { [key: string]: any };
    networkId: number;
    provider?: IProvider;
  }): IPool {
    const body = { ...params.source };

    body.provider = params.provider;
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
