import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { WakeOnLanTarget } from '../models/wake-on-lan-target.model';

@Injectable({
  providedIn: "root",
})
export class NetworkApiService {
  constructor(private http: HttpClient) { }
  public SendMagicPacket(macAddress: string): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}api/network-api/post-send-magic-packet-request`, { targetMacAddress: macAddress }).pipe(first());
  }

  public RegisterWakeOnLanTarget(target: WakeOnLanTarget): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}api/network-api/post-register-wake-on-lan-target`, target).pipe(first());
  }

  public DeleteWakeOnLanTarget(target: WakeOnLanTarget): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}api/network-api/post-delete-wake-on-lan-target`, target).pipe(first());
  }

  public GetWakeOnLanTarget(): Observable<WakeOnLanTarget[]> {
    return this.http.get<WakeOnLanTarget[]>(`${environment.apiUrl}api/network-api/get-wake-on-lan-target-list`).pipe(first());
  }
}
