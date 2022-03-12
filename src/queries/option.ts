import gql from "graphql-tag";
import { OptionFragment, PoolFragment } from "./atoms";

export const getByAddress = gql`
  query option($address: Bytes!) {
    option(id: $address) {
      ...OptionFragment
      pool {
        ...PoolFragment
      }
    }
  }
  ${OptionFragment}
  ${PoolFragment}
`;

export const getByAddresses = gql`
  query options($addresses: [Bytes!]!) {
    options(
      where: { id_in: $addresses }
      orderBy: expiration
      orderDirection: desc
    ) {
      ...OptionFragment
      pool {
        ...PoolFragment
      }
    }
  }
  ${OptionFragment}
  ${PoolFragment}
`;

export const getList = gql`
  query options($first: Int!, $skip: Int!) {
    options(
      first: $first
      skip: $skip
      orderBy: expiration
      orderDirection: desc
    ) {
      ...OptionFragment
      pool {
        ...PoolFragment
      }
    }
  }
  ${OptionFragment}
  ${PoolFragment}
`;
