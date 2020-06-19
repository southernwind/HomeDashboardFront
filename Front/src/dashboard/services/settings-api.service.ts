import { Injectable, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Asset } from "../models/asset.model";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Moment } from 'moment';
import { Transaction } from '../models/transaction.model';
import { Settings } from '../models/settings.model';

@Injectable({
  providedIn: "root",
})
export class SettingsApiService {
  constructor(private http: HttpClient) { }
  public GetSettings(): Observable<Settings> {
    return this.http.get<Settings>(`${environment.apiUrl}api/settings-api/get-current-settings`).pipe(first());
  }


  public UpdateSettings(settings: Settings): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}api/settings-api/update-settings`, settings).pipe(first());
  }
}
