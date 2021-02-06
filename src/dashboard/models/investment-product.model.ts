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
export interface InvestmentProductAmount {
  investmentProductId: number,
  investmentProductAmountId: number,
  date: string,
  amount: number,
  price: number
}
export interface InvestmentProductRate {
  investmentProductId: number,
  date: string,
  value: number
}
