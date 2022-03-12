import gql from "graphql-tag";
import { PositionWithDependenciesFragment } from "./atoms";

/**
 * -------------------------------------------
 * Other atoms (fragments)
 * -------------------------------------------
 */

export const getByUser = gql`
  query positions(
    $user: Bytes!
    $first: Int!
    $blacklisted: [Bytes!]!
    $optionTypes: [Int!]!
  ) {
    positions(
      where: {
        user: $user
        option_not_in: $blacklisted
        optionType_in: $optionTypes
      }
      first: $first
      orderBy: expiration
      orderDirection: desc
    ) {
      ...PositionWithDependenciesFragment
    }
  }
  ${PositionWithDependenciesFragment}
`;

export const getByUserAndOption = gql`
  query positions($user: Bytes!, $option: Bytes!) {
    positions(
      where: { user: $user, option: $option }
      orderBy: expiration
      orderDirection: desc
    ) {
      ...PositionWithDependenciesFragment
    }
  }
  ${PositionWithDependenciesFragment}
`;

export const getByUserAndOptions = gql`
  query positions($user: Bytes!, $options: [Bytes!]!) {
    positions(
      where: { user: $user, option_in: $options }
      orderBy: expiration
      orderDirection: desc
    ) {
      ...PositionWithDependenciesFragment
    }
  }
  ${PositionWithDependenciesFragment}
`;
