import { Component } from '@angular/core';
import * as moment from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';

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
  public selectedDateRange: DateRange;

  /**
   * 初期処理
   *
   * @returns {Promise<void>}
   * @memberof FinancialTopComponent
   */
  public async ngOnInit(): Promise<void> {
    const to = moment();
    const from = moment().add('month', -6).startOf("month");
    this.selectedDateRange = { startDate: from, endDate: to };
  }

  public chartReload(): void {
    this.selectedDateRange = this.selectedDateRange;
  }
}
