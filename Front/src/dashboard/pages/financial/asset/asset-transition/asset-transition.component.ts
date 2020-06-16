import { Component, Input, AfterViewChecked } from "@angular/core";
import * as Highcharts from 'highcharts';
import { FinancialApiService } from "../../../../services/financial-api.service";
import * as moment from 'moment';
import { Asset } from '../../../../models/asset.model';
import * as Enumerable from 'linq';
import { Moment } from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { HighchartsOptions } from 'src/utils/highcharts.options';

@Component({
  selector: "app-asset-transition-chart",
  templateUrl: "./asset-transition.component.html",
})
export class AssetTransitionComponent extends DashboardParentComponent implements AfterViewChecked {
  /** 資産推移生データ */
  public assets: Asset[];
  public Highcharts: typeof Highcharts = Highcharts;

  /** 資産推移チャートオプション */
  public assetsChartOptions: Highcharts.Options;
  /** chartインスタンス */
  private chart: Highcharts.Chart;

  constructor(private financialApiService: FinancialApiService) {
    super();
  }

  /**
   * 初期処理
   *
   * @returns {Promise<void>}
   * @memberof AssetTransitionComponent
   */
  public async setChartInstance(chart: Highcharts.Chart): Promise<void> {
    this.chart = chart;
    this.assetsChartOptions = {
      ...HighchartsOptions.defaultOptions,
      chart: {
        ...HighchartsOptions.defaultOptions.chart,
        type: "area",
        zoomType: "x",
      },
      title: {
        ...HighchartsOptions.defaultOptions.title,
        text: "資産推移",
      },
      xAxis: {
        ...HighchartsOptions.defaultOptions.xAxis,
        type: 'datetime',
        title: null,
        dateTimeLabelFormats: {
          year: '%Y',
          month: '%Y/%m',
          week: '%m/%d',
          day: '%m/%d',
        }
      },
      yAxis: {
        ...HighchartsOptions.defaultOptions.yAxis,
        title: null,
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
      tooltip: {
        formatter: function () {
          return `${Highcharts.dateFormat("%Y/%m/%d", this.key)}<br>${this.series.name} : ${Highcharts.numberFormat(this.y, 0, '', ',')}円`
        }
      },
      plotOptions: {
        ...HighchartsOptions.defaultOptions.plotOptions,
        series: {
          ...HighchartsOptions.defaultOptions.plotOptions.series,
          dataLabels: {
            ...HighchartsOptions.defaultOptions.plotOptions.series.dataLabels,
            shape: 'callout',
            backgroundColor: '#0007',
            formatter: function () {
              return `最終値:${Highcharts.numberFormat(this.y, 0, '', ',')}円`;
            }
          }
        }
      },
      legend: {
        ...HighchartsOptions.defaultOptions.legend,
        labelFormatter: function () {
          const values = ((this as any).yData as number[]);
          const lastValue = values[values.length - 1];
          if (lastValue != null && lastValue != 0) {
            return `${this.name}<br/><span style="font-size:0.6rem">(${Highcharts.numberFormat(lastValue, 0, '', ',')}円)</span>`;
          } else {
            return `${this.name}<br/><span style="font-size:0.6rem">( - )</span>`;
          }
        }
      }
    };
    const to = moment();
    const from = moment().add(-6, 'month').startOf("month");
    await this.updateAssetsChart(from, to);
  }

  public ngAfterViewChecked(): void {
    this.chart?.reflow();
  }

  @Input()
  public set dateRange(value: DateRange) {
    this.updateAssetsChart(value.startDate, value.endDate);
  }

  /**
   * 資産推移チャート更新処理
   *
   * @private
   * @param {Moment} from チャート開始日
   * @param {Moment} to チャート終了日
   * @returns {Promise<void>}
   * @memberof AssetTransitionComponent
   */
  private async updateAssetsChart(from: Moment, to: Moment): Promise<void> {
    this.assets = await this.financialApiService.GetAssets(from, to).toPromise();
    const temp = Enumerable
      .from(this.assets)
      .select(x => {
        return {
          ...x,
          date: moment(x.date).format("YYYY-MM-DD")
        }
      });
    const dates = temp.groupBy(x => x.date).select(x => x.first().date);
    const datesCount = dates.count();
    this.chart.update({
      ...this.assetsChartOptions,
      series: temp
        .groupBy(x => x.institution)
        .orderBy(x => Math.abs(x.lastOrDefault().amount))
        .select((x, index) => {
          return {
            type: 'area',
            name: `${x.key()}`,
            pointInterval: 24 * 3600 * 1000,
            pointStart: moment(dates.first()).valueOf(),
            stack: x.sum(x => x.amount) > 0 ? 0 : 1,
            legendIndex: -index,
            data:
              dates.groupJoin(x.groupBy(a => a.date).select(x => {
                return {
                  name: x.key(),
                  data: x?.sum(ax => ax.amount)
                }
              }
              ), d => d, a => a.name, (_, a) => a?.firstOrDefault()?.data ?? null).toArray()
          } as Highcharts.SeriesAreaOptions | Highcharts.SeriesLineOptions
        })
        .toArray()
        .concat([
          {
            type: 'line',
            name: `計`,
            zIndex: 10000,
            pointInterval: 24 * 3600 * 1000,
            pointStart: moment(dates.first()).valueOf(),
            legendIndex: -1000000,
            data: temp
              .groupBy(x => x.date)
              .orderBy(x => x.key())
              .select(x => x.sum(a => a.amount))
              .select((x, index) => {
                return index != datesCount - 1 ? x : {
                  y: x,
                  dataLabels: {
                    enabled: true,
                    align: 'right'
                  }
                }
              }).toArray(),
          } as Highcharts.SeriesLineOptions
        ])
    }, true, true);
  }
}
