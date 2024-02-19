export interface TradingAccount {
  tradingAccountId: number;
  name: string;
  logo: string;
  tradingAccountCategories: TradingAccountCategory[];
}

export interface TradingAccountCategory {
  tradingAccountCategoryId: number;
  tradingAccountCategoryName: string;
  defaultFlag: boolean;
}