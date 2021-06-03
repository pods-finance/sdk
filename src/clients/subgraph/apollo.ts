import _ from "lodash";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { INetwork, IApolloClient } from "@types";

export function getClientInstance(
  network: INetwork,
  isDev: boolean = false
): IApolloClient {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: _.get(network.subgraph, isDev ? "dev" : "prod"),
    }),
    cache: new InMemoryCache(),
  });

  return client;
}
