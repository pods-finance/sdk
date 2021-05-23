import _ from "lodash";
import { IAction, IActionBuilder, IActionBuilderParams } from "@types";
import { Action } from "../entities";
import OptionBuilder from "./option";

export default class ActionBuilder implements IActionBuilder {
  private constructor() {}

  public static fromData(params: {
    source: { [key: string]: any };
    networkId: number;
  }): IAction {
    const body = { ...params.source };

    body.networkId = params.networkId;
    body.userAddress = _.get(body, "user.id");
    body.optionAddress = _.get(body, "option.id");
    body.poolAddress = _.get(body, "option.pool.id");

    body.metadataOptionsMintedAndSold = _.get(
      body,
      "metadata.optionsMintedAndSold"
    );
    body.spotPrice = _.get(body, "spotPrice.value");

    const action = new Action(body as IActionBuilderParams);

    if (_.has(body, "option") && _.has(body, "option.id")) {
      const option = OptionBuilder.fromData({
        source: _.get(body, "option"),
        networkId: body.networkId,
      });

      action.option = option;
    }

    return action;
  }
}
