import { IAction } from "./action";
import { IActionBuilder } from "./actionBuilder";
import { IHelper } from "./helper";
import { IHelperBuilder } from "./helperBuilder";
import { IOption } from "./option";
import { IOptionBuilder } from "./optionBuilder";
import { IPool } from "./pool";
import { IPoolBuilder } from "./poolBuilder";
import { IToken } from "./token";

export interface ISDK {
  clients: any;
  constants: any;
  contracts: any;
  queries: any;
  builders: any;
  entities: any;
  utils: any;
  Action: IAction;
  Helper: IHelper;
  Option: IOption;
  Pool: IPool;
  Token: IToken;
  ActionBuilder: IActionBuilder;
  HelperBuilder: IHelperBuilder;
  OptionBuilder: IOptionBuilder;
  PoolBuilder: IPoolBuilder;
}
