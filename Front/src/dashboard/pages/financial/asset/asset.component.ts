import { Component } from '@angular/core';
import * as moment from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { CookieService } from 'ngx-cookie-service';
import { Moment } from 'moment';

@Component({
  templateUrl: "./asset.component.html",
})
export class AssetComponent extends DashboardParentComponent {
  /**
   * 選択中日付範囲
   *
   * @type {DateRange}
   * @memberof AssetComponent
   */
  public selectedDateRange: DateRange = null;

  constructor(private cookieService: CookieService) {
    super();
  }

  /**
   * 初期処理
   *
   * @returns {Promise<void>}
   * @memberof AssetComponent
   */
  public async ngOnInit(): Promise<void> {
    if (this.selectedDateRange === null) {
      let from: Moment;
      if (this.cookieService.check("startDate")) {
        from = moment(this.cookieService.get("startDate"));
      } else {
        from = moment().add(-6, 'month').startOf("month");
      }

      let to: Moment;
      if (this.cookieService.check("endDate")) {
        const endDateString = this.cookieService.get("endDate");
        if (endDateString === "today") {
          to = moment();
        } else {
          to = moment(this.cookieService.get("endDate"));
        }
      } else {
        to = moment();
      }

      this.selectedDateRange = { startDate: from, endDate: to };
    }
  }

  public selectedDateChanged(): void {
    this.cookieService.set("startDate", this.selectedDateRange.startDate.format("YYYY-MM-DD"));
    this.cookieService.set("endDate", this.selectedDateRange.endDate.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") ? "today" : this.selectedDateRange.endDate.format("YYYY-MM-DD"));
  }
}
