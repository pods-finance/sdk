import _ from "lodash";
import { IOption, IOptionBuilder, IOptionBuilderParams } from "@types";
import { Option } from "../entities";

export default class OptionBuilder implements IOptionBuilder {
  private constructor() {}

  public static fromSubgraphData(params: {
    source: { [key: string]: any };
    networkId: number;
  }): IOption {
    const body = { ...params.source };
    body.address = _.get(body, "id");
    body.networkId = params.networkId;
    body.type = _.get(body, "type");

    body.expiration = _.get(body, "expiration");
    body.exerciseStart = _.get(body, "exerciseStart");
    body.exerciseWindowSize = _.get(body, "exerciseWindowSize");

    body.poolAddress = _.get(body, "pool.id");
    body.factoryAddress = _.get(body, "factory.id");

    const option = new Option(body as IOptionBuilderParams);

    return option;
  }
}
