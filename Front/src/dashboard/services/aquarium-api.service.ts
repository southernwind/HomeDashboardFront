import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { WakeOnLanTarget } from '../models/wake-on-lan-target.model';
import { DhcpLease } from '../models/dhcp-lease.model';
import { Recipe } from '../models/recipe.model';
import { WaterState } from '../models/water-state.model';

@Injectable({
  providedIn: "root",
})
export class AquariumApiService {
  constructor(private http: HttpClient) { }
  public GetWaterStateList(from: string, to: string, period: number): Observable<WaterState[]> {
    return this.http.get<WaterState[]>(`${environment.apiUrl}api/aquarium-api/get-water-state-list?from=${from}&to=${to}&period=${period}`).pipe(first());
  }
}
