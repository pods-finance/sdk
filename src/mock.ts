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

import { Contract, Provider } from "ethers-multicall";
import { ethers } from "ethers";

import "cross-fetch/polyfill";
import contracts from "./contracts";

dotenv.config();
utils.config();

async function tokens(): Promise<void> {
  const provider = clients.provider.getInfuraProvider(
    42,
    process.env.TESTING_INFURA_KEY || ""
  );

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
  const provider = clients.provider.getInfuraProvider(
    42,
    process.env.TESTING_INFURA_KEY || ""
  );

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

async function testMulticall(): Promise<void> {
  const provider = new ethers.providers.InfuraProvider(
    "kovan",
    process.env.TESTING_INFURA_KEY || ""
  );

  const tokenAddress = "0xe22da380ee6b445bb8273c81944adeb6e8450422";

  const ethcallProvider = new Provider(provider, 42);

  await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor

  const daiContract = new Contract(tokenAddress, contracts.abis.ERC20ABI);

  const wallet = "0xdfaD0c01a28d9d95486bb3f0821E4F5644704FA7";

  const ethBalanceCall = ethcallProvider.getEthBalance(wallet);
  const usdcBalanceCall = daiContract.balanceOf(wallet);

  const [ethBalance, daiBalance] = await ethcallProvider.all([
    ethBalanceCall,
    usdcBalanceCall,
  ]);

  console.log("ETH Balance:", ethBalance.toString());
  console.log("DAI Balance:", daiBalance.toString());
}

async function flowMulticall(): Promise<void> {
  const provider = clients.provider.getInfuraProvider(
    42,
    process.env.TESTING_INFURA_KEY || ""
  );

  const subgraphInstance = clients.subgraph.apollo.getClientInstance(
    networks.kovan,
    true
  );

  const query = await subgraphInstance.query({
    query: queries.option.getByAddresses,
    variables: {
      addresses: ["0x8ac8fd04a4cbc3be5c9c3d97132d4e6a6a258fc6"],
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
  const start = Date.now();
  const generalDynamics = await Multicall.getGeneralDynamics({
    provider,
    options,
  });
  console.log(`Multicall:`, Date.now() - start);

  const userDynamics = await Multicall.getUserDynamics({
    user: "0xc4d56A1ba1A9993b3d6201b4ED7DCF5d78A5123d",
    provider,
    options,
  });
  console.log(`Multicall:`, Date.now() - start);

  console.log({
    generalDynamics,
    userDynamics,
  });
}

const tests = {
  tokens,
  subgraphActions,
  subgraphOptions,
  flowLive,
  flowActions,
  testMulticall,
  flowMulticall,
};

export async function main() {
  await tests.flowMulticall();
}
