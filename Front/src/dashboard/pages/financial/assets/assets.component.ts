import { Component, OnInit, Input } from "@angular/core";
import { ChartOptions, ChartDataSets } from "chart.js";
import { FinancialApiService } from "../../../services/financial-api.service";
import * as moment from 'moment';
import { Asset } from '../../../models/asset.model';
import * as Enumerable from 'linq';
import { Moment } from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';

@Component({
  selector: "app-assets-chart",
  templateUrl: "./assets.component.html",
})
export class AssetsComponent extends DashboardParentComponent implements OnInit {
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
        type: 'time',
        gridLines: {
          display: true,
          color: "#FFF1",
        },
        ticks: {
          fontSize: 9,
          maxTicksLimit: 20,
          maxRotation: 0,
          minRotation: 0,
        },
        time: {
          unit: "day",
          displayFormats: {
            day: "DD",
          }
        }
      }, {
        type: 'time',
        gridLines: {
          drawOnChartArea: false,
          drawTicks: true,
          drawBorder: false,
          tickMarkLength: 10
        },
        ticks: {
          fontSize: 11,
          fontStyle: 'bold',
          maxRotation: 0,
          minRotation: 0,
        },
        time: {
          unit: "month",
          displayFormats: {
            month: "M月",
          }
        }
      },
      {
        type: 'time',
        ticks: {
          fontSize: 13,
          fontStyle: 'bold',
          maxRotation: 0,
          minRotation: 0,
        },
        time: {
          unit: "year",
          displayFormats: {
            year: "YYYY年",
          }
        }
      }],
      yAxes: [{
        stacked: true,
        gridLines: {
          display: true,
          color: "#FFF3"
        },
        ticks: {
          callback: label => {
            if (label == 0) {
              return label +
                "円";
            } else if (Math.abs(Number(label)) >= 100000000) {
              return (Number(label) / 100000000) + "億円";
            } else {
              return (Number(label) / 10000) + "万円";
            }
          }
        }
      }]
    }, legend: {
      position: "right"
    }
  };

  constructor(private financialApiService: FinancialApiService) {
    super();
  }

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
      .orderBy(x => x.sum(a => Math.abs(a.amount)))
      .select((x, i) => {
        return {
          label: `${x.key()}`,
          data:
            dates.groupJoin(x.groupBy(a => a.date).select(x => {
              return {
                t: x.key(),
                y: x?.sum(ax => ax.amount) == 0 ? null : x?.sum(ax => ax.amount)
              }
            }
            ), d => d, a => a.t, (d, a) => a?.firstOrDefault() ?? { t: d, y: null }).toArray()
        }
      })
      .toArray();
  }
}
