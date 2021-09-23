import _ from "lodash";
import dotenv from "dotenv";
import utils from "./utils";

import BigNumber from "bignumber.js";

import { Multicall, Token } from "./entities";
import queries from "./queries";
import clients from "./clients";
import networks from "./constants/networks";

import { IAction, IOption } from "./@types";
import { ActionBuilder, OptionBuilder } from "./builders";

import "cross-fetch/polyfill";

dotenv.config();
utils.config();

async function tokens(): Promise<void> {
  const provider = clients.provider.getBaseProvider(42, {
    infura: process.env.TESTING_INFURA_KEY || "",
  });

  const token = new Token({
    address: "0xe22da380ee6b445bb8273c81944adeb6e8450422",
    networkId: networks.kovan.networkId,
    symbol: "USDC",
    decimals: new BigNumber(8),
  });

  console.log({ token });

  console.log(
    "USDC Balance",
    await token.getBalance({
      provider,
      owner: "",
    })
  );
}

async function subgraphOptions(): Promise<void> {
  const client = clients.subgraph.apollo.getClientInstance(
    networks.kovan,
    true
  );

  const query = await client.query({
    query: queries.option.getByAddresses,
    variables: {
      addresses: [
        "0x4982e943d3606bcf066b9cc404e430a96dae3945".toLowerCase(),
        "0x25309892a0947d1140b7cc916e7d8ce77816ae08".toLowerCase(),
      ],
    },
    fetchPolicy: "no-cache",
  });

  console.log({ options: _.get(query, "data.options") });
}

async function subgraphActions(): Promise<void> {
  const client = clients.subgraph.apollo.getClientInstance(
    networks.kovan,
    true
  );

  const query = await client.query({
    query: queries.action.getListHeavy,
    variables: {
      first: 5,
      skip: 0,
    },
    fetchPolicy: "no-cache",
  });

  console.log({ actions: _.get(query, "data.actions") });
}

async function flowLive(): Promise<void> {
  const provider = clients.provider.getBaseProvider(42, {
    infura: process.env.TESTING_INFURA_KEY || "",
  });

  const subgraphInstance = clients.subgraph.apollo.getClientInstance(
    networks.kovan,
    true
  );

  const query = await subgraphInstance.query({
    query: queries.option.getList,
    variables: {
      first: 2,
      skip: 2,
    },
    fetchPolicy: "no-cache",
  });

  const list = _.get(query, "data.options");

  const options: IOption[] = list.map((item: any) =>
    OptionBuilder.fromData({
      source: item,
      networkId: networks.kovan.networkId,
      provider,
    })
  );

  options.forEach(async (option) => {
    const parameters = await option.pool?.getParameters();

    console.log(parameters, parameters?.totalBalanceA?.humanized.toString());
  });
}

async function flowActions(): Promise<void> {
  const subgraphInstance = clients.subgraph.apollo.getClientInstance(
    networks.kovan,
    true
  );

  const query = await subgraphInstance.query({
    query: queries.action.getListHeavy,
    variables: {
      first: 2,
      skip: 0,
    },
    fetchPolicy: "no-cache",
  });

  const list = _.get(query, "data.actions");

  const actions: IAction[] = list.map((item: any) =>
    ActionBuilder.fromData({
      source: item,
      networkId: networks.kovan.networkId,
    })
  );

  actions.forEach((action) => {
    console.log(
      "Action",
      action.getNextDynamicBuyingPriceValue().humanized.toString()
    );
  });
}

async function flowMulticall(
  user: string = "",
  addresses: string[] = []
): Promise<void> {
  const provider = clients.provider.getBaseProvider(42, {
    infura: process.env.TESTING_INFURA_KEY || "",
  });

  const subgraphInstance = clients.subgraph.apollo.getClientInstance(
    networks.kovan,
    true
  );

  const query = await subgraphInstance.query({
    query: queries.option.getByAddresses,
    variables: {
      addresses: addresses,
    },
    fetchPolicy: "no-cache",
  });

  const list = _.get(query, "data.options");

  const result: IOption[] = list.map((item: any) =>
    OptionBuilder.fromData({
      source: item,
      networkId: networks.kovan.networkId,
      provider,
    })
  );
  const start = Date.now();
  const generalDynamics = await Multicall.getGeneralDynamics({
    provider,
    options: result,
  });
  console.log(`Multicall:`, Date.now() - start);

  const userDynamics = await Multicall.getUserDynamics({
    user,
    provider,
    options: result,
  });
  console.log(`Multicall:`, Date.now() - start);

  console.log({
    generalDynamics,
    userDynamics,
  });
}

async function flowMulticallStatics(): Promise<void> {
  const provider = clients.provider.getBaseProvider(42, {
    infura: process.env.TESTING_INFURA_KEY || "",
  });

  const options = await Multicall.getOptionsStatics({
    provider,
    addresses: ["0x057d924eadc7d40b794fe5b366ab32a54a40f816"],
  });

  const tokens = await Multicall.getTokenSymbols({
    provider,
    addresses: [
      "0x824B1E309c4eB33501fB49f5de9Cb7481686a799",
      "0xe22da380ee6B445bb8273C81944ADEB6E8450422",
    ],
  });

  const pools = await Multicall.getPoolStatics({
    provider,
    addresses: ["0x5d23da35e307f38baa260cb3f598e99d15337457"],
  });

  console.log(options, pools, tokens);
}

const tests = {
  tokens,
  subgraphActions,
  subgraphOptions,
  flowLive,
  flowActions,
  flowMulticall,
  flowMulticallStatics,
};

export async function main() {
  await tests.flowMulticallStatics();
}
