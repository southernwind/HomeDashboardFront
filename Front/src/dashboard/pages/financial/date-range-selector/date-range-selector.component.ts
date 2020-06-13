import { Component, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';

@Component({
  selector: "date-range-selector",
  templateUrl: "./date-range-selector.component.html",
})
export class DateRangeSelectorComponent extends DashboardParentComponent {
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
   * 選択範囲
   *
   * @type {DateRange}
   * @memberof DateRangeSelectorComponent
   */
  @Input()
  public set dateRange(value: DateRange) {
    this.selectedDate = [value.startDate.toDate(), value.endDate.toDate()];
  }

  /**
   * 選択範囲
   *
   * @memberof DateRangeSelectorComponent
   */
  @Output()
  public dateRangeChange = new EventEmitter<DateRange>();

  /**
   * 選択中日付範囲
   *
   * @type {Date[]}
   * @memberof DateRangeSelectorComponent
   */
  public selectedDate: Date[];

  /**
   * Ng-Zorroのカレンダーの本日以降の日付を無効にする
   *
   * @param {Date} current
   * @returns {boolean}
   * @memberof DateRangeSelectorComponent
   */
  public disabledDate(current: Date): boolean {
    return moment().isBefore(current);
  }


  /**
   * 選択範囲変更イベント
   *
   * @memberof DateRangeSelectorComponent
   */
  public onSelectedDateChange(value: Date[]): void {
    this.dateRangeChange.emit({ startDate: moment(value[0]), endDate: moment(value[1]) });
  }
}
