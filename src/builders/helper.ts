import _ from "lodash";
import queries from "../queries";
import { IHelperBuilder, IHelper, IApolloClient, IProvider } from "@types";
import { Helper } from "../entities";

export default class HelperBuilder implements IHelperBuilder {
  public static async resolve(params: {
    client: IApolloClient;
    provider: IProvider;
  }): Promise<IHelper> {
    const { client, provider } = params;
    const address = await this.getLatestAddress({ client });
    return this.resolveFromAddress({ address, provider });
  }

  /**
   *
   * @param {object} params
   * @param {string} params.address Address for the configuration manager
   * @param {IProvider} params.provider Provider instance
   * @returns
   */
  public static async resolveFromAddress(params: {
    address: string;
    provider: IProvider;
  }): Promise<IHelper> {
    const { address, provider } = params;
    const networkId = ((await provider.getNetwork()) || {}).chainId;
    const entity = new Helper({ address, networkId, provider });

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
