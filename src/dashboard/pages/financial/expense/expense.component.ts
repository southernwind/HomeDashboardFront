import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { FinancialApiService } from 'src/dashboard/services/financial-api.service';
import { Transaction } from 'src/dashboard/models/transaction.model';
import { TransactionCondition } from 'src/dashboard/models/condition.model';
import { CookieService } from 'ngx-cookie-service';
import { Moment } from 'moment';

@Component({
  templateUrl: "./expense.component.html",
  styleUrls: ["./expense.component.scss"]
})
export class ExpenseComponent extends DashboardParentComponent {
  /**
   * 選択中日付範囲
   *
   * @type {DateRange}
   * @memberof AssetComponent
   */
  public selectedDateRange: DateRange = null;

  /** 取引履歴生データ */
  public transactions: Transaction[];

  /** フィルター条件 */
  public filterCondition: TransactionCondition;

  constructor(private financialApiService: FinancialApiService,
    private cookieService: CookieService) {
    super();
  }

  /**
   * 初期処理
   *
   * @returns {Promise<void>}
   * @memberof ExpenseComponent
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
      await this.selectedDateChanged();
    }
    this.filterCondition = new TransactionCondition();
  }

  public async selectedDateChanged(): Promise<void> {
    this.transactions = await this.financialApiService.GetTransactions(this.selectedDateRange.startDate, this.selectedDateRange.endDate).toPromise();
    this.cookieService.set("startDate", this.selectedDateRange.startDate.format("YYYY-MM-DD"), undefined, "/");
    this.cookieService.set("endDate", this.selectedDateRange.endDate.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") ? "today" : this.selectedDateRange.endDate.format("YYYY-MM-DD"), undefined, "/");
  }
}
