import { ChangeDetectorRef, Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ElectricPowerApiService } from 'src/dashboard/services/electric-power.service';
import { ElectricPower } from '../../../models/electric-power.model';
import { Observable, Subject } from 'rxjs';
import { environment } from "../../../../environments/environment";

@UntilDestroy()
@Component({
  selector: "electric-power-current",
  templateUrl: "./electric-power-current.component.html"
})
export class ElectricPowerCurrentComponent extends DashboardParentComponent {
  public currentValue: number | undefined = undefined;
  public currentTime: string | undefined = undefined;
  public chartDataAsObservable: Observable<ElectricPower>;
  public get kwhPrice(): number {
    return environment.kwhPrice;
  };
  constructor(private electricPowerApiService: ElectricPowerApiService, private changeDetector: ChangeDetectorRef) {
    super();
    const chartDataSubject = new Subject<ElectricPower>();
    this.chartDataAsObservable = chartDataSubject.asObservable();
    this.onInit
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.electricPowerApiService.electricPowerAsObservable().pipe(untilDestroyed(this)).subscribe(x => {
          this.currentTime = moment(x.timeStamp).format("YYYY-MM-DD HH:mm:ss");
          this.currentValue = x.electricPower;
          this.changeDetector.detectChanges();
          chartDataSubject.next(x);
        });
      });
  }
}