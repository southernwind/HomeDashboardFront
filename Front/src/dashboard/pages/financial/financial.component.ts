import { Component, OnInit } from "@angular/core";
import { FinancialApiService } from "../../services/financial-api.service";
import * as moment from 'moment';
import { Asset } from '../../models/asset.model';
import * as Enumerable from 'linq';
import { Moment } from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';

@Component({
  templateUrl: "./financial.component.html",
})
export class FinancialComponent extends DashboardParentComponent implements OnInit {
  /**
   * 選択中日付範囲
   *
   * @type {DateRange}
   * @memberof FinancialComponent
   */
  public selectedDateRange: DateRange;

  /**
   * 初期処理
   *
   * @returns {Promise<void>}
   * @memberof FinancialComponent
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
