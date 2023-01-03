import { Component, Input, EventEmitter, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Transaction } from '../../../../models/transaction.model';
import Enumerable from 'linq';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { HighchartsOptions, getHighChartsColor } from 'src/utils/highcharts.options';
import { TransactionCondition } from 'src/dashboard/models/condition.model';
import { Subject, combineLatestWith, map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Chart } from 'angular-highcharts';
import { PlotSunburstLevelsOptions } from 'highcharts';
import { SeriesSunburstOptions } from 'highcharts/highcharts.src';
import { getMfTransactionLargeCategoryId } from '../../utils/util';
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

  @Input()
  public set filterCondition(value: TransactionCondition) {
    if (!value) {
      return;
    }
    this.latestFilterCondition = value;
    this.filterConditionSubject.next(value);
  }
  private nowFilterCondition: TransactionCondition = new TransactionCondition();
  private latestFilterCondition: TransactionCondition = new TransactionCondition();
  private filterConditionSubject = new Subject<TransactionCondition>();
  private chartLoaded = new Subject<Highcharts.Chart>();

  /** フィルター条件 */
  @Output()
  public filterConditionChange = new EventEmitter<TransactionCondition>();

  private transactionsSubject = new Subject<Transaction[]>();

  constructor() {
    super();
    this.nowFilterCondition.month = "9999-99"
    const componentScope = this;
    this.transactionsSubject
      .pipe(combineLatestWith(this.filterConditionSubject))
      .pipe(untilDestroyed(this))
      .subscribe(([transactions, _]) => {
        if (this.nowFilterCondition.month === this.latestFilterCondition.month) {
          this.nowFilterCondition = this.latestFilterCondition;
          return;
        }
        this.nowFilterCondition = this.latestFilterCondition;
        const temp = Enumerable.from(transactions)
          .where(x => this.latestFilterCondition.month === null ? true : x.date.startsWith(this.latestFilterCondition.month))
          .where(x => -x.amount > 0);
        this.chart = new Chart({
          ...HighchartsOptions.defaultOptions,
          chart: {
            ...HighchartsOptions.defaultOptions.chart,
            events: {
              load: function () {
                componentScope.chartLoaded.next(this);
              }
            }
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
            animation: {
              duration: 200
            },
            events: {
              click: function (event) {
                var fc = new TransactionCondition();
                fc.month = componentScope.latestFilterCondition.month;
                if (event.point.options.id === "root") {
                } else if (event.point.options.parent === "root") {
                  fc.largeCategory = event.point.name;
                } else {
                  fc.largeCategory = componentScope.latestFilterCondition.largeCategory;
                  fc.middleCategory = event.point.name;
                }
                componentScope.filterConditionChange.emit(fc);
              }
            },
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
                  color: getHighChartsColor(getMfTransactionLargeCategoryId(x.key())),
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
      });

    this.filterConditionSubject.pipe(combineLatestWith(this.chartLoaded)).subscribe(([condition, chart]) => {
      const series = (chart.series[0] as any);
      if (series.idPreviousRoot === condition.largeCategory && condition.middleCategory === null) {
        var fc = new TransactionCondition();
        fc.month = componentScope.latestFilterCondition.month;
        fc.month = componentScope.latestFilterCondition.month;
        componentScope.filterConditionChange.emit(fc);
        return;
      }
      series.setRootNode(condition.largeCategory !== null ? condition.largeCategory : "root");
    });
  }
}