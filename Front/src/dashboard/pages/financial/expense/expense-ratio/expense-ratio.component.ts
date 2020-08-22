import { Component, Input, EventEmitter, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Transaction } from '../../../../models/transaction.model';
import * as Enumerable from 'linq';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { HighchartsOptions } from 'src/utils/highcharts.options';
import { Condition } from 'src/dashboard/models/condition.model';
import { Subject, combineLatest } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Chart } from 'angular-highcharts';

@UntilDestroy()
@Component({
  selector: "app-expense-ratio-chart",
  templateUrl: "./expense-ratio.component.html",
})
export class ExpenseRatioComponent extends DashboardParentComponent {
  public chart: Chart;

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
          .where(x => -x.amount > 0)
          .groupBy(x => x.largeCategory)
          .orderByDescending(x => x.sum(a => a.amount));

        this.chart = new Chart({
          ...HighchartsOptions.defaultOptions,
          chart: {
            ...HighchartsOptions.defaultOptions.chart,
            type: 'pie'
          },
          title: {
            ...HighchartsOptions.defaultOptions.title,
            text: "支出割合",
          },
          plotOptions: {
            ...HighchartsOptions.defaultOptions.plotOptions,
            pie: {
              ...HighchartsOptions.defaultOptions.plotOptions.pie,
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
                    switch (e.point.series.name) {
                      case "カテゴリ":
                        componentScope.filterConditionChange.emit({
                          condition: x => x.largeCategory == e.point.name
                        });
                        break;
                      case "サブカテゴリ":
                        componentScope.filterConditionChange.emit({
                          condition: x => x.middleCategory == e.point.name
                        });
                        break;
                    }
                  }
                }
              }
            }
          },
          tooltip: {
            ...HighchartsOptions.defaultOptions.tooltip,
            formatter: function () {
              return `${this.key}<br>${Highcharts.numberFormat(this.y, 0, '', ',')}円<br>(${this.percentage.toFixed(3)}%)`;
            }
          },
          legend: {
            ...HighchartsOptions.defaultOptions.legend,
            labelFormatter: function () {
              return `${this.name}<br/><span style="font-size:0.6rem">(${Highcharts.numberFormat(this.y, 0, '', ',')}円)</span>`;
            } as Highcharts.FormatterCallbackFunction<Highcharts.Point>,
            enabled: true,
            align: "right",
            layout: "vertical",
            verticalAlign: "top"
          },
          series: [{
            name: 'カテゴリ',
            data: temp
              .select((x, index) => {
                return {
                  name: x.key(),
                  y: x.sum(a => -a.amount),
                  color: Highcharts.getOptions().colors[index % Highcharts.getOptions().colors.length],
                };
              }).reverse().toArray()
            ,
            size: '60%',
            showInLegend: true,
            dataLabels: {
              enabled: false
            }
          } as any, {
            name: 'サブカテゴリ',
            data: temp
              .select(x => { return { cat: x.key(), ins: x.groupBy(a => a.middleCategory) } })
              .select((x, index) => {
                return x.ins.select((i, index2) => {
                  return {
                    name: i.key(),
                    y: i.sum(a => -a.amount),
                    color: Highcharts.color(Highcharts.getOptions().colors[index % Highcharts.getOptions().colors.length]).brighten(0.2 - (index2 / x.ins.count()) / 5).get()
                  }
                })
              }).selectMany(x => x).reverse().toArray(),
            size: '100%',
            innerSize: '60%',
            id: 'middle',
          } as any]
        });
      });
  }
}