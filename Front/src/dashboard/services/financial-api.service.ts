import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Asset } from "../models/asset.model";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Moment } from 'moment';

@Injectable({
  providedIn: "root",
})
export class FinancialApiService {
  constructor(private http: HttpClient) { }
  public GetAssets(from: Moment, to: Moment): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${environment.apiUrl}api/financial-api/get-assets?from=${from.format("YYYY-MM-DD")}&to=${to.format("YYYY-MM-DD")}`).pipe(first());
  }
}
