import { Component, Input, EventEmitter, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Transaction } from '../../../../models/transaction.model';
import Enumerable from 'linq';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { HighchartsOptions } from 'src/utils/highcharts.options';
import { Condition } from 'src/dashboard/models/condition.model';
import { Subject } from 'rxjs';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Chart } from 'angular-highcharts';

@UntilDestroy()
@Component({
  selector: "app-income-ratio-chart",
  templateUrl: "./income-ratio.component.html",
})
export class IncomeRatioComponent extends DashboardParentComponent {
  public chart: Chart | undefined = undefined;
  /** 取引履歴生データ */
  @Input()
  public set transactions(value: Transaction[]) {
    if (!value) {
      return;
    }
    this.transactionsSubject.next(value);
  }

  /** フィルター条件 */
  @Output()
  public filterConditionChange = new EventEmitter<Condition<Transaction>>();

  private transactionsSubject = new Subject<Transaction[]>();

  constructor() {
    super();
    const componentScope = this;
    this.transactionsSubject
      .pipe(untilDestroyed(this))
      .subscribe(transactions => {
        const temp = Enumerable.from(transactions)
          .where(x => x.amount > 0)
          .groupBy(x => x.middleCategory)
          .orderByDescending(x => x.sum(a => a.amount));

        this.chart = new Chart({
          ...HighchartsOptions.defaultOptions,
          chart: {
            ...HighchartsOptions.defaultOptions.chart,
            type: 'pie'
          },
          title: {
            ...HighchartsOptions.defaultOptions.title,
            text: "収入割合",
          },
          plotOptions: {
            ...HighchartsOptions.defaultOptions.plotOptions,
            pie: {
              ...HighchartsOptions.defaultOptions.plotOptions?.pie,
              shadow: false,
              center: ['50%', '50%']
            },
            series: {
              ...HighchartsOptions.defaultOptions.plotOptions?.series,
              point: {
                ...HighchartsOptions.defaultOptions.plotOptions?.series?.point,
                events: {
                  ...HighchartsOptions.defaultOptions.plotOptions?.series?.point?.events,
                  click: function (e) {
                    componentScope.filterConditionChange.emit({
                      condition: x => x.middleCategory == e.point.name
                    });
                  }
                }
              }
            }
          },
          tooltip: {
            ...HighchartsOptions.defaultOptions.tooltip,
            formatter: function () {
              return `${this.key}<br>${Highcharts.numberFormat(this.y ?? 0, 0, '', ',')}円<br>(${this.percentage.toFixed(3)}%`;
            }
          },
          legend: {
            ...HighchartsOptions.defaultOptions.legend,
            labelFormatter: function () {
              if (this instanceof Highcharts.Point) {
                return `${this.name}<br/><span style="font-size:0.6rem">(${Highcharts.numberFormat(this.y ?? 0, 0, '', ',')}円)</span>`;
              }
            } as Highcharts.FormatterCallbackFunction<Highcharts.Point | Highcharts.Series>,
            enabled: true,
            align: "right",
            layout: "vertical",
            verticalAlign: "top"
          },
          series: [{
            name: 'サブカテゴリ',
            data: temp
              .select((x, index) => {
                return {
                  name: x.key(),
                  legendIndex: index,
                  y: x.sum(a => a.amount)
                }
              }).toArray(),
            size: '100%',
            showInLegend: true,
            dataLabels: {
              enabled: true
            }
          } as any]
        });
      });
  }
}