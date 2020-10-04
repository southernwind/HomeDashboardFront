import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { DashboardService } from './dashboard.service';
import { ElectricPower } from '../models/electric-power.model copy';


@Injectable({
  providedIn: "root",
})
export class ElectricPowerApiService {
  constructor(private dashboardService: DashboardService) { }
  public electricPowerAsObservable(): Observable<ElectricPower> {
    return this.dashboardService.electricPowerReceivedObservable();
  }
}
