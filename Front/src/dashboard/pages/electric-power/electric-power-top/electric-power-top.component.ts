import { ChangeDetectorRef, Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ElectricPowerApiService } from 'src/dashboard/services/electric-power.service';

@UntilDestroy()
@Component({
  templateUrl: "./electric-power-top.component.html"
})
export class ElectricPowerTopComponent extends DashboardParentComponent {
  public currentValue: number;
  public currentTime: string;

  constructor(private electricPowerApiService: ElectricPowerApiService, private changeDetector: ChangeDetectorRef) {
    super();
    this.onInit
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.electricPowerApiService.electricPowerAsObservable().pipe(untilDestroyed(this)).subscribe(x => {
          this.currentTime = moment(x.timeStamp).format("YYYY-MM-DD HH:mm:ss");
          this.currentValue = x.electricPower;
          this.changeDetector.detectChanges();
        });
      });
  }
}