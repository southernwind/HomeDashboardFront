import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { Transaction } from '../../../../models/transaction.model';
import * as Enumerable from 'linq';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { HighchartsOptions } from 'src/utils/highcharts.options';
import { Condition } from 'src/dashboard/models/condition.model';

@Component({
  selector: "app-income-transition-chart",
  templateUrl: "./income-transition.component.html",
})
export class IncomeTransitionComponent extends DashboardParentComponent implements OnInit {
  /** 取引履歴生データ */
  @Input()
  public set transactions(value: Transaction[]) {
    this.updateIncomesChart(value);
  }

  /** フィルター条件 */
  @Output()
  public filterConditionChange = new EventEmitter<Condition<Transaction>>();

  public Highcharts: typeof Highcharts = Highcharts;
  /** 支出推移チャートオプション */
  public incomesChartOptions: Highcharts.Options;

  /** チャートオプション */
  private chartOptions: Highcharts.Options = {};

  public ngOnInit(): void {
    const componentScope = this;
    this.chartOptions = {
      ...HighchartsOptions.defaultOptions,
      chart: {
        ...HighchartsOptions.defaultOptions.chart,
        type: "column",
        zoomType: "x"
      },
      title: {
        ...HighchartsOptions.defaultOptions.title,
        text: "収入推移",
      },
      xAxis: {
        ...HighchartsOptions.defaultOptions.xAxis,
        type: 'datetime',
        title: null,
        dateTimeLabelFormats: {
          month: '%Y/%m',
        }
      },
      yAxis: {
        ...HighchartsOptions.defaultOptions.yAxis,
        title: null,
        stackLabels: {
          enabled: true,
          formatter: function () {
            return `${Highcharts.numberFormat(this.total, 0, '', ',')}円`;
          }
        },
        labels: {
          ...(HighchartsOptions.defaultOptions.yAxis as Highcharts.YAxisOptions).labels,
          formatter: function () {
            if (this.value == 0) {
              return `${this.value}円`;
            } else if (Math.abs(this.value) >= 100000000) {
              return `${this.value / 100000000} 万円`
            } else {
              return `${this.value / 10000} 万円`
            }
          }
        }
      },
      legend: {
        ...HighchartsOptions.defaultOptions.legend,
        labelFormatter: function () {
          return `${this.name}<br/><span style="font-size:0.6rem">(${Highcharts.numberFormat(Enumerable.from((this as any).yData).sum(), 0, '', ',')}円)</span>`;
        }
      },
      plotOptions: {
        ...HighchartsOptions.defaultOptions.plotOptions,
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: false
          }
        },
        series: {
          ...HighchartsOptions.defaultOptions.plotOptions?.series,
          point: {
            ...HighchartsOptions.defaultOptions.plotOptions?.series?.point,
            events: {
              ...HighchartsOptions.defaultOptions.plotOptions?.series?.point?.events,
              click: function (e) {
                const month = moment(this.category).format("YYYY-MM");
                componentScope.filterConditionChange.emit({
                  condition: x => x.date.startsWith(month) && x.middleCategory == e.point.series.name
                });
              }
            }
          }
        }
      },
      tooltip: {
        formatter: function () {
          return `${moment(this.x).format("YYYY年MM月")}<br>${this.series.name} : ${Highcharts.numberFormat(this.y, 0, '', ',')}円`
        }
      }
    }
  }

  /**
   * 収入推移チャート更新処理
   *
   * @private
   * @param {Moment} from チャート開始日
   * @param {Moment} to チャート終了日
   * @returns {Promise<void>}
   * @memberof IncomeTransitionComponent
   */
  private async updateIncomesChart(transactions: Transaction[]): Promise<void> {
    const temp = Enumerable
      .from(transactions)
      .where(x => x.amount > 0)
      .select(x => {
        return {
          ...x,
          amount: x.amount,
          date: moment(x.date).format("YYYY-MM")
        }
      });
    const months = temp.groupBy(x => x.date).select(x => x.first().date);
    this.incomesChartOptions = {
      ...this.chartOptions,
      series: temp
        .groupBy(x => x.middleCategory)
        .orderByDescending(x => x.sum(a => a.amount))
        .select((x, index) => {
          return {
            type: 'column',
            name: `${x.key()}`,
            legendIndex: index,
            data:
              months.groupJoin(x.groupBy(a => a.date).select(x => {
                return {
                  month: x.key(),
                  data: x?.sum(ax => ax.amount),
                }
              }
              ), month => month, a => a.month, (month, a) => [moment(`${month}-01`).valueOf(), a?.firstOrDefault()?.data ?? null]).toArray()
          } as Highcharts.SeriesColumnOptions
        }).toArray()
    }
  }
}