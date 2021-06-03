import _ from "lodash";
import Web3 from "web3";
import queries from "../queries";
import { IHelperBuilder, IHelper, IApolloClient } from "@types";
import { Helper } from "../entities";

export default class HelperBuilder implements IHelperBuilder {
  public static async resolve(params: {
    client: IApolloClient;
    networkId: number;
    web3: Web3;
  }): Promise<IHelper> {
    const { client, networkId, web3 } = params;
    const address = await this.getLatestAddress({ client });
    return this.resolveFromAddress({ address, networkId, web3 });
  }

  public static resolveFromAddress(params: {
    address: string;
    networkId: number;
    web3: Web3;
  }): IHelper {
    const { address, networkId, web3 } = params;
    const entity = new Helper({ address, networkId, web3 });

    return entity;
  }

  public static async getLatestAddress(params: {
    client: IApolloClient;
  }): Promise<string> {
    const { client } = params;

    const query = await client.query({
      query: queries.manager.getList,
      fetchPolicy: "no-cache",
    });

    const result = _.get(query, "data.managers[0]");
    const address = _.get(result, "configuration.optionHelper.id");

    return address;
  }
}
