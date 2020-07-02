import { Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { CookieService } from 'ngx-cookie-service';
import { Moment } from 'moment';
import * as moment from 'moment';

@UntilDestroy()
@Component({
  templateUrl: "./aquarium-past.component.html"
})
export class AquariumPastComponent extends DashboardParentComponent {
  /**
   * 選択中日付範囲
   *
   * @type {DateRange}
   * @memberof AquariumPastComponent
   */
  public selectedDateRange: DateRange = null;

  /**
   * 選択中ピリオド
   *
   * @type {number}
   * @memberof AquariumPastComponent
   */
  public selectedPeriod: number = null;

  constructor(private cookieService: CookieService) {
    super();
    this.onInit
      .pipe(untilDestroyed(this))
      .subscribe(async () => {
        if (this.selectedDateRange === null) {
          let from: Moment;
          if (this.cookieService.check("aquaStartDate")) {
            from = moment(this.cookieService.get("aquaStartDate"));
          } else {
            from = moment().add(-7, 'day').startOf("month");
          }

          let to: Moment;
          if (this.cookieService.check("aquaEndDate")) {
            to = moment(this.cookieService.get("aquaEndDate"));
          } else {
            to = moment();
          }

          this.selectedDateRange = { startDate: from, endDate: to };
          await this.selectedDateChanged();
        }
        if (this.selectedPeriod === null) {
          if (this.cookieService.check("aquaPastPeriod")) {
            this.selectedPeriod = Number(this.cookieService.get("aquaPastPeriod"));
          } else {
            this.selectedPeriod = 1800;
          }
        }
      });
  }

  public selectedDateChanged(): void {
    this.cookieService.set("aquaStartDate", this.selectedDateRange.startDate.format("YYYY-MM-DD HH:mm:ss"));
    this.cookieService.set("aquaEndDate", this.selectedDateRange.endDate.format("YYYY-MM-DD HH:mm:ss"));
  }
  public selectedPeriodChanged(): void {
    this.cookieService.set("aquaPastPeriod", this.selectedPeriod.toString());
  }
}