import gql from "graphql-tag";
import { OptionFragment, PoolFragment } from "./atoms";

export const getByAddress = gql`
  query pool($address: Bytes!) {
    pool(id: $address) {
      ...PoolFragment
      option {
        ...OptionFragment
      }
    }
  }
  ${OptionFragment}
  ${PoolFragment}
`;

export const getByAddresses = gql`
  query pools($addresses: [Bytes!]!) {
    pools(where: { id_in: $addresses }) {
      ...PoolFragment
      option {
        ...OptionFragment
      }
    }
  }
  ${OptionFragment}
  ${PoolFragment}
`;
