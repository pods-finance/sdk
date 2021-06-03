import { ISDK } from "./@types";

import clients from "./clients";
import constants from "./constants";
import contracts from "./contracts";
import queries from "./queries";

import * as builders from "./builders";
import * as entities from "./entities";

const { Action, Helper, Option, Pool, Token } = entities;
const { ActionBuilder, HelperBuilder, OptionBuilder, PoolBuilder } = builders;

const SDK: ISDK = {
  clients,
  constants,
  contracts,
  queries,
  builders,
  entities,
};

export {
  SDK,
  Action,
  Helper,
  Option,
  Pool,
  Token,
  ActionBuilder,
  HelperBuilder,
  OptionBuilder,
  PoolBuilder,
};

export default SDK;

/**
 * Temporary
 */

import { main } from "./mock";
main();
