import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { FinancialApiService } from 'src/dashboard/services/financial-api.service';
import { Transaction } from 'src/dashboard/models/transaction.model';

@Component({
  templateUrl: "./expense.component.html",
})
export class ExpenseComponent extends DashboardParentComponent {
  /**
   * 選択中日付範囲
   *
   * @type {DateRange}
   * @memberof AssetComponent
   */
  public selectedDateRange: DateRange;

  /** 取引履歴生データ */
  @Input()
  public transactions: Transaction[];

  constructor(private financialApiService: FinancialApiService) {
    super();
  }

  /**
   * 初期処理
   *
   * @returns {Promise<void>}
   * @memberof AssetComponent
   */
  public async ngOnInit(): Promise<void> {
    const to = moment();
    const from = moment().add(-6, 'month').startOf("month");
    this.selectedDateRange = { startDate: from, endDate: to };
    await this.selectedDateChanged();
  }

  public async selectedDateChanged(): Promise<void> {
    this.transactions = await this.financialApiService.GetTransactions(this.selectedDateRange.startDate, this.selectedDateRange.endDate).toPromise();
  }
}
