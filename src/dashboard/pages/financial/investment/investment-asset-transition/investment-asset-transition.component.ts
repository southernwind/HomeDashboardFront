import { Component, ElementRef, Input } from "@angular/core";
import * as Highcharts from 'highcharts';
import { FinancialApiService } from "../../../../services/financial-api.service";
import * as moment from 'moment';
import * as Enumerable from 'linq';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { HighchartsOptions } from 'src/utils/highcharts.options';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Subject, combineLatest } from 'rxjs';
import { Chart } from 'angular-highcharts';
import { InvestmentAsset } from '../../../../models/investment-asset.model';
import { jpyCurrencyId } from '../../../../../constants/constants';
import { ResizedEvent } from "angular-resize-event";
import { delay, map } from "rxjs/operators";

@UntilDestroy()
@Component({
  selector: "app-investment-asset-transition-chart",
  templateUrl: "./investment-asset-transition.component.html",
})
export class InvestmentAssetTransitionComponent extends DashboardParentComponent {
  /** 資産推移生データ */
  public assets: InvestmentAsset;

  /** 資産推移チャート */
  public chart: Chart;

  private dateRangeSubject = new Subject<DateRange>();

  public resizedEventSubject = new Subject<void>();
  private chartCreatedSubject = new Subject<void>();

  constructor(private financialApiService: FinancialApiService, elementRef: ElementRef) {
    super();
    this.dateRangeSubject
      .pipe(untilDestroyed(this))
      .subscribe(async dateRange => {
        const startDate = dateRange.startDate;
        const endDate = dateRange.endDate;

        this.assets = await this.financialApiService.GetInvestmentAssets(startDate, endDate).toPromise();
        const dates = this.assets.investmentAssetProducts[0].dailyRates.map(x => x.date);
        const datesCount = dates.length;
        this.chart = new Chart({
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
            ...HighchartsOptions.defaultOptions.tooltip,
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
          },
          series: Enumerable.from(this.assets.investmentAssetProducts)
            .orderBy(x => {
              const latestRate = x.dailyRates[datesCount - 1];
              return latestRate.amount * latestRate.rate * this.getRate(x.currencyUnitId, latestRate.date);
            })
            .select((x, index) => {
              return {
                type: 'area',
                name: `${x.name}`,
                pointInterval: 24 * 3600 * 1000,
                pointStart: moment(Enumerable.from(x.dailyRates).firstOrDefault(dr => dr.rate !== 0)?.date ?? dates[0]).valueOf(),
                legendIndex: -index,
                data:
                  Enumerable.from(x.dailyRates).skipWhile(r => r.rate === 0).select(r => r.amount * r.rate * this.getRate(x.currencyUnitId, r.date)).toArray()
              } as Highcharts.SeriesAreaOptions | Highcharts.SeriesLineOptions
            })
            .concat([
              {
                type: 'line',
                name: `計`,
                zIndex: 10000,
                pointInterval: 24 * 3600 * 1000,
                pointStart: moment(dates[0]).valueOf(),
                legendIndex: -1000000,
                data:
                  Enumerable.from(dates).select(date =>
                    Enumerable.from(this.assets.investmentAssetProducts).sum(x => {
                      const rate = x.dailyRates.find(dr => dr.date === date);
                      return rate.rate * rate.amount * this.getRate(x.currencyUnitId, date);
                    })
                  ).select((x, index) =>
                    index !== datesCount - 1 ? x : {
                      y: x,
                      dataLabels: {
                        enabled: true,
                        align: 'right'
                      }
                    }
                  ).toArray()
              } as Highcharts.SeriesLineOptions
            ]).toArray()
        });
        this.chart.ref$.subscribe(_ => {
          this.chartCreatedSubject.next();
        });
      });

    this.onInit.subscribe(x => {
      this.dateRangeSubject.next({
        startDate: moment('2020-11-01'), endDate: moment()
      });
    });

    combineLatest(
      [
        this.resizedEventSubject,
        this.chartCreatedSubject
      ]).pipe(delay(500)).subscribe(x => {
        this.chart?.ref?.reflow();
      });
  }

  /**
   * 当日レートの取得
   *
   * @private
   * @param {number} currencyId
   * @param {string} date
   * @returns {number}
   * @memberof InvestmentAssetTransitionComponent
   */
  private getRate(currencyId: number, date: string): number {
    if (currencyId === jpyCurrencyId) {
      return 1;
    }
    return Enumerable.from(this.assets.currencyRates).firstOrDefault(c => c.id === currencyId && c.date === date)?.latestRate;
  }
}
