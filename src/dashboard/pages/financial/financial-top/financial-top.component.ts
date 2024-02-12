import { Component } from '@angular/core';
import * as moment from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { Moment } from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  templateUrl: "./financial-top.component.html",
})
export class FinancialTopComponent extends DashboardParentComponent {
  /**
   * 選択中日付範囲
   *
   * @type {DateRange}
   * @memberof FinancialTopComponent
   */
  public selectedDateRange: DateRange | null = null;

  constructor(private cookieService: CookieService) {
    super();
    this.onInit.pipe(untilDestroyed(this)).subscribe(async () => {
      if (this.selectedDateRange === null) {
        let from: Moment;
        if (this.cookieService.check("startDateForUpdate")) {
          from = moment(this.cookieService.get("startDateForUpdate"));
        } else {
          from = moment().add(-6, 'month').startOf("month");
        }

        let to: Moment;
        if (this.cookieService.check("endDateForUpdate")) {
          const endDateString = this.cookieService.get("endDateForUpdate");
          if (endDateString === "today") {
            to = moment();
          } else {
            to = moment(this.cookieService.get("endDateForUpdate"));
          }
        } else {
          to = moment();
        }

        this.selectedDateRange = { startDate: from, endDate: to };
      }
    });
  }

  public selectedDateChanged(): void {
    if (this.selectedDateRange === null) {
      return;
    }
    this.cookieService.set("startDateForUpdate", this.selectedDateRange.startDate.format("YYYY-MM-DD"), undefined, "/");
    this.cookieService.set("endDateForUpdate", this.selectedDateRange.endDate.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") ? "today" : this.selectedDateRange.endDate.format("YYYY-MM-DD"), undefined, "/");
  }
}
