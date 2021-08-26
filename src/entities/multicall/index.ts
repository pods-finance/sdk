import MulticallAggregator from "./aggregator";
import MulticallEngine from "./engine";

const Multicall = {
  use: MulticallEngine.use,
  parse: MulticallEngine.parse,

  getOptionsStatics: MulticallAggregator.getOptionsStatics,
  getPoolStatics: MulticallAggregator.getPoolsStatics,
  getTokenSymbols: MulticallAggregator.getTokensSymbols,

  getGeneralDynamics: MulticallAggregator.getGeneralDynamics,
  getUserDynamics: MulticallAggregator.getUserDynamics,
};

export default Multicall;
