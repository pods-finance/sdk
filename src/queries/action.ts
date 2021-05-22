import gql from "graphql-tag-ts";
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
      ...ActionFragmentLight
    }
  }
  ${ActionFragmentLight}
`;

export const getByAddressHeavy = gql`
  query action($id: Bytes!) {
    action(id: $address) {
      ...ActionFragmentHeavy
    }
  }
  ${ActionFragmentHeavy}
`;

export const getByAddressesLight = gql`
  query actions($ids: [Bytes!]!) {
    actions(where: { id_in: $ids }) {
      ...ActionFragmentLight
    }
  }
  ${ActionFragmentLight}
`;

export const getByAddressesHeavy = gql`
  query actions($ids: [Bytes!]!) {
    actions(where: { id_in: $ids }) {
      ...ActionFragmentHeavy
    }
  }
  ${ActionFragmentHeavy}
`;

export const getListLight = gql`
  query actions($first: Int!, $skip: Int!) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ActionFragmentLight
    }
  }
  ${ActionFragmentLight}
`;

export const getListHeavy = gql`
  query actions($first: Int!, $skip: Int!) {
    actions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ActionFragmentHeavy
    }
  }
  ${ActionFragmentHeavy}
`;

export const getListLightTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!) {
    actions(
      first: $first
      where: { timestamp_lt: $timestamp }
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ActionFragmentLight
    }
  }
  ${ActionFragmentLight}
`;

export const getListHeavyTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!) {
    actions(
      first: $first
      where: { timestamp_lt: $timestamp }
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ActionFragmentHeavy
    }
  }
  ${ActionFragmentHeavy}
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
      ...ActionFragmentLight
    }
  }
  ${ActionFragmentLight}
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
      ...ActionFragmentHeavy
    }
  }
  ${ActionFragmentHeavy}
`;

export const getListByUserLightTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $user: Bytes!) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, timestamp_lt: $timestamp }
    ) {
      ...ActionFragmentLight
    }
  }
  ${ActionFragmentLight}
`;

export const getListByUserHeavyTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $user: Bytes!) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, timestamp_lt: $timestamp }
    ) {
      ...ActionFragmentHeavy
    }
  }
  ${ActionFragmentHeavy}
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
      ...ActionFragmentLight
    }
  }
  ${ActionFragmentLight}
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
      ...ActionFragmentHeavy
    }
  }
  ${ActionFragmentHeavy}
`;

export const getListByUserAndPoolLightTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $user: Bytes!, $pool: Bytes!) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, pool: $pool, timestamp_lt: $timestamp }
    ) {
      ...ActionFragmentLight
    }
  }
  ${ActionFragmentLight}
`;

export const getListByUserAndPoolHeavyTimestampPaginated = gql`
  query actions($first: Int!, $timestamp: Int!, $user: Bytes!, $pool: Bytes!) {
    actions(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, pool: $pool, timestamp_lt: $timestamp }
    ) {
      ...ActionFragmentHeavy
    }
  }
  ${ActionFragmentHeavy}
`;
