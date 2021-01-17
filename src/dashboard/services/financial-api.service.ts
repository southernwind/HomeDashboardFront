import { Injectable, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Asset } from "../models/asset.model";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Moment } from 'moment';
import { Transaction } from '../models/transaction.model';
import { InvestmentProduct } from '../models/investment-product.model';

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

  public PostRegisterInvestmentProduct(name: string, type: string, key: string): Observable<{ result: boolean }> {
    return this
      .http
      .post<{ result: boolean }>(
        `${environment.apiUrl}api/financial-api/post-register-investment-product`,
        {
          name: name,
          type: type,
          key: key
        }).pipe(first());
  }

  public PostRegisterInvestmentProductAmount(investmentProductId: number, date: Moment, amount: number, price: number): Observable<{ result: boolean }> {
    return this
      .http
      .post<{ result: boolean }>(
        `${environment.apiUrl}api/financial-api/post-register-investment-product-amount`,
        {
          investmentProductId: investmentProductId,
          date: date.format("YYYY-MM-DD"),
          amount: amount,
          price: price
        }).pipe(first());
  }

  public GetInvestmentProductList(): Observable<InvestmentProduct[]> {
    return this
      .http
      .get<InvestmentProduct[]>(
        `${environment.apiUrl}api/financial-api/get-investment-product-list`
      ).pipe(first());
  }
}
