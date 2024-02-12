import { Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { CookieService } from 'ngx-cookie-service';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ElectricPower } from '../../../models/electric-power.model';
import { ElectricPowerApiService } from '../../../services/electric-power.service';
import { lastValueFrom } from 'rxjs';

@UntilDestroy()
@Component({
  templateUrl: "./electric-power-past.component.html"
})
export class ElectricPowerPastComponent extends DashboardParentComponent {
  /**
   * 選択中日付範囲
   *
   * @type {DateRange}
   * @memberof ElectricPowerPastComponent
   */
  public selectedDateRange: DateRange | null = null;

  /**
   * 選択中ピリオド
   *
   * @type {number}
   * @memberof ElectricPowerPastComponent
   */
  public selectedPeriod: number | null = null;

  /**
   * チャートデータ
   *
   * @type {ElectricPower[]}
   * @memberof ElectricPowerPastComponent
   */
  public chartData: ElectricPower[] = [];
  constructor(private cookieService: CookieService, private electricPowerApiService: ElectricPowerApiService) {
    super();
    this.onInit
      .pipe(untilDestroyed(this))
      .subscribe(async () => {
        if (this.selectedDateRange === null) {
          let from: Moment;
          if (this.cookieService.check("electricPowerPastStartDate")) {
            from = moment(this.cookieService.get("electricPowerPastStartDate"));
          } else {
            from = moment().add(-7, 'day').startOf("month");
          }

          let to: Moment;
          if (this.cookieService.check("electricPowerPastEndDate")) {
            to = moment(this.cookieService.get("electricPowerPastEndDate"));
          } else {
            to = moment();
          }

          this.selectedDateRange = { startDate: from, endDate: to };
          await this.selectedDateChanged();
        }
        if (this.selectedPeriod === null) {
          if (this.cookieService.check("electricPowerPastPeriod")) {
            this.selectedPeriod = Number(this.cookieService.get("electricPowerPastPeriod"));
          } else {
            this.selectedPeriod = 1800;
          }
        }
      });
  }

  public async selectedDateChanged(): Promise<void> {
    if (this.selectedPeriod === null || this.selectedDateRange === null) {
      return;
    }
    this.chartData = await lastValueFrom(this.electricPowerApiService.getElectricPowerConsumptionList(this.selectedDateRange.startDate.format("YYYY-MM-DD HH:mm:ss"), this.selectedDateRange.endDate.format("YYYY-MM-DD HH:mm:ss")).pipe(untilDestroyed(this)));
    this.cookieService.set("electricPowerPastStartDate", this.selectedDateRange.startDate.format("YYYY-MM-DD HH:mm:ss"), undefined, "/");
    this.cookieService.set("electricPowerPastEndDate", this.selectedDateRange.endDate.format("YYYY-MM-DD HH:mm:ss"), undefined, "/");
  }
  public selectedPeriodChanged(): void {
    if (this.selectedPeriod === null) {
      return;
    }
    this.cookieService.set("electricPowerPastPeriod", this.selectedPeriod.toString(), undefined, "/");
  }
}