import { Component, Input } from "@angular/core";
import * as Highcharts from 'highcharts';
import { FinancialApiService } from "../../../../services/financial-api.service";
import * as moment from 'moment';
import { Asset } from '../../../../models/asset.model';
import Enumerable from 'linq';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { HighchartsOptions } from 'src/utils/highcharts.options';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { Chart } from 'angular-highcharts';

@UntilDestroy()
@Component({
  selector: "app-asset-transition-chart",
  templateUrl: "./asset-transition.component.html",
})
export class AssetTransitionComponent extends DashboardParentComponent {
  /** 資産推移生データ */
  public assets: Asset[] = [];

  /** 資産推移チャート */
  public chart: Chart | undefined = undefined;

  private dateRangeSubject = new Subject<DateRange>();

  @Input()
  public set dateRange(value: DateRange) {
    if (!value) {
      return;
    }
    this.dateRangeSubject.next(value);
  }

  constructor(private financialApiService: FinancialApiService) {
    super();
    this.dateRangeSubject
      .pipe(untilDestroyed(this))
      .subscribe(async dateRange => {
        const startDate = dateRange.startDate;
        const endDate = dateRange.endDate;

        this.assets = (await this.financialApiService.GetAssets(startDate, endDate).toPromise()) ?? [];
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
        this.chart = new Chart({
          ...HighchartsOptions.defaultOptions,
          chart: {
            ...HighchartsOptions.defaultOptions.chart,
            type: "area",
            zooming: {
              ...HighchartsOptions.defaultOptions.chart?.zooming,
              type: "x"
            }
          },
          title: {
            ...HighchartsOptions.defaultOptions.title,
            text: "資産推移",
          },
          xAxis: {
            ...HighchartsOptions.defaultOptions.xAxis,
            type: 'datetime',
            title: undefined,
            dateTimeLabelFormats: {
              year: '%Y',
              month: '%Y/%m',
              week: '%m/%d',
              day: '%m/%d',
            }
          },
          yAxis: {
            ...HighchartsOptions.defaultOptions.yAxis,
            title: undefined,
            labels: {
              ...(HighchartsOptions.defaultOptions.yAxis as Highcharts.YAxisOptions).labels,
              formatter: function () {
                if (this.value == 0) {
                  return `${this.value}円`;
                } else if (Math.abs(Number(this.value)) >= 100000000) {
                  return `${Number(this.value) / 100000000} 万円`
                } else {
                  return `${Number(this.value) / 10000} 万円`
                }
              }
            }
          },
          tooltip: {
            ...HighchartsOptions.defaultOptions.tooltip,
            formatter: function () {
              return `${Highcharts.dateFormat("%Y/%m/%d", Number(this.key))}<br>${this.series.name} : ${Highcharts.numberFormat(this.y ?? 0, 0, '', ',')}円`
            }
          },
          plotOptions: {
            ...HighchartsOptions.defaultOptions.plotOptions,
            series: {
              ...HighchartsOptions.defaultOptions.plotOptions?.series,
              dataLabels: {
                ...HighchartsOptions.defaultOptions.plotOptions?.series?.dataLabels,
                shape: 'callout',
                backgroundColor: '#0007',
                formatter: function () {
                  return `最終値:${Highcharts.numberFormat(this.y ?? 0, 0, '', ',')}円`;
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
          },
          series: temp
            .groupBy(x => x.institution)
            .orderBy(x => Math.abs(x.last().amount))
            .select((x, index) => {
              return {
                type: 'area',
                animation: {
                  duration: 200
                },
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
        });
      });
  }
}
