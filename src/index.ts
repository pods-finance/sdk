import _ from "lodash";
import dotenv from "dotenv";
import utils from "./utils";

import BigNumber from "bignumber.js";

import { Token } from "./entities";
import queries from "./queries";
import clients from "./clients";
import networks from "./constants/networks";

import { IOption } from "@types";
import mock from "./constants/mock";
import { OptionBuilder, PoolBuilder } from "./builder";

import "cross-fetch/polyfill";

dotenv.config();
utils.config();

async function tokens(): Promise<void> {
  const web3Instance = clients.web3.getInfuraInstance();
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

async function flowMock(): Promise<void> {
  const web3Instance = clients.web3.getInfuraInstance();

  const options: IOption[] = [];

  mock.forEach((item) => {
    const option = OptionBuilder.fromData({
      source: item,
      networkId: networks.kovan.networkId,
    });
    const pool = PoolBuilder.fromData({
      source: item.pool,
      networkId: networks.kovan.networkId,
    });

    option.pool = pool;
    options.push(option);
  });

  options.forEach(async (option) => {
    const parameters = await option.pool?.getParameters({
      web3: web3Instance,
    });

    console.log(
      parameters,
      parameters?.impliedVolatility?.humanized.toString(),
      parameters?.totalBalanceA?.humanized.toString(),
      parameters?.totalBalanceB?.humanized.toString(),
      parameters?.deamortizedBalanceA?.humanized.toString(),
      parameters?.deamortizedBalanceB?.humanized.toString(),
      parameters?.feeAmountPoolA?.humanized.toString(),
      parameters?.feeAmountPoolB?.humanized.toString()
    );
  });
}

async function flowLive(): Promise<void> {
  const options: IOption[] = [];
  const web3Instance = clients.web3.getInfuraInstance();
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

  console.log({ list });

  list.forEach((item: any) => {
    const option = OptionBuilder.fromData({
      source: item,
      networkId: networks.kovan.networkId,
    });
    const pool = PoolBuilder.fromData({
      source: item.pool,
      networkId: networks.kovan.networkId,
    });

    option.pool = pool;
    options.push(option);
  });

  options.forEach(async (option) => {
    const parameters = await option.pool?.getParameters({
      web3: web3Instance,
    });

    console.log(
      parameters,
      parameters?.impliedVolatility?.humanized.toString()
    );
  });
}

const tests = {
  tokens,
  subgraphActions,
  subgraphOptions,
  flowMock,
  flowLive,
};

console.log({ tests });

async function main() {
  console.log("hello");
  await tests.flowLive();
}

main();
