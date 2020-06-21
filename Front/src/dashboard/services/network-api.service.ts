import { Injectable, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class NetworkApiService {
  constructor(private http: HttpClient) { }
  public SendMagicPacket(macAddress: string): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}api/network-api/post-send-magic-packet-request`, { targetMacAddress: macAddress }).pipe(first());
  }
}
