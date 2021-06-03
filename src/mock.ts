import _ from "lodash";
import dotenv from "dotenv";
import utils from "./utils";

import BigNumber from "bignumber.js";

import { Token } from "./entities";
import queries from "./queries";
import clients from "./clients";
import networks from "./constants/networks";

import { IAction, IOption } from "./@types";
import { ActionBuilder, OptionBuilder } from "./builders";

import "cross-fetch/polyfill";

dotenv.config();
utils.config();

async function tokens(): Promise<void> {
  const web3Instance = clients.web3.getInfuraInstance(
    process.env.INFURA_ENDPOINT_KOVAN || ""
  );
  const balance = await web3Instance.eth.getBalance(
    "0xAFA20A683A4ff46991Cb065Ae507Bf3b0110d47D"
  );
  console.log("Wallet: ", balance);

  const token = new Token({
    address: "0xe22da380ee6b445bb8273c81944adeb6e8450422",
    networkId: networks.kovan.networkId,
    symbol: "USDC",
    decimals: new BigNumber(8),
  });

  console.log(
    "USDC Balance",
    await token.getBalance({
      web3: web3Instance,
      owner: "0xAFA20A683A4ff46991Cb065Ae507Bf3b0110d47D",
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
  const web3Instance = clients.web3.getInfuraInstance(
    process.env.INFURA_ENDPOINT_KOVAN || ""
  );
  const subgraphInstance = clients.subgraph.apollo.getClientInstance(
    networks.kovan,
    true
  );

  const query = await subgraphInstance.query({
    query: queries.option.getList,
    variables: {
      first: 2,
      skip: 0,
    },
    fetchPolicy: "no-cache",
  });

  const list = _.get(query, "data.options");

  const options: IOption[] = list.map((item: any) =>
    OptionBuilder.fromData({
      source: item,
      networkId: networks.kovan.networkId,
      web3: web3Instance,
    })
  );

  options.forEach(async (option) => {
    const parameters = await option.pool?.getParameters();

    console.log(
      parameters,
      parameters?.impliedVolatility?.humanized.toString()
    );
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

const tests = {
  tokens,
  subgraphActions,
  subgraphOptions,
  flowLive,
  flowActions,
};

export async function main() {
  await tests.flowActions();
}
