import _ from "lodash";
import BigNumber from "bignumber.js";
import { IProvider, ISigner, INetwork, IToken, Optional } from "@types";
import networks from "../constants/networks";
import * as globals from "../constants/globals";
import contracts from "../contracts";
import { ethers } from "ethers";

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
    this.decimals = new BigNumber(params.decimals);
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
    provider: IProvider;
    owner: string;
    address: string;
    isUtility?: boolean;
  }): Promise<BigNumber> {
    const { provider, owner, address, isUtility } = params || {};
    if (isUtility === true) {
      const value = await provider.getBalance(owner);
      return new BigNumber(value.toString());
    }
    const contract = contracts.instances.erc20(provider, address);
    const result = await contract.balanceOf(owner);
    return new BigNumber(result.toString());
  }

  async getBalance(params: {
    provider: IProvider;
    owner: string;
  }): Promise<BigNumber> {
    return Token.getBalanceFor({
      ...params,
      isUtility: this.isUtility(),
      address: this.address,
    });
  }

  static async getAllowanceFor(params: {
    provider: IProvider;
    owner: string;
    spender?: string;
    address: string;
    isUtility?: boolean;
  }): Promise<BigNumber> {
    const { provider, owner, address, spender, isUtility } = params || {};

    if (isUtility === true) return new BigNumber(globals.MAX_UINT);
    const contract = contracts.instances.erc20(provider, address);
    const allowance = await contract.allowance(owner, spender || owner);
    return new BigNumber(allowance.toString());
  }

  async getAllowance(params: {
    provider: IProvider;
    owner: string;
    spender?: string;
  }): Promise<BigNumber> {
    return Token.getAllowanceFor({
      ...params,
      isUtility: this.isUtility(),
      address: this.address,
    });
  }

  static async doAllowFor(params: {
    signer: ISigner;
    spender?: string;
    address: string;
    isUtility?: boolean;
    amount?: BigNumber;
  }): Promise<Optional<ethers.providers.TransactionReceipt>> {
    const { signer, address, amount, spender, isUtility } = params || {};
    if (isUtility === true) return undefined;

    const contract = contracts.instances.erc20(signer, address);
    const transaction = await contract.approve(
      spender,
      _.isNil(amount) || amount.isZero()
        ? globals.MAX_UINT.toString()
        : amount.toString()
    );
    const receipt = await transaction.wait();

    return receipt;
  }

  async doAllow(params: {
    signer: ISigner;
    spender?: string;
    amount?: BigNumber;
  }): Promise<Optional<ethers.providers.TransactionReceipt>> {
    return Token.doAllowFor({
      ...params,
      isUtility: this.isUtility(),
      address: this.address,
    });
  }
}
