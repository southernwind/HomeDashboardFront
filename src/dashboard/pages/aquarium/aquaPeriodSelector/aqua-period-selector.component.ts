import { Component, Output, EventEmitter, Input } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';

@Component({
  selector: "aqua-period-selector",
  templateUrl: "./aqua-period-selector.component.html",
  styleUrls: ["aqua-period-selector.component.scss"]
})
export class AquaPeriodSelectorComponent extends DashboardParentComponent {
  public selectedPeriod: number | null = null;

  public candidate = [
    { label: "10秒", value: 10 },
    { label: "1分", value: 60 },
    { label: "3分", value: 180 },
    { label: "5分", value: 300 },
    { label: "10分", value: 600 },
    { label: "15分", value: 900 },
    { label: "30分", value: 1800 },
    { label: "1時間", value: 3600 },
    { label: "3時間", value: 10800 },
    { label: "6時間", value: 21600 },
    { label: "12時間", value: 43200 },
    { label: "24時間", value: 86400 },
    { label: "3日", value: 259200 },
    { label: "7日", value: 604800 },
    { label: "30日", value: 2592000 },
    { label: "180日", value: 15552000 },
    { label: "365日", value: 31536000 },
  ];

  /**
   * 選択ピリオド
   *
   * @type {number}
   * @memberof AquaPeriodSelectorComponent
   */
  @Input()
  public set period(value: number) {
    if (!value) {
      return;
    }
    this.selectedPeriod = value;
  }

  /**
   * 選択ピリオド
   *
   * @memberof AquaPeriodSelectorComponent
   */
  @Output()
  public periodChange = new EventEmitter<number>();

  public selectedPeriodChange(): void {
    if (this.selectedPeriod === null) {
      return;
    }
    this.periodChange.emit(this.selectedPeriod);
  }
}
