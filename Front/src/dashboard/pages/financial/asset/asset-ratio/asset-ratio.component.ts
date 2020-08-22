import { Component, Input } from "@angular/core";
import { Chart } from 'angular-highcharts';
import { FinancialApiService } from "../../../../services/financial-api.service";
import { Asset } from '../../../../models/asset.model';
import * as Enumerable from 'linq';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { HighchartsOptions } from 'src/utils/highcharts.options';
import { Subject, combineLatest } from 'rxjs';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { DateRange } from '../../../../models/date-range.model';
import * as Highcharts from 'highcharts';

@UntilDestroy()
@Component({
  selector: "app-asset-ratio-chart",
  templateUrl: "./asset-ratio.component.html",
})
export class AssetRatioComponent extends DashboardParentComponent {
  /** 資産割合生データ */
  public assets: Asset[];

  /** 資産割合チャート */
  public chart: Chart;

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

        this.assets = await this.financialApiService.GetLatestAsset(startDate, endDate).toPromise();

        const temp = Enumerable.from(this.assets)
          .where(x => x.amount > 0)
          .groupBy(x => x.category)
          .orderBy(x => x.sum(a => a.amount));
        this.chart = new Chart({
          ...HighchartsOptions.defaultOptions,
          chart: {
            ...HighchartsOptions.defaultOptions.chart,
            type: 'pie'
          },
          title: {
            ...HighchartsOptions.defaultOptions.title,
            text: "資産割合",
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
              return `${this.key}<br>${Highcharts.numberFormat(this.y, 0, '', ',')}円<br>(${this.percentage.toFixed(3)}%`;
            }
          },
          series: [{
            name: 'カテゴリ',
            data: temp
              .select((x, index) => {
                return {
                  name: x.key(),
                  y: x.sum(a => a.amount),
                  color: Highcharts.getOptions().colors[index]
                };
              }).toArray()
            ,
            size: '60%',
          } as any, {
            name: '金融機関',
            data: temp
              .select(x => { return { cat: x.key(), ins: x.groupBy(a => a.institution) } })
              .select((x, index) => {
                return x.ins.select((i, index2) => {
                  return {
                    name: i.key(),
                    y: i.sum(a => a.amount),
                    color: Highcharts.color(Highcharts.getOptions().colors[index]).brighten(0.2 - (index2 / x.ins.count()) / 5).get()
                  }
                })
              }).selectMany(x => x).toArray(),
            size: '100%',
            innerSize: '60%',
            id: 'institutions'
          } as any],
          responsive: {
            rules: [{
              chartOptions: {
                series: [{
                }, {
                  id: 'institutions',
                  dataLabels: {
                    enabled: false
                  }
                } as any]
              },
              condition: {}
            }]
          }
        });
      });
  }
}