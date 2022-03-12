import gql from "graphql-tag";
import {
  ActionFragmentLight,
  ActionFragmentHeavy,
  PositionFragment,
  UserFragment,
} from "./atoms";

export const getByAddress = gql`
  query user($address: Bytes!) {
    user(id: $address) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

export const getByAddressWithPositions = gql`
  query user($address: Bytes!, $first: Int!, $skip: Int!) {
    user(id: $address) {
      ...UserFragment
      positions(first: $first, skip: $skip) {
        ...PositionFragment
      }
    }
  }
  ${UserFragment}
  ${PositionFragment}
`;

export const getByAddressWithPositionsForOptions = gql`
  query user($address: Bytes!, $options: [Bytes!]!) {
    user(id: $address) {
      ...UserFragment
      positions(where: { option_in: $options }) {
        ...PositionFragment
      }
    }
  }
  ${UserFragment}
  ${PositionFragment}
`;

export const getByAddressWithActionsLight = gql`
  query user($address: Bytes!, $first: Int!, $skip: Int!) {
    user(id: $address) {
      ...UserFragment
      actions(first: $first, skip: $skip) {
        ...ActionFragmentLight
      }
    }
  }
  ${UserFragment}
  ${ActionFragmentLight}
`;

export const getByAddressWithActionsHeavy = gql`
  query user($address: Bytes!, $first: Int!, $skip: Int!) {
    user(id: $address) {
      ...UserFragment
      actions(first: $first, skip: $skip) {
        ...ActionFragmentHeavy
      }
    }
  }
  ${UserFragment}
  ${ActionFragmentHeavy}
`;

export const getByAddressWithActionsLightTimestampPaginated = gql`
  query user($address: Bytes!, $timestamp: Int!) {
    user(id: $address) {
      ...UserFragment
      actions(where: { timestamp_lt: $timestamp }) {
        ...ActionFragmentLight
      }
    }
  }
  ${UserFragment}
  ${ActionFragmentLight}
`;

export const getByAddressWithActionsHeavyTimestampPaginated = gql`
  query user($address: Bytes!, $timestamp: Int!) {
    user(id: $address) {
      ...UserFragment
      actions(where: { timestamp_lt: $timestamp }) {
        ...ActionFragmentHeavy
      }
    }
  }
  ${UserFragment}
  ${ActionFragmentHeavy}
`;
