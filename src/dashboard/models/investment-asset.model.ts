export interface InvestmentAsset {
  investmentAssetProducts: {
    investmentProductId: number;
    name: string;
    category: string;
    currencyUnitId: number;
    dailyRates: {
      date: string;
      rate: number;
      amount: number;
      averageRate: number;
    }[];
  }[];
  currencyRates: {
    date: string;
    id: number,
    latestRate: number
  }[];
}