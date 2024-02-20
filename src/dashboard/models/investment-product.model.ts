export interface InvestmentProduct {
  investmentProductId: number,
  name: string,
  type: string,
  category: string,
  key: string,
  enable: boolean,
  currencyUnitId: number,
  latestRate: number,
  amount: number,
  averageRate: number
}

export interface InvestmentProductDetail extends InvestmentProduct {
  investmentProductAmountList: InvestmentProductAmount[],
  investmentProductRateList: InvestmentProductRate[]
}
export interface InvestmentProductAmount {
  investmentProductId: number,
  investmentProductAmountId: number,
  tradingAccountLogo: string,
  tradingAccountName: string,
  date: string,
  amount: number,
  price: number
}

export interface InvestmentProductRate {
  date: string,
  rate: number
}