import dotenv from "dotenv";
import utils from "./utils";

import BigNumber from "bignumber.js";

import { web3Source } from "./sources";
import { Token } from "./entities";
import networks from "./constants/networks";

import { IOption } from "@types";
import mock from "./constants/mock";
import { OptionBuilder, PoolBuilder } from "./builder";

dotenv.config();
utils.config();

async function main() {
  const web3Instance = web3Source.getInfuraInstance();
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

  const options: IOption[] = [];

  mock.forEach((item) => {
    const option = OptionBuilder.fromSubgraphData(
      item,
      networks.kovan.networkId
    );
    const pool = PoolBuilder.fromSubgraphData(
      item.pool,
      networks.kovan.networkId
    );

    option.pool = pool;
    options.push(option);
  });

  options.forEach(async (option) => {
    console.log(
      "Underlying Balance",
      option.address,
      await option.underlying.getBalance({
        web3: web3Instance,
        owner: "0xAFA20A683A4ff46991Cb065Ae507Bf3b0110d47D",
      })
    );
  });
}

main();
