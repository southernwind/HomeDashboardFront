import { Component, OnInit } from "@angular/core";
import { ChartOptions, ChartDataSets } from "chart.js";
import { FinancialApiService } from "../../services/financial-api.service";
import * as moment from 'moment';
import { Asset } from '../../models/asset.model';
import * as Enumerable from 'linq';
import { Moment } from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';

@Component({
  templateUrl: "./financial.component.html",
})
export class FinancialComponent implements OnInit {
  /** 日付選択便利ボタン */
  public dateRanges = {
    "今月": [moment().startOf("month").toDate(), moment().toDate()],
    "先月": [moment().add("months", -1).startOf("month").toDate(), moment().add("months", -1).endOf("month").toDate()],
    "先々月": [moment().add("months", -2).startOf("month").toDate(), moment().add("months", -2).endOf("month").toDate()],
    "今年": [moment().startOf("year").toDate(), moment().toDate()],
    "去年": [moment().add("years", -1).startOf("year").toDate(), moment().add("years", -1).endOf("year").toDate()],
    "一昨年": [moment().add("years", -2).startOf("year").toDate(), moment().add("years", -2).endOf("year").toDate()],
  };
  /**
   * 選択中日付範囲
   *
   * @type {DateRange}
   * @memberof FinancialComponent
   */
  public selectedDateRange: DateRange = null;

  constructor() { }

  /**
   * 初期処理
   *
   * @returns {Promise<void>}
   * @memberof FinancialComponent
   */
  public async ngOnInit(): Promise<void> {
  }

  /**
   * Ng-Zorroのカレンダーの本日以降の日付を無効にする
   *
   * @param {Date} current
   * @returns {boolean}
   * @memberof FinancialComponent
   */
  public disabledDate(current: Date): boolean {
    return moment().isBefore(current);
  }

  /**
   * 日付選択変更時イベント
   *
   * @param {Date[]} result 変更後日付
   * @returns {Promise<void>}
   * @memberof FinancialComponent
   */
  public async selectedDateChange(result: Date[]): Promise<void> {
    const from = moment(result[0]);
    const to = moment(result[1]);
    this.selectedDateRange = { startDate: from, endDate: to };
  }
}
