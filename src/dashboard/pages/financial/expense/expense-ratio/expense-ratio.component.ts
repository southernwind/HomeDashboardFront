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
import { PlotSunburstLevelsOptions } from 'highcharts';
import { SeriesSunburstOptions } from 'highcharts/highcharts.src';

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
          .where(x => -x.amount > 0);
        this.chart = new Chart({
          ...HighchartsOptions.defaultOptions,
          chart: {
            ...HighchartsOptions.defaultOptions.chart
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
            }
          },
          tooltip: {
            ...HighchartsOptions.defaultOptions.tooltip,
            formatter: function () {
              const parentValue = (this.series.points.find(x => (x as any).id === ((this.series as any).rootNode || 'root')) as any).value;
              return `${this.key}<br>${Highcharts.numberFormat((this.point as any).value, 0, '', ',')}円<br>(${Highcharts.numberFormat((this.point as any).value / parentValue * 100, 2, '.', ',')}%)`;
            },
          },
          series: [{
            name: 'カテゴリ',
            type: "sunburst",
            data: Enumerable.from([{
              id: 'root',
              parent: '',
              name: 'ALL',
              value: temp.sum(x => -x.amount)
            }]).concat(temp
              .groupBy(x => x.largeCategory).select(x => {
                return {
                  id: x.key(),
                  parent: 'root',
                  name: x.key(),
                  value: x.sum(y => -y.amount)
                }
              }).orderByDescending(x => x.value)).concat(
                temp.groupBy(x => `${x.largeCategory}_${x.middleCategory}`).select(x => {
                  return {
                    id: x.key(),
                    parent: x.first().largeCategory,
                    name: x.first().middleCategory,
                    value: x.sum(y => -y.amount)
                  }
                })
              ).toArray(),
            allowDrillToNode: true,
            cursor: 'pointer',
            dataLabels: {
              formatter: function () {
                const parentValue = (this.series.points.find(x => (x as any).id === ((this.series as any).rootNode || 'root')) as any).value;
                return `${this.key}<br>${Highcharts.numberFormat((this.point as any).value / parentValue * 100, 2, '.', ',')}%`;
              },
              filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 16
              }
            },
            levels: [{
              level: 1,
              levelIsConstant: false,
              dataLabels: {
                filter: {
                  property: 'outerArcLength',
                }
              }
            } as PlotSunburstLevelsOptions, {
              level: 2,
              colorByPoint: true,
            } as PlotSunburstLevelsOptions,
            {
              level: 3,
              colorVariation: {
                key: 'brightness',
                to: 0.3
              }
            } as PlotSunburstLevelsOptions]
          } as SeriesSunburstOptions] as any
        });
        const a = 1 + 1;
      });
  }
}