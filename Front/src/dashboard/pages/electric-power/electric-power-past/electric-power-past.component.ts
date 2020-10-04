import { Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { CookieService } from 'ngx-cookie-service';
import { Moment } from 'moment';
import * as moment from 'moment';

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
  public selectedDateRange: DateRange = null;

  /**
   * 選択中ピリオド
   *
   * @type {number}
   * @memberof ElectricPowerPastComponent
   */
  public selectedPeriod: number = null;

  constructor(private cookieService: CookieService) {
    super();
    this.onInit
      .pipe(untilDestroyed(this))
      .subscribe(async () => {
        if (this.selectedDateRange === null) {
          let from: Moment;
          if (this.cookieService.check("electricPowerStartDate")) {
            from = moment(this.cookieService.get("electricPowerStartDate"));
          } else {
            from = moment().add(-7, 'day').startOf("month");
          }

          let to: Moment;
          if (this.cookieService.check("electricPowerEndDate")) {
            to = moment(this.cookieService.get("electricPowerEndDate"));
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

  public selectedDateChanged(): void {
    this.cookieService.set("electricPowerStartDate", this.selectedDateRange.startDate.format("YYYY-MM-DD HH:mm:ss"), undefined, "/");
    this.cookieService.set("electricPowerEndDate", this.selectedDateRange.endDate.format("YYYY-MM-DD HH:mm:ss"), undefined, "/");
  }
  public selectedPeriodChanged(): void {
    this.cookieService.set("electricPowerPastPeriod", this.selectedPeriod.toString(), undefined, "/");
  }
}