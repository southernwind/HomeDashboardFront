import { Component, OnInit, Input } from "@angular/core";
import { ChartOptions, ChartDataSets } from "chart.js";
import { FinancialApiService } from "../../../services/financial-api.service";
import * as moment from 'moment';
import { Asset } from '../../../models/asset.model';
import * as Enumerable from 'linq';
import { Moment } from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';

@Component({
  selector: "app-assets-chart",
  templateUrl: "./assets.component.html",
})
export class AssetsComponent implements OnInit {
  /** 資産推移生データ */
  public assets: Asset[];
  /** 資産推移データセット */
  public assetsChartData: ChartDataSets[];
  /** 資産推移チャートオプション */
  public assetsChartOptions: ChartOptions = {
    title: {
      display: true,
      text: '資産推移'
    },
    tooltips: {
      mode: 'index',
      intersect: true
    },
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
        type: 'time',
        distribution: 'linear',
        bounds: "data",
        ticks: {
          source: "auto"
        },
        time: {
          minUnit: "day",
          displayFormats: {
            day: "YYYY-MM-DD",
            week: "YYYY-MM",
            month: "YYYY-MM",
            quarter: "YYYY-MM",
            year: "YYYY-MM",
          }
        }
      }],
      yAxes: [{
        stacked: true
      }]
    }, legend: {
      position: "right"
    }
  };

  constructor(private financialApiService: FinancialApiService) { }

  /**
   * 初期処理
   *
   * @returns {Promise<void>}
   * @memberof AssetsComponent
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
   * @memberof AssetsComponent
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
    this.assetsChartData = temp
      .groupBy(x => x.institution)
      .orderByDescending(x => x.sum(a => Math.abs(a.amount)))
      .select(x => {
        return {
          label: `${x.key()}`,
          data:
            dates.groupJoin(x.groupBy(a => a.date).select(x => {
              return {
                t: x.key(),
                y: x?.sum(ax => ax.amount)
              }
            }
            ), d => d, a => a.t, (d, a) => a?.firstOrDefault() ?? { t: d, y: null }).toArray()
        }
      })
      .toArray();
  }
}