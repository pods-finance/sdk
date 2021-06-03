import Web3 from "web3";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";

export type IApolloClient = ApolloClient<NormalizedCacheObject>;
export type IWeb3 = Web3;

export type Optional<Base> = Base | undefined;
