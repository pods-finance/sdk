import gql from "graphql-tag-ts";
import { ManagerFragment, ConfigurationFragment } from "./atoms";

export const getList = gql`
  query managers {
    managers {
      ...ManagerFragment
    }
  }
  ${ManagerFragment}
`;

export const getListWithConfigurations = gql`
  query managers($first: Int!, $skip: Int!) {
    managers {
      ...ManagerFragment
      configurations(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ConfigurationFragment
      }
    }
  }
  ${ManagerFragment}
  ${ConfigurationFragment}
`;
