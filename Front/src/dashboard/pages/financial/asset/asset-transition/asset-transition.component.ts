import { Component, OnInit, Input } from "@angular/core";
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
export class AssetTransitionComponent extends DashboardParentComponent implements OnInit {
  /** 資産推移生データ */
  public assets: Asset[];
  public Highcharts: typeof Highcharts = Highcharts;

  /** 資産推移チャートオプション */
  public assetsChartOptions: Highcharts.Options;

  /** チャートオプション */
  private chartOptions: Highcharts.Options = {
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
        day: '%d',
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
    }
  };

  constructor(private financialApiService: FinancialApiService) {
    super();
  }

  /**
   * 初期処理
   *
   * @returns {Promise<void>}
   * @memberof AssetTransitionComponent
   */
  public async ngOnInit(): Promise<void> {
    const to = moment();
    const from = moment().add('month', -6).startOf("month");
    await this.updateAssetsChart(from, to);
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
    this.assetsChartOptions = {
      ...this.chartOptions,
      series: temp
        .groupBy(x => x.institution)
        .orderBy(x => x.sum(a => Math.abs(a.amount)))
        .select(x => {
          return {
            type: 'area',
            name: `${x.key()}`,
            pointInterval: 24 * 3600 * 1000,
            pointStart: Date.UTC(moment(dates.first()).year(), moment(dates.first()).month(), moment(dates.first()).day()),
            stack: x.sum(x => x.amount) > 0 ? 0 : 1,
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
            pointStart: Date.UTC(moment(dates.first()).year(), moment(dates.first()).month(), moment(dates.first()).day()),
            data: temp.groupBy(x => x.date).orderBy(x => x.key()).select(x => x.sum(a => a.amount)).toArray()
          } as Highcharts.SeriesLineOptions
        ])
    }
    const a = this.assetsChartOptions;
  }
}
