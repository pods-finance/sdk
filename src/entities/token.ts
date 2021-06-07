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

  static async getBalanceFor(params: {
    web3: Web3;
    owner: string;
    address: string;
    isUtility?: boolean;
  }): Promise<BigNumber> {
    const { web3, owner, address, isUtility } = params || {};
    if (isUtility === true) {
      const value = await web3.eth.getBalance(owner);
      return new BigNumber(value);
    }
    const contract = contracts.instances.erc20(web3, address);
    return new BigNumber(await contract.methods.balanceOf(owner).call());
  }

  async getBalance(params: { web3: Web3; owner: string }): Promise<BigNumber> {
    return Token.getBalanceFor({
      ...params,
      isUtility: this.isUtility(),
      address: this.address,
    });
  }

  static async getAllowanceFor(params: {
    web3: Web3;
    owner: string;
    spender?: string;
    address: string;
    isUtility?: boolean;
  }): Promise<BigNumber> {
    const { web3, owner, address, spender, isUtility } = params || {};

    if (isUtility === true) return new BigNumber(Infinity);
    const contract = contracts.instances.erc20(web3, address);
    return new BigNumber(
      contract.methods.allowance(owner, spender || owner).call()
    );
  }

  async getAllowance(params: {
    web3: Web3;
    owner: string;
    spender?: string;
  }): Promise<BigNumber> {
    return Token.getAllowanceFor({
      ...params,
      isUtility: this.isUtility(),
      address: this.address,
    });
  }
}
