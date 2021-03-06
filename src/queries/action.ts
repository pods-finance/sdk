import gql from "graphql-tag";
import {
  ActionFragmentLight,
  ActionFragmentHeavy,
  OptionFragment,
  PoolFragment,
} from "./atoms";

/**
 * -------------------------------------------
 * Other atoms (fragments)
 * -------------------------------------------
 */

export const ActionFragmentLightWithDependencies = gql`
  fragment ActionFragmentLightWithDependencies on Action {
    ...ActionFragmentLight
    option {
      ...OptionFragment
      pool {
        ...PoolFragment
      }
    }
  }
  ${ActionFragmentLight}
  ${OptionFragment}
  ${PoolFragment}
`;

export const ActionFragmentHeavyWithDependencies = gql`
  fragment ActionFragmentHeavyWithDependencies on Action {
    ...ActionFragmentHeavy
    option {
      ...OptionFragment
      pool {
        ...PoolFragment
      }
    }
  }
  ${ActionFragmentHeavy}
  ${OptionFragment}
  ${PoolFragment}
`;

/**
 * -------------------------------------------
 * Queries
 * -------------------------------------------
 */

export const getByAddressLight = gql`
  query action($id: Bytes!) {
    action(id: $address) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getByAddressHeavy = gql`
  query action($id: Bytes!) {
    action(id: $address) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getByAddressesLight = gql`
  query actions($ids: [Bytes!]!) {
    actions(where: { id_in: $ids }) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getByAddressesHeavy = gql`
  query actions($ids: [Bytes!]!) {
    actions(where: { id_in: $ids }) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListLight = gql`
  query actions($first: Int!, $skip: Int!, $optionTypes: [Int!]!) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { optionType_in: $optionTypes }
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListHeavy = gql`
  query actions($first: Int!, $skip: Int!, $optionTypes: [Int!]!) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { optionType_in: $optionTypes }
    ) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListLightTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $optionTypes: [Int!]!) {
    actions(
      first: $first
      where: { timestamp_lt: $timestamp, optionType_in: $optionTypes }
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListHeavyTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $optionTypes: [Int!]!) {
    actions(
      first: $first
      where: { timestamp_lt: $timestamp, optionType_in: $optionTypes }
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListByUserLight = gql`
  query actions(
    $first: Int!
    $skip: Int!
    $user: Bytes!
    $optionTypes: [Int!]!
  ) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, optionType_in: $optionTypes }
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListByUserHeavy = gql`
  query actions(
    $first: Int!
    $skip: Int!
    $user: Bytes!
    $optionTypes: [Int!]!
  ) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, optionType_in: $optionTypes }
    ) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListByUserLightTimestampPaginated = gql`
  query actions(
    $first: Int!
    $timestamp: Int!
    $user: Bytes!
    $optionTypes: [Int!]!
  ) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: {
        user: $user
        timestamp_lt: $timestamp
        optionType_in: $optionTypes
      }
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListByUserHeavyTimestampPaginated = gql`
  query actions(
    $first: Int!
    $timestamp: Int!
    $user: Bytes!
    $optionTypes: [Int!]!
  ) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: {
        user: $user
        timestamp_lt: $timestamp
        optionType_in: $optionTypes
      }
    ) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListByUserAndOptionLightTimestampPaginated = gql`
  query actions(
    $first: Int!
    $timestamp: Int!
    $user: Bytes!
    $option: Bytes!
  ) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, option: $option, timestamp_lt: $timestamp }
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListByUserAndOptionHeavyTimestampPaginated = gql`
  query actions(
    $first: Int!
    $timestamp: Int!
    $user: Bytes!
    $option: Bytes!
  ) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, option: $option, timestamp_lt: $timestamp }
    ) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListByUserAndPoolLightTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $user: Bytes!, $pool: Bytes!) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, pool: $pool, timestamp_lt: $timestamp }
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListByUserAndPoolHeavyTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $user: Bytes!, $pool: Bytes!) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, pool: $pool, timestamp_lt: $timestamp }
    ) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListByUserAndOptionsLightTimestampPaginated = gql`
  query options(
    $first: Int!
    $timestamp: Int!
    $user: Bytes!
    $options: [Bytes!]!
  ) {
    options(where: { id_in: $options }) {
      id
      actions(
        first: $first
        orderBy: timestamp
        orderDirection: desc
        where: { user: $user, timestamp_lt: $timestamp }
      ) {
        ...ActionFragmentLightWithDependencies
      }
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListByUserAndOptionsHeavyTimestampPaginated = gql`
  query actions(
    $first: Int!
    $timestamp: Int!
    $user: Bytes!
    $options: [Bytes!]!
  ) {
    options(where: { id_in: $options }) {
      id
      actions(
        first: $first
        orderBy: timestamp
        orderDirection: desc
        where: { user: $user, timestamp_lt: $timestamp }
      ) {
        ...ActionFragmentHeavyWithDependencies
      }
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListByOptionLight = gql`
  query actions($first: Int!, $skip: Int!, $option: Bytes!) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { option: $option }
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListByOptionHeavy = gql`
  query actions($first: Int!, $skip: Int!, $option: Bytes!) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { option: $option }
    ) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListByOptionLightTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $option: Bytes!) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { option: $option, timestamp_lt: $timestamp }
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListByOptionHeavyTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $option: Bytes!) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { option: $option, timestamp_lt: $timestamp }
    ) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getList = getListLight;
