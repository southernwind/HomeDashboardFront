import { Component, ElementRef, Input } from "@angular/core";
import * as Highcharts from 'highcharts';
import { FinancialApiService } from "../../../../services/financial-api.service";
import * as moment from 'moment';
import Enumerable from 'linq';
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
  public assets: InvestmentAsset | null = null;
  public dates: string[] = [];

  /** 資産推移チャート */
  public chart: Chart | undefined = undefined;

  private dateRangeSubject = new Subject<DateRange>();

  public resizedEventSubject = new Subject<void>();
  private chartCreatedSubject = new Subject<void>();

  public chartType = [
    { label: "全部", value: "all", icon: "plus-circle" },
    { label: "利益のみ", value: "profit", icon: "plus-circle" },
    { label: "元本のみ", value: "principal", icon: "plus-circle" }
  ];
  public selectedChartTypeIndex = 0;
  public selectedChartTypeChanged = new Subject<void>();

  constructor(private financialApiService: FinancialApiService, elementRef: ElementRef) {
    super();
    this.dateRangeSubject
      .pipe(untilDestroyed(this))
      .subscribe(async dateRange => {
        const startDate = dateRange.startDate;
        const endDate = dateRange.endDate;

        this.assets = (await this.financialApiService.GetInvestmentAssets(startDate, endDate).toPromise()) ?? null;
        if (this.assets === null) {
          return;
        }
        this.dates = this.assets.investmentAssetProducts[0].dailyRates.map(x => x.date);
        const datesCount = this.dates.length;
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
                x: -40,
                y: -40,
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
          series: this.getChartSeries()
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

    this.selectedChartTypeChanged.subscribe(_ =>
      this.chart?.ref?.update({
        series: this.getChartSeries()
      })
    );
  }

  private getChartSeries(): Highcharts.SeriesOptionsType[] {
    if (this.assets === null) {
      return [];
    }
    return Enumerable.from(this.assets.investmentAssetProducts)
      .orderBy(x => {
        const latestRate = x.dailyRates[this.dates.length - 1];
        return latestRate.amount * latestRate.rate * this.getRate(x.currencyUnitId, latestRate.date);
      })
      .select((x, index) => {
        const data = Enumerable.from(x.dailyRates).skipWhile(r => r.rate === 0).select(r => r.amount * (this.chartType[this.selectedChartTypeIndex].value === "all" ? r.rate : this.chartType[this.selectedChartTypeIndex].value === "principal" ? r.averageRate : r.rate - r.averageRate) * this.getRate(x.currencyUnitId, r.date)).toArray();
        return {
          type: 'area',
          name: `${x.name}`,
          pointInterval: 24 * 3600 * 1000,
          pointStart: moment(Enumerable.from(x.dailyRates).firstOrDefault(dr => dr.rate !== 0)?.date ?? this.dates[0]).valueOf(),
          legendIndex: -index,
          stack: Enumerable.from(data).sum() > 0 ? 0 : 1,
          data: data
        } as Highcharts.SeriesAreaOptions | Highcharts.SeriesLineOptions
      })
      .concat([
        {
          type: 'line',
          name: `計`,
          zIndex: 10000,
          pointInterval: 24 * 3600 * 1000,
          pointStart: moment(this.dates[0]).valueOf(),
          legendIndex: -1000000,
          data:
            Enumerable.from(this.dates).select(date =>
              Enumerable.from(this.assets?.investmentAssetProducts ?? []).sum(x => {
                const rate = Enumerable.from(x.dailyRates).first(dr => dr.date === date);
                return (this.chartType[this.selectedChartTypeIndex].value === "all" ? rate.rate : this.chartType[this.selectedChartTypeIndex].value === "principal" ? rate.averageRate : rate.rate - rate.averageRate) * rate.amount * this.getRate(x.currencyUnitId, date);
              })
            ).select((x, index) =>
              index !== this.dates.length - 1 ? x : {
                y: x,
                dataLabels: {
                  enabled: true,
                  align: 'right'
                }
              }
            ).toArray()
        } as Highcharts.SeriesLineOptions
      ]).toArray();
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
    if (this.assets === null) {
      throw new Error();
    }
    if (currencyId === jpyCurrencyId) {
      return 1;
    }
    return Enumerable.from(this.assets.currencyRates).first(c => c.id === currencyId && c.date === date).latestRate;
  }
}
