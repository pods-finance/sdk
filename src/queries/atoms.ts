import gql from "graphql-tag";

/**
 * Declare bodies for entities e.g. Action, Option, Pool, User, Manager
 */

export const OptionFragment = gql`
  fragment OptionFragment on Option {
    id
    from
    type
    underlyingAsset
    underlyingAssetDecimals
    underlyingAssetSymbol
    strikeAsset
    strikeAssetDecimals
    strikeAssetSymbol
    strikePrice
    expiration
    exerciseWindowSize
    exerciseStart
    factory {
      id
    }
  }
`;

export const PoolFragment = gql`
  fragment PoolFragment on Pool {
    id
    tokenA
    tokenADecimals
    tokenASymbol
    tokenB
    tokenBDecimals
    tokenBSymbol
    factory {
      id
    }
    option {
      id
    }
  }
`;

export const ActionFragmentLight = gql`
  fragment ActionFragmentLight on Action {
    id
    hash
    type
    from
    timestamp
    inputTokenA
    inputTokenB
    outputTokenA
    outputTokenB
    user {
      id
    }
    option {
      id
      pool {
        id
      }
    }
  }
`;

export const ActionFragmentHeavy = gql`
  fragment ActionFragmentHeavy on Action {
    ...ActionFragmentLight
    spotPrice {
      value
    }
    metadata {
      optionsMintedAndSold
    }
    nextIV
    nextSellingPrice
    nextBuyingPrice
    nextDynamicSellingPrice
    nextDynamicBuyingPrice
    nextUserTokenALiquidity
    nextUserTokenBLiquidity
    nextTBA
    nextTBB
    nextDBA
    nextDBB
    nextFeesA
    nextFeesB
    nextCollateralTVL
    nextPoolTokenATVL
    nextPoolTokenBTVL
    nextUserSnapshotFIMP
    nextUserTokenAOriginalBalance
    nextUserTokenBOriginalBalance
  }
  ${ActionFragmentLight}
`;

export const UserFragment = gql`
  fragment UserFragment on User {
    id
  }
`;

export const PositionFragment = gql`
  fragment PositionFragment on Position {
    id
    user {
      id
    }
    option {
      id
      pool {
        id
      }
    }
    premiumPaid
    premiumReceived
    optionsBought
    optionsSold
    optionsResold
    optionsMinted
    optionsUnminted
    optionsExercised
    underlyingWithdrawn
    collateralWithdrawn
    initialOptionsProvided
    initialTokensProvided
    finalOptionsRemoved
    finalTokensRemoved
    optionsSent
    optionsReceived
  }
`;

export const ConfigurationFragment = gql`
  fragment ConfigurationFragment on Configuration {
    id
    owner
    timestamp
    optionFactory {
      id
    }
    optionHelper {
      id
    }
    poolFactory {
      id
    }
    manager {
      id
    }
  }
`;

export const ManagerFragment = gql`
  fragment ManagerFragment on Manager {
    id
    configuration {
      ...ConfigurationFragment
    }
  }
  ${ConfigurationFragment}
`;

export const OptionFactoryFragment = gql`
  fragment OptionFactoryFragment on OptionFactory {
    id
  }
`;

export const PoolFactoryFragment = gql`
  fragment PoolFactoryFragment on PoolFactory {
    id
  }
`;

export const OptionHelperFragment = gql`
  fragment OptionHelperFragment on OptionHelper {
    id
  }
`;

export const OptionHourActivity = gql`
  fragment OptionFactoryFragment on OptionFactory {
    id
    option {
      id
    }
    timestamp
    day
    hour
    hourlyPremiumReceived
    hourlyPremiumPaid
    hourlyGrossVolumeOptions
    hourlyGrossVolumeTokens
    hourlyActionsCount
  }
`;

export const OptionDayActivity = gql`
  fragment OptionFactoryFragment on OptionFactory {
    id
    option {
      id
    }
    timestamp
    day
    dailyPremiumReceived
    dailyPremiumPaid
    dailyGrossVolumeOptions
    dailyGrossVolumeTokens
    dailyActionsCount
  }
`;
