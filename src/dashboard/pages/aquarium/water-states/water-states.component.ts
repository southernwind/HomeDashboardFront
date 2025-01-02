import { Component, Input } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AquariumApiService } from '../../../services/aquarium-api.service';
import { first } from 'rxjs/operators';
import { WaterState } from 'src/dashboard/models/water-state.model';
import * as Highcharts from 'highcharts';
import { HighchartsOptions } from 'src/utils/highcharts.options';
import { Subject, combineLatest } from 'rxjs';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { Chart } from 'angular-highcharts';
import * as moment from 'moment';
import Enumerable from 'linq';

@UntilDestroy()
@Component({
  selector: "water-states",
  templateUrl: "./water-states.component.html"
})
export class WaterStatesComponent extends DashboardParentComponent {
  public chart: Chart | undefined = undefined;

  public waterStateList: WaterState[] = [];
  private dateRangeSubject = new Subject<DateRange>();
  private periodSubject = new Subject<number>();

  @Input()
  public set dateRange(value: DateRange) {
    if (!value) {
      return;
    }
    this.dateRangeSubject.next(value);
  }
  @Input()
  public set period(value: number) {
    if (!value) {
      return;
    }
    this.periodSubject.next(value);
  }

  constructor(private message: NzMessageService, private aquariumApiService: AquariumApiService) {
    super();
    combineLatest(this.dateRangeSubject, this.periodSubject)
      .pipe(untilDestroyed(this))
      .subscribe(async latestValue => {
        const dateRange = latestValue[0];
        const period = latestValue[1];
        try {
          this.waterStateList = await
            this.aquariumApiService
              .GetWaterStateList(dateRange.startDate.format("YYYY-MM-DD HH:mm:ss"), dateRange.endDate.format("YYYY-MM-DD HH:mm:ss"), period)
              .pipe(
                untilDestroyed(this),
                first()
              ).toPromise() ?? [];
        } catch {
          this.message.warning("データ取得失敗");
          return;
        }
        if (this.waterStateList.length === 0) {
          this.message.info("期間内のデータ件数が0件でした。グラフを生成出来ません。");
          return;
        }

        // 最大・最小日付
        const minDate = Enumerable.from(this.waterStateList).orderBy(x => x.time).first().time;
        const maxDate = Enumerable.from(this.waterStateList).orderByDescending(x => x.time).first().time;

        // 値の数
        const dateCount = ((moment(maxDate).add(9, 'h').valueOf() - moment(minDate).add(9, 'h').valueOf()) / (period * 1000)) + 1;

        const dates = Enumerable.range(0, dateCount, period).select(x => moment(minDate).add(x, "seconds").format("YYYY-MM-DD HH:mm:ss"));

        // グラフ値生成
        const createFunc = (selectorFunc: (((value: WaterState) => [number, number, number, number, number]) | ((value: WaterState) => number))): any => {
          const af = dates.toArray();
          const a = dates.groupJoin(
            Enumerable.from(this.waterStateList),
            x => x,
            x => x.time,
            (_, y) => y.select(selectorFunc as any).firstOrDefault() ?? null).toArray();
          return a;
        };

        const colors = Highcharts.getOptions().colors;
        if (colors === undefined) {
          return;
        }

        this.chart = new Chart({
          ...HighchartsOptions.defaultOptions,
          chart: {
            ...HighchartsOptions.defaultOptions.chart,
            type: 'boxplot',
            zooming: {
              ...HighchartsOptions.defaultOptions.chart?.zooming,
              type: "xy"
            }
          },
          title: {
            ...HighchartsOptions.defaultOptions.title,
            text: "気温・水温・湿度",
          },
          tooltip: {
            ...HighchartsOptions.defaultOptions.tooltip,
            valueDecimals: 3,
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
          yAxis: [{
            ...HighchartsOptions.defaultOptions.yAxis,
            labels: {
              ...(HighchartsOptions.defaultOptions.yAxis as any).labels,
              format: '{value}°C'
            },
            title: {
              ...(HighchartsOptions.defaultOptions.yAxis as any).title,
              text: '気温・水温'
            },
            plotBands: [{
              from: 29,
              to: 30,
              color: "#ff7f5015"
            },
            {
              from: 30,
              to: 10000,
              color: "#ff000015"
            }, {
              from: 25,
              to: 15,
              color: "#87cefa15"
            },
            {
              from: 15,
              to: -100000,
              color: "#1e90ff15"
            }
            ]
          }, {
            ...HighchartsOptions.defaultOptions.yAxis,
            title: {
              ...(HighchartsOptions.defaultOptions.yAxis as any).title,
              text: '湿度'
            },
            labels: {
              ...(HighchartsOptions.defaultOptions.yAxis as any).labels,
              format: '{value} %',
            },
            opposite: true
          }],
          series: [
            {
              name: '湿度',
              yAxis: 1,
              pointInterval: period * 1000,
              pointStart: moment(this.waterStateList[0].time).add(9, 'h').valueOf(),
              data: createFunc(x => [x.minHumidity, x.lowerQuartileHumidity, x.medianHumidity, x.upperQuartileHumidity, x.maxHumidity]),
              color: colors[0],
            } as Highcharts.SeriesBoxplotOptions,
            {
              name: '気温',
              pointInterval: period * 1000,
              pointStart: moment(this.waterStateList[0].time).add(9, 'h').valueOf(),
              data: createFunc(x => [x.minTemperature, x.lowerQuartileTemperature, x.medianTemperature, x.upperQuartileTemperature, x.maxTemperature]),
              color: colors[3],
            } as Highcharts.SeriesBoxplotOptions,
            {
              name: '水温',
              pointInterval: period * 1000,
              pointStart: moment(this.waterStateList[0].time).add(9, 'h').valueOf(),
              data: createFunc(x => [x.minWaterTemperature, x.lowerQuartileWaterTemperature, x.medianWaterTemperature, x.upperQuartileWaterTemperature, x.maxWaterTemperature]),
              color: colors[2],
            } as Highcharts.SeriesBoxplotOptions,
            {
              name: '湿度',
              type: 'line',
              yAxis: 1,
              pointInterval: period * 1000,
              pointStart: moment(this.waterStateList[0].time).add(9, 'h').valueOf(),
              data: createFunc(x => x.medianHumidity),
              color: colors[0],
            },
            {
              name: '気温',
              type: 'line',
              pointInterval: period * 1000,
              pointStart: moment(this.waterStateList[0].time).add(9, 'h').valueOf(),
              data: createFunc(x => x.medianTemperature),
              color: colors[3],
            },
            {
              name: '水温',
              type: 'line',
              pointInterval: period * 1000,
              pointStart: moment(this.waterStateList[0].time).add(9, 'h').valueOf(),
              data: createFunc(x => x.medianWaterTemperature),
              color: colors[2],
            }
          ]
        });
      });
  }
}
