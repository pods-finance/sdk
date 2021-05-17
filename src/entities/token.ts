import _ from "lodash";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import networks from "../constants/networks";
import contracts from "../contracts";

interface IToken {
  readonly address: string;
  readonly decimals: BigNumber;
  readonly symbol: string;
  readonly name: string;
  readonly networkId: number;

  balanceOf(params: { web3: Web3; spender: string }): Promise<BigNumber>;
}

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
    const network: Network = networks[this.networkId];
    return network.token.utility.includes(this.address);
  }

  isUtilityWrapped() {
    const network: Network = networks[this.networkId];
    return network.token.wrapped.includes(this.address);
  }

  async balanceOf(params: { web3: Web3; spender: string }): Promise<BigNumber> {
    const contract = contracts.instances.erc20(params.web3, this.address);
    return contract.methods.balanceOf(params.spender).call();
  }
}
