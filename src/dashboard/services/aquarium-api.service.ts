import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { first } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { WaterState, CurrentWaterState } from '../models/water-state.model';
import { DashboardService } from './dashboard.service';


@Injectable({
  providedIn: "root",
})
export class AquariumApiService {
  constructor(private http: HttpClient, private dashboardService: DashboardService) { }
  public GetWaterStateList(from: string, to: string, period: number): Observable<WaterState[]> {
    return this.http.get<WaterState[]>(`${environment.apiUrl}api/aquarium-api/get-water-state-list?from=${from}&to=${to}&period=${period}`).pipe(first());
  }

  public waterStateAsObservable(): Observable<CurrentWaterState> {
    return this.dashboardService.aquaStateChangedObservable();
  }

  public getLatestWaterState(): Observable<CurrentWaterState> {
    return this.http.get<CurrentWaterState>(`${environment.apiUrl}api/aquarium-api/get-latest-water-state`).pipe(first());
  }
}
