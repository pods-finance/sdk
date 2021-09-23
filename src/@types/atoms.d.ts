import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ethers } from "ethers";

export type IApolloClient = ApolloClient<NormalizedCacheObject>;
export type IProvider =
  | ethers.providers.JsonRpcProvider
  | ethers.providers.Web3Provider;

export type ISigner = ethers.Signer;

export type ISignerOrProvider = IProvider | ISigner;

export type Optional<Base> = Base | undefined;

export interface ITransactionError {
  transaction: ethers.Transaction;
  transactionHash: string;
  receipt: ethers.providers.TransactionReceipt;
}
