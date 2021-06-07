import _ from "lodash";
import Web3 from "web3";
import {
  IApolloClient,
  IOption,
  IOptionBuilder,
  IOptionBuilderParams,
  Optional,
} from "@types";
import { Option } from "../entities";
import PoolBuilder from "./pool";
import queries from "../queries";

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

  public static async fromAddress(params: {
    client: IApolloClient;
    address: string;
    networkId: number;
    web3?: Web3;
  }): Promise<Optional<IOption>> {
    const { address, client, networkId, web3 } = params;

    const query = await client.query({
      query: queries.option.getByAddress,
      variables: {
        address,
      },
      fetchPolicy: "no-cache",
    });

    const source = _.get(query, "data.option");

    if (_.isNil(query) || _.isNil(source)) return undefined;

    return OptionBuilder.fromData({ source, networkId, web3 });
  }

  public static async fromAddresses(params: {
    client: IApolloClient;
    addresses: string;
    networkId: number;
    web3?: Web3;
  }): Promise<Optional<IOption>> {
    const { addresses, client, networkId, web3 } = params;

    const query = await client.query({
      query: queries.option.getByAddresses,
      variables: {
        addresses,
      },
      fetchPolicy: "no-cache",
    });

    const source = _.get(query, "data.options");

    if (_.isNil(query) || _.isNil(source)) return undefined;

    return source.map((item: any) =>
      OptionBuilder.fromData({ source: item, networkId, web3 })
    );
  }
}
