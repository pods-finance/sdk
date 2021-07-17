import _ from "lodash";
import {
  Optional,
  IPosition,
  IPositionBuilder,
  IPositionBuilderParams,
  IApolloClient,
} from "@types";
import { Position } from "../entities";
import OptionBuilder from "./option";
import queries from "../queries";

export default class PositionBuilder implements IPositionBuilder {
  private constructor() {}

  public static fromData(params: {
    source: { [key: string]: any };
    networkId: number;
  }): IPosition {
    const body = { ...params.source };

    body.networkId = params.networkId;
    body.userAddress = _.get(body, "user.id");
    body.optionAddress = _.get(body, "option.id");
    body.poolAddress = _.get(body, "option.pool.id");

    const position = new Position(body as IPositionBuilderParams);

    if (_.has(body, "option") && _.has(body, "option.id")) {
      const option = OptionBuilder.fromData({
        source: _.get(body, "option"),
        networkId: body.networkId,
      });

      position.option = option;
    }

    return position;
  }

  public static async fromOptionAndUser(params: {
    client: IApolloClient;
    option: string;
    user: string;
    networkId: number;
  }): Promise<Optional<IPosition>> {
    const { option, user, client, networkId } = params;

    const query = await client.query({
      query: queries.position.getByUserAndOption,
      variables: {
        user: String(user).toLowerCase(),
        option: String(option).toLowerCase(),
      },
      fetchPolicy: "no-cache",
    });
    const source = _.get(query, "data.position");

    if (_.isNil(query) || _.isNil(source) || !_.has(source, "id"))
      return undefined;

    return PositionBuilder.fromData({ source, networkId });
  }

  public static async fromOptionsAndUser(params: {
    client: IApolloClient;
    options: string[];
    user: string;
    networkId: number;
  }): Promise<{ [key: string]: Optional<IPosition> }> {
    const { options, user, client, networkId } = params;

    const query = await client.query({
      query: queries.position.getByUserAndOptions,
      variables: {
        user: String(user).toLowerCase(),
        options: options.map((option) => String(option).toLowerCase()),
      },
      fetchPolicy: "no-cache",
    });
    const source = _.get(query, "data.positions");

    const result: { [key: string]: any } = {};
    options.forEach((option) => {
      result[option] = undefined;
    });

    if (!(_.isNil(query) || _.isNil(source) || !source.length))
      source.forEach((position: { [key: string]: any }) => {
        result[_.get(position, "option.id")] = PositionBuilder.fromData({
          source: position,
          networkId,
        });
      });

    return result;
  }

  public static async fromUser(params: {
    client: IApolloClient;
    user: string;
    networkId: number;

    first: number;
    blacklisted: string[];
  }): Promise<IPosition[]> {
    const { user, client, networkId, first, blacklisted } = params;

    const query = await client.query({
      query: queries.position.getByUser,
      variables: {
        user: String(user).toLowerCase(),
        first,
        blacklisted: blacklisted.map((address) =>
          String(address).toLowerCase()
        ),
      },
      fetchPolicy: "no-cache",
    });
    const source = _.get(query, "data.positions");

    if (_.isNil(query) || _.isNil(source) || !source.length) return [];

    return source.map((item: { [key: string]: any }) =>
      PositionBuilder.fromData({ source: item, networkId })
    );
  }
}
