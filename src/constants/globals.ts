export enum OptionType {
  Put = 0,
  Call = 1,
}

export enum ActionType {
  Buy = "Buy",
  Sell = "Sell",
  Mint = "Mint",
  Unmint = "Unmint",
  Resell = "Resell",
  AddLiquidity = "AddLiquidity",
  RemoveLiquidity = "RemoveLiquidity",
  Exercise = "Exercise",
  Withdraw = "Withdraw",
  TransferFrom = "TransferFrom",
  TransferTo = "TransferTo",
}

export const DEFAULT_TIMEOUT: number = 60 * 20;

export const MILESTONE_EXPIRATION_SOON: number = 60 * 60 * 24 * 3;
