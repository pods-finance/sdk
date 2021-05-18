import _ from "lodash";
import { IPool, IPoolBuilder, IPoolBuilderParams } from "@types";
import { Pool } from "../entities";

export default class PoolBuilder implements IPoolBuilder {
  private constructor() {}

  public static fromSubgraph() {}

  public static fromSubgraphData(params: {
    source: { [key: string]: any };
    networkId: number;
  }): IPool {
    const body = { ...params.source };
    body.networkId = params.networkId;
    body.address = _.get(body, "id");
    body.factoryAddress = _.get(body, "factory.id");
    body.optionAddress = _.get(body, "option.id");

    const pool = new Pool(body as IPoolBuilderParams);

    return pool;
  }
}
