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
  query actions($first: Int!, $skip: Int!) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListHeavy = gql`
  query actions($first: Int!, $skip: Int!) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListLightTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!) {
    actions(
      first: $first
      where: { timestamp_lt: $timestamp }
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListHeavyTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!) {
    actions(
      first: $first
      where: { timestamp_lt: $timestamp }
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListByUserLight = gql`
  query actions($first: Int!, $skip: Int!, $user: Bytes!) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user }
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListByUserHeavy = gql`
  query actions($first: Int!, $skip: Int!, $user: Bytes!) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user }
    ) {
      ...ActionFragmentHeavyWithDependencies
    }
  }
  ${ActionFragmentHeavyWithDependencies}
`;

export const getListByUserLightTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $user: Bytes!) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, timestamp_lt: $timestamp }
    ) {
      ...ActionFragmentLightWithDependencies
    }
  }
  ${ActionFragmentLightWithDependencies}
`;

export const getListByUserHeavyTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $user: Bytes!) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, timestamp_lt: $timestamp }
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

export const getList = getListLight;
