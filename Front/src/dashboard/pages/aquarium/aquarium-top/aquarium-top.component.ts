import { Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { CookieService } from 'ngx-cookie-service';
import { Moment } from 'moment';
import * as moment from 'moment';

@UntilDestroy()
@Component({
  templateUrl: "./aquarium-top.component.html"
})
export class AquariumTopComponent extends DashboardParentComponent {
  /**
   * 選択中日付範囲
   *
   * @type {DateRange}
   * @memberof AquariumTopComponent
   */
  public selectedDateRange: DateRange = null;

  public selectedTerm: {
    value: string,
    unit: moment.unitOfTime.DurationConstructor
  } = null;

  public termCandidate: {
    value: string,
    unit: moment.unitOfTime.DurationConstructor
  }[] = [
      { value: "1", unit: "hours" },
      { value: "6", unit: "hours" },
      { value: "12", unit: "hours" },
      { value: "1", unit: "days" },
      { value: "3", unit: "days" },
      { value: "7", unit: "days" },
      { value: "14", unit: "days" },
      { value: "1", unit: "month" },
      { value: "6", unit: "month" },
      { value: "1", unit: "year" },
      { value: "3", unit: "year" },
      { value: "10", unit: "year" },
    ]

  /**
   * 選択中ピリオド
   *
   * @type {number}
   * @memberof AquariumTopComponent
   */
  public selectedPeriod: number = null;

  constructor(private cookieService: CookieService) {
    super();
    this.onInit
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (this.selectedTerm === null) {
          const term = {
            value: null,
            unit: null
          };
          if (this.cookieService.check("aquaTermValue")) {
            term.value = this.cookieService.get("aquaTermValue");
          } else {
            term.value = "2";
          }
          if (this.cookieService.check("aquaTermUnit")) {
            term.unit = this.cookieService.get("aquaTermUnit");
          } else {
            term.unit = "days";
          }

          this.selectedTerm = this.termCandidate.find(x => x.value == term.value && x.unit == term.unit);
          this.selectedTermChanged();
        }
        if (this.selectedPeriod === null) {
          if (this.cookieService.check("aquaPeriod")) {
            this.selectedPeriod = Number(this.cookieService.get("aquaPeriod"));
          } else {
            this.selectedPeriod = 1800;
          }
        }
      });
  }

  public selectedTermChanged(): void {
    this.cookieService.set("aquaTermValue", this.selectedTerm?.value);
    this.cookieService.set("aquaTermUnit", this.selectedTerm?.unit);
    this.selectedDateRange = {
      startDate: moment().add(`-${this.selectedTerm.value}`, this.selectedTerm.unit),
      endDate: moment()
    }
  }
  public selectedPeriodChanged(): void {
    this.cookieService.set("aquaPeriod", this.selectedPeriod.toString());
  }
}