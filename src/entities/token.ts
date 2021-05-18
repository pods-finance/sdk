import _ from "lodash";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import { INetwork, IToken } from "@types";
import networks from "../constants/networks";
import contracts from "../contracts";

export default class Token implements IToken {
  public readonly address: string;
  public readonly decimals: BigNumber;
  public readonly symbol: string;
  public readonly name: string;
  public readonly networkId: number;

  constructor(params: {
    address: string;
    networkId: number;
    symbol: string;
    decimals: BigNumber;
    name?: string;
  }) {
    this.address = params.address.toLowerCase();
    this.symbol = params.symbol;
    this.decimals = params.decimals;
    this.networkId = params.networkId;

    this.name = params.name || params.symbol;
  }

  isUtility() {
    const network: INetwork = networks[this.networkId];
    return network.token.utility.includes(this.address);
  }

  isUtilityWrapped() {
    const network: INetwork = networks[this.networkId];
    return network.token.wrapped.includes(this.address);
  }

  async getBalance(params: { web3: Web3; owner: string }): Promise<BigNumber> {
    if (this.isUtility()) {
      const value = await params.web3.eth.getBalance(params.owner);
      return new BigNumber(value);
    }
    const contract = contracts.instances.erc20(params.web3, this.address);
    return contract.methods.balanceOf(params.owner).call();
  }

  async getAllowance(params: {
    web3: Web3;
    owner: string;
    spender?: string;
  }): Promise<BigNumber> {
    if (this.isUtility()) return new BigNumber(Infinity);
    const contract = contracts.instances.erc20(params.web3, this.address);
    return contract.methods.balanceOf(params.spender || params.owner).call();
  }
}
