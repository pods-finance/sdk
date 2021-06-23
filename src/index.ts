import { ISDK } from "./@types";

import clients from "./clients";
import constants from "./constants";
import contracts from "./contracts";
import queries from "./queries";
import utils from "./utils";

import * as builders from "./builders";
import * as entities from "./entities";

import dotenv from "dotenv";
import "cross-fetch/polyfill";

dotenv.config();
utils.config();

const { Action, Helper, Option, Pool, Token } = entities;
const { ActionBuilder, HelperBuilder, OptionBuilder, PoolBuilder } = builders;

const SDK: ISDK = {
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
  ActionBuilder,
  HelperBuilder,
  OptionBuilder,
  PoolBuilder,
};

export default SDK;

import { main } from "./mock";
main();
