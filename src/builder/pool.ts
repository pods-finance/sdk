import _ from "lodash";
import { IPool, IPoolBuilder, IPoolBuilderParams } from "@types";
import { Pool } from "../entities";

export default class PoolBuilder implements IPoolBuilder {
  private constructor() {}

  public static fromSubgraphData(
    source: { [key: string]: any },
    networkId: number
  ): IPool {
    const params = { ...source };
    params.networkId = networkId;
    params.address = _.get(source, "id");
    params.factoryAddress = _.get(source, "factory.id");
    params.optionAddress = _.get(source, "option.id");

    const pool = new Pool(params as IPoolBuilderParams);

    return pool;
  }
}
