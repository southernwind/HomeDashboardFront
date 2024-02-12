import { Component, Input, EventEmitter, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Transaction } from '../../../../models/transaction.model';
import Enumerable from 'linq';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { HighchartsOptions } from 'src/utils/highcharts.options';
import { Condition } from 'src/dashboard/models/condition.model';
import { Subject, combineLatest, observable, Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Chart } from 'angular-highcharts';
import { InvestmentProduct } from '../../../../models/investment-product.model';
import { InvestmentCurrencyUnit } from 'src/dashboard/models/investment-currency-unit.model';
import { PlotSunburstLevelsOptions } from 'highcharts';
import { SeriesSunburstOptions } from 'highcharts/highcharts.src';

@UntilDestroy()
@Component({
  selector: "app-investment-portfolio-chart",
  templateUrl: "./investment-portfolio.component.html",
})
export class InvestmentPortfolioComponent extends DashboardParentComponent {
  public chart: Chart | undefined;

  /** 生データ */
  @Input()
  public set investmentProductList(value: InvestmentProduct[]) {
    if (!value) {
      return;
    }
    this.investmentProductListSubject.next(value);
  }
  private investmentProductListSubject = new Subject<InvestmentProduct[]>();

  /** 通貨データ */
  @Input()
  public set investmentCurrencyUnitList(value: InvestmentCurrencyUnit[]) {
    if (!value) {
      return;
    }
    this.investmentCurrencyUnitListSubject.next(value);
  }
  private investmentCurrencyUnitListSubject = new Subject<InvestmentCurrencyUnit[]>();

  constructor() {
    super();
    combineLatest(this.investmentProductListSubject, this.investmentCurrencyUnitListSubject)
      .pipe(untilDestroyed(this))
      .subscribe(s => {
        const investmentProductList = s[0].filter(x => x.amount !== 0);
        const investmentCurrencyUnitList = s[1];
        const temp = Enumerable.from(investmentProductList)
          .select(x => {
            const currency = Enumerable.from(investmentCurrencyUnitList).first(icu => icu.id === x.currencyUnitId);
            return {
              category: x.category,
              name: x.name,
              value: x.amount * x.latestRate * currency.latestRate
            };
          })
          .orderByDescending(x => x.value);

        this.chart = new Chart({
          ...HighchartsOptions.defaultOptions,
          chart: {
            ...HighchartsOptions.defaultOptions.chart,
            height: '100%'
          },
          title: {
            ...HighchartsOptions.defaultOptions.title,
            text: undefined
          },
          plotOptions: {
            ...HighchartsOptions.defaultOptions.plotOptions,
            pie: {
              ...HighchartsOptions.defaultOptions.plotOptions?.pie,
              shadow: false,
              center: ['50%', '50%']
            }
          },
          tooltip: {
            ...HighchartsOptions.defaultOptions.tooltip,
            formatter: function () {
              const parentValue = (this.series.points.find(x => (x as any).id === ((this.series as any).rootNode || 'root')) as any).value;
              return `${this.key}<br>${Highcharts.numberFormat((this.point as any).value, 0, '', ',')}円<br>(${Highcharts.numberFormat((this.point as any).value / parentValue * 100, 2, '.', ',')}%)`;
            },
          },
          series: [{
            name: 'カテゴリ',
            type: "sunburst",
            data: Enumerable.from([{
              id: 'root',
              parent: '',
              name: 'ALL',
              value: temp.sum(x => x.value)
            }]).concat(temp.groupBy(x => x.category).select(x => {
              return {
                id: x.key(),
                parent: 'root',
                name: x.key(),
                value: x.sum(y => y.value)
              }
            })).concat(
              temp.select(x => {
                return {
                  id: x.name,
                  parent: x.category,
                  name: x.name,
                  value: x.value
                }
              }
              )).toArray(),
            allowDrillToNode: true,
            cursor: 'pointer',
            dataLabels: {
              formatter: function () {
                const parentValue = (this.series.points.find(x => (x as any).id === ((this.series as any).rootNode || 'root')) as any).value;
                return `${this.key}<br>${Highcharts.numberFormat((this.point as any).value / parentValue * 100, 2, '.', ',')}%`;
              },
              filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 16
              }
            },
            levels: [{
              level: 1,
              levelIsConstant: false,
              dataLabels: {
                filter: {
                  property: 'outerArcLength',
                }
              }
            } as PlotSunburstLevelsOptions, {
              level: 2,
              colorByPoint: true,
            } as PlotSunburstLevelsOptions,
            {
              level: 3,
              colorVariation: {
                key: 'brightness',
                to: 0.3
              }
            } as PlotSunburstLevelsOptions]
          } as SeriesSunburstOptions] as any
        });
      });
  }
}