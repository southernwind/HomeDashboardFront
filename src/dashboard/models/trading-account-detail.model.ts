export interface TradingAccountDetail {
  tradingAccountName: string;
  tradingAccountLogo: string;
  tradingAccountDetailAmountSummaryList: TradingAccountDetailAmountSummary[];
  tradingAccountDetailAmountList: TradingAccountDetailAmount[];
}

export interface TradingAccountDetailAmountSummary {
  investmentProductId: number;
  name: string;
  key: string;
  type: string;
  category: string;
  currencyUnitId: number;
  enable: boolean;
  amount: number;
  averageRate: number;
  latestRate: number;
  tradingAccountCategoryDetailAmountList: TradingAccountCategoryDetailAmount[];
}

export interface TradingAccountDetailAmount {
  tradingAccountCategoryName: string;
  investmentProductId: number;
  investmentProductName: string;
  investmentProductAmountId: number;
  currencyUnitId: number;
  date: Date;
  amount: number;
  price: number;
}

export interface TradingAccountCategoryDetailAmount {
  tradingAccountCategoryName: string;
  amount: number;
  averageRate: number;
}