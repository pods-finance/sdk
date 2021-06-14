import _ from "lodash";
import Web3 from "web3";
import queries from "../queries";
import { IHelperBuilder, IHelper, IApolloClient } from "@types";
import { Helper } from "../entities";

export default class HelperBuilder implements IHelperBuilder {
  public static async resolve(params: {
    client: IApolloClient;
    web3: Web3;
  }): Promise<IHelper> {
    const { client, web3 } = params;
    const address = await this.getLatestAddress({ client });
    return this.resolveFromAddress({ address, web3 });
  }

  /**
   *
   * @param {object} params
   * @param {string} params.address Address for the configuration manager
   * @param {Web3} params.web3 Web3 instance
   * @returns
   */
  public static async resolveFromAddress(params: {
    address: string;
    web3: Web3;
  }): Promise<IHelper> {
    const { address, web3 } = params;
    const networkId = await await web3.eth.net.getId();
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
