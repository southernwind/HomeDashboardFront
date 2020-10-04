import { Injectable } from '@angular/core';
import { Observable, defer, Subject, of, from, combineLatest, merge, concat } from 'rxjs';
import { CurrentWaterState } from '../models/water-state.model';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@aspnet/signalr";
import { environment } from "../../environments/environment";
import { map, first } from 'rxjs/operators';
import { ElectricPower } from '../models/electric-power.model copy';


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
      this.signalRConnection.on("aqua-state-changed", (timeStamp: string, waterTemperature: number, humidity: number, temperature: number) => {
        subject.next({
          timeStamp,
          waterTemperature,
          humidity,
          temperature
        });
      });
      return subject;
    });
  }

  public electricPowerReceivedObservable(): Observable<ElectricPower> {
    return defer(() => {
      this.createSignalRConnection();
      const subject = new Subject<ElectricPower>();
      this.signalRConnection.on("electric-power-received", (timeStamp: string, electricPower: number) => {
        subject.next({
          timeStamp,
          electricPower
        });
      });
      return subject;
    });
  }

  private createSignalRConnection(): void {
    if (this.signalRConnection === null) {
      this.signalRConnection = new HubConnectionBuilder()
        .withUrl(`${environment.apiUrl}api/hubs/dashboard-hub`)
        .withAutomaticReconnect({
          /** Called after the transport loses the connection.
           *
           * @param {number} previousRetryCount The number of consecutive failed reconnect attempts so far.
           *
           * @param {number} elapsedMilliseconds The amount of time in milliseconds spent reconnecting so far.
           *
           * @returns {number | null} The amount of time in milliseconds to wait before the next reconnect attempt. `null` tells the client to stop retrying and close.
           */
          nextRetryDelayInMilliseconds(previousRetryCount: number, elapsedMilliseconds: number): number | null {
            return 1000;
          }
        })
        .build();

      this.signalRConnection.start().then(x => this.signalrConnectedSubject.next(x)).catch(err => {
        console.log(err)
        throw err;
      });
    }
  }
}