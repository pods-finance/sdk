import dotenv from "dotenv";
import "cross-fetch/polyfill";

dotenv.config();
utils.config();

import clients from "./clients";
import constants from "./constants";
import contracts from "./contracts";
import queries from "./queries";
import utils from "./utils";

import * as builders from "./builders";
import * as entities from "./entities";

const { Action, Helper, Option, Pool, Token, Multicall } = entities;
const { ActionBuilder, HelperBuilder, OptionBuilder, PoolBuilder } = builders;

const SDK = {
  clients,
  constants,
  contracts,
  queries,
  builders,
  entities,
  utils,
  Action,
  Helper,
  Option,
  Pool,
  Token,
  Multicall,
  ActionBuilder,
  HelperBuilder,
  OptionBuilder,
  PoolBuilder,
};

export {
  SDK,
  Action,
  Helper,
  Option,
  Pool,
  Token,
  Multicall,
  ActionBuilder,
  HelperBuilder,
  OptionBuilder,
  PoolBuilder,
};

export default SDK;

// import { main } from "./mock";
// main();
