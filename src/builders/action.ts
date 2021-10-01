import _ from "lodash";
import {
  IAction,
  IActionBuilder,
  IActionBuilderParams,
  IApolloClient,
} from "@types";
import { Action } from "../entities";
import OptionBuilder from "./option";
import queries from "../queries";
import { OptionType } from "../constants/globals";

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

  public static async fromOptionAndUser(params: {
    client: IApolloClient;
    option: string;
    user: string;
    networkId: number;

    first: number;
    timestamp: number;
  }): Promise<IAction[]> {
    const { option, user, client, networkId, first, timestamp } = params;

    const query = await client.query({
      query: queries.action.getListByUserAndOptionLightTimestampPaginated,
      variables: {
        first,
        timestamp,
        user: String(user).toLowerCase(),
        option: String(option).toLowerCase(),
      },
      fetchPolicy: "no-cache",
    });
    const source = _.get(query, "data.actions");

    if (_.isNil(query) || _.isNil(source) || !source.length) return [];

    return source.map((item: { [key: string]: any }) =>
      ActionBuilder.fromData({ source: item, networkId })
    );
  }

  public static async fromOptionsAndUser(params: {
    client: IApolloClient;
    addresses: string[];
    user: string;
    networkId: number;

    first: number;
    timestamp: number;
  }): Promise<{ [key: string]: IAction[] }> {
    const {
      addresses: options,
      user,
      client,
      networkId,
      first,
      timestamp,
    } = params;

    const query = await client.query({
      query: queries.action.getListByUserAndOptionsLightTimestampPaginated,
      variables: {
        first,
        timestamp,
        user: String(user).toLowerCase(),
        options: options.map((option) => String(option).toLowerCase()),
      },
      fetchPolicy: "no-cache",
    });
    const source = _.get(query, "data.options");

    if (_.isNil(query) || _.isNil(source) || !source.length) return {};

    const result: { [key: string]: any } = {};

    source.forEach((option: { [key: string]: any }) => {
      result[
        _.get(option, "id")
      ] = option.actions.map((action: { [key: string]: any }) =>
        ActionBuilder.fromData({ source: action, networkId })
      );
    });

    return result;
  }

  public static async fromUser(params: {
    client: IApolloClient;
    user: string;
    networkId: number;

    first: number;
    timestamp: number;
    optionTypes: number[];
  }): Promise<IAction[]> {
    const { user, client, networkId, first, timestamp, optionTypes } = params;

    const query = await client.query({
      query: queries.action.getListByUserLightTimestampPaginated,
      variables: {
        first,
        timestamp,
        user: String(user).toLowerCase(),
        optionTypes: optionTypes || [OptionType.Put, OptionType.Call],
      },
    });

    const source = _.get(query, "data.actions");

    if (_.isNil(query) || _.isNil(source) || !source.length) return [];

    return source.map((item: { [key: string]: any }) =>
      ActionBuilder.fromData({ source: item, networkId })
    );
  }

  public static async fromOption(params: {
    client: IApolloClient;
    option: string;
    networkId: number;

    first: number;
    timestamp: number;
  }): Promise<IAction[]> {
    const { option, client, networkId, first, timestamp } = params;

    const query = await client.query({
      query: queries.action.getListByOptionHeavyTimestampPaginated,
      variables: {
        first,
        timestamp,
        option: String(option).toLowerCase(),
      },
      fetchPolicy: "no-cache",
    });

    const source = _.get(query, "data.actions");

    if (_.isNil(query) || _.isNil(source) || !source.length) return [];

    return source.map((item: { [key: string]: any }) =>
      ActionBuilder.fromData({ source: item, networkId })
    );
  }

  public static async fromNetwork(params: {
    client: IApolloClient;
    networkId: number;

    first: number;
    timestamp: number;
    optionTypes: number[];
  }): Promise<IAction[]> {
    const { client, networkId, first, timestamp, optionTypes } = params;

    const query = await client.query({
      query: queries.action.getListHeavyTimestampPaginated,
      variables: {
        first,
        timestamp,
        optionTypes: optionTypes || [OptionType.Put, OptionType.Call],
      },
    });

    const source = _.get(query, "data.actions");

    if (_.isNil(query) || _.isNil(source) || !source.length) return [];

    return source.map((item: { [key: string]: any }) =>
      ActionBuilder.fromData({ source: item, networkId })
    );
  }
}
