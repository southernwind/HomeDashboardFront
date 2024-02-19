import { Injectable, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Asset } from "../models/asset.model";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Moment } from 'moment';
import { Transaction } from '../models/transaction.model';
import { InvestmentProduct, InvestmentProductAmount } from '../models/investment-product.model';
import { InvestmentCurrencyUnit } from '../models/investment-currency-unit.model';
import { InvestmentAsset } from '../models/investment-asset.model';
import { TradingAccount } from '../models/trading-account.model';
import { TradingAccountDetail } from '../models/trading-account-detail.model';

@Injectable({
  providedIn: "root",
})
export class FinancialApiService {
  constructor(private http: HttpClient) { }
  public GetAssets(from: Moment, to: Moment): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${environment.apiUrl}api/financial-api/get-assets?from=${from.format("YYYY-MM-DD")}&to=${to.format("YYYY-MM-DD")}`).pipe(first());
  }

  public GetLatestAsset(from: Moment, to: Moment): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${environment.apiUrl}api/financial-api/get-latest-asset?from=${from.format("YYYY-MM-DD")}&to=${to.format("YYYY-MM-DD")}`).pipe(first());
  }

  public GetTransactions(from: Moment, to: Moment): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${environment.apiUrl}api/financial-api/get-transactions?from=${from.format("YYYY-MM-DD")}&to=${to.format("YYYY-MM-DD")}`).pipe(first());
  }

  public PostUpdateRequest(from: Moment, to: Moment): Observable<{ key: string }> {
    return this
      .http
      .post<{ key: string }>(
        `${environment.apiUrl}api/financial-api/post-update-by-term-request`,
        {
          from: from.format("YYYY-MM-DD"),
          to: to.format("YYYY-MM-DD")
        }).pipe(first());
  }

  public GetUpdateStatus(key: string): Observable<{ progress: number }> {
    return this
      .http
      .get<{ progress: number }>(
        `${environment.apiUrl}api/financial-api/get-update-status?key=${key}`
      ).pipe(first());
  }

  public PostRegisterInvestmentProduct(name: string, type: string, category: string, currencyUnitId: number, key: string): Observable<{ result: boolean }> {
    return this
      .http
      .post<{ result: boolean }>(
        `${environment.apiUrl}api/financial-api/post-register-investment-product`,
        {
          name: name,
          type: type,
          category: category,
          currencyUnitId: currencyUnitId,
          key: key
        }).pipe(first());
  }

  public PostRegisterInvestmentProductAmount(investmentProductId: number, tradingAccountId: number, tradingAccountCategoryId: number, date: Moment, amount: number, price: number): Observable<{ result: boolean }> {
    return this
      .http
      .post<{ result: boolean }>(
        `${environment.apiUrl}api/financial-api/post-register-investment-product-amount`,
        {
          investmentProductId: investmentProductId,
          tradingAccountId: tradingAccountId,
          tradingAccountCategoryId: tradingAccountCategoryId,
          date: date.format("YYYY-MM-DD"),
          amount: amount,
          price: price
        }).pipe(first());
  }

  public getInvestmentProductAmountList(investmentProductId: number): Observable<InvestmentProductAmount[]> {
    return this
      .http
      .get<InvestmentProductAmount[]>(
        `${environment.apiUrl}api/financial-api/get-investment-product-amount-list?investmentProductId=${investmentProductId}`).pipe(first());
  }

  public GetInvestmentProductList(): Observable<InvestmentProduct[]> {
    return this
      .http
      .get<InvestmentProduct[]>(
        `${environment.apiUrl}api/financial-api/get-investment-product-list`
      ).pipe(first());
  }

  public GetInvestmentCurrencyUnitList(): Observable<InvestmentCurrencyUnit[]> {
    return this
      .http
      .get<InvestmentCurrencyUnit[]>(
        `${environment.apiUrl}api/financial-api/get-investment-currency-unit-list`
      ).pipe(first());
  }

  public GetInvestmentProductTypeList(): Observable<string[]> {
    return this
      .http
      .get<string[]>(
        `${environment.apiUrl}api/financial-api/get-investment-product-type-list`
      ).pipe(first());
  }

  public GetInvestmentProductCategoryList(): Observable<string[]> {
    return this
      .http
      .get<string[]>(
        `${environment.apiUrl}api/financial-api/get-investment-product-category-list`
      ).pipe(first());
  }
  public GetInvestmentAssets(from: Moment, to: Moment): Observable<InvestmentAsset> {
    return this
      .http
      .get<InvestmentAsset>(
        `${environment.apiUrl}api/financial-api/get-investment-assets?from=${from.format("YYYY-MM-DD")}&to=${to.format("YYYY-MM-DD")}`
      ).pipe(first());
  }

  public GetTradingAccountListAsync(): Observable<TradingAccount[]> {
    return this
      .http
      .get<TradingAccount[]>(
        `${environment.apiUrl}api/financial-api/get-trading-account-list`
      ).pipe(first());
  }
  public getTradingAccountDetail(tradingAccountId: number): Observable<TradingAccountDetail> {
    return this
      .http
      .get<TradingAccountDetail>(
        `${environment.apiUrl}api/financial-api/get-trading-account-detail?tradingAccountId=${tradingAccountId}`
      ).pipe(first());
  }
}
