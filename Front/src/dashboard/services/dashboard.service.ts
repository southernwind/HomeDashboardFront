import { Injectable } from '@angular/core';
import { Observable, defer, Subject, of, from, combineLatest, merge, concat } from 'rxjs';
import { CurrentWaterState } from '../models/water-state.model';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@aspnet/signalr";
import { environment } from "../../environments/environment";
import { map, first } from 'rxjs/operators';


@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private signalRConnection: HubConnection = null;
  public get signalRConnectionId(): string {
    return this.signalRConnection?.connectionId;
  }

  constructor() {
  }
  private signalrConnectedSubject = new Subject<void>();
  public signalrConnected: Observable<void> = defer(() => {
    if (this.signalRConnection.state === HubConnectionState.Connected) {
      return of(void 0);
    } else {
      return this.signalrConnectedSubject.pipe(first());
    }
  });

  public aquaStateChangedObservable(): Observable<CurrentWaterState> {
    return defer(() => {
      this.createSignalRConnection();
      const subject = new Subject<CurrentWaterState>();
      this.signalRConnection.on("aqua-state-changed", (time: string, waterTemperature: number, humidity: number, temperature: number) => {
        subject.next({
          time,
          waterTemperature,
          humidity,
          temperature
        });
      });
      return subject;
    });
  }

  private createSignalRConnection(): void {
    if (this.signalRConnection === null) {
      this.signalRConnection = new HubConnectionBuilder()
        .withUrl(`${environment.apiUrl}api/hubs/dashboard-hub`)
        .build();

      this.signalRConnection.start().then(x => this.signalrConnectedSubject.next(x)).catch(err => {
        console.log(err)
        throw err;
      });
    }
  }
}
