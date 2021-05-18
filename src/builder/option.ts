import _ from "lodash";
import { IOption, IOptionBuilder, IOptionBuilderParams } from "@types";
import { Option } from "../entities";

export default class OptionBuilder implements IOptionBuilder {
  private constructor() {}

  public static fromSubgraphData(
    source: { [key: string]: any },
    networkId: number
  ): IOption {
    const params = { ...source };
    params.address = _.get(source, "id");
    params.networkId = networkId;
    params.type = _.get(source, "type");

    params.expiration = _.get(source, "expiration");
    params.exerciseStart = _.get(source, "exerciseStart");
    params.exerciseWindowSize = _.get(source, "exerciseWindowSize");

    params.poolAddress = _.get(source, "pool.id");
    params.factoryAddress = _.get(source, "factory.id");

    // params.pool.address = _.get(source, "pool.id");
    // params.pool.factoryAddress = _.get(source, "pool.factory.id");

    const option = new Option(params as IOptionBuilderParams);

    return option;
  }
}
