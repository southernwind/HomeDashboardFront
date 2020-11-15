import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { DashboardService } from './dashboard.service';
import { ElectricPower } from '../models/electric-power.model';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { first } from 'rxjs/operators';


@Injectable({
  providedIn: "root",
})
export class ElectricPowerApiService {
  constructor(private dashboardService: DashboardService, private http: HttpClient) { }
  public electricPowerAsObservable(): Observable<ElectricPower> {
    return this.dashboardService.electricPowerReceivedObservable();
  }

  public getElectricPowerConsumptionList(from: string, to: string): Observable<ElectricPower[]> {
    return this.http.get<ElectricPower[]>(`${environment.apiUrl}api/electric-power-api/get-electric-power-consumption-list?from=${from}&to=${to}`).pipe(first());
  }
}
