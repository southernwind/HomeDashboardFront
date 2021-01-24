import { Component, Input, EventEmitter, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Transaction } from '../../../../models/transaction.model';
import * as Enumerable from 'linq';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { HighchartsOptions } from 'src/utils/highcharts.options';
import { Condition } from 'src/dashboard/models/condition.model';
import { Subject, combineLatest, observable, Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Chart } from 'angular-highcharts';
import { InvestmentProduct } from '../../../../models/investment-product.model';
import { InvestmentCurrencyUnit } from 'src/dashboard/models/investment-currency-unit.model';

@UntilDestroy()
@Component({
  selector: "app-investment-portfolio-chart",
  templateUrl: "./investment-portfolio.component.html",
})
export class InvestmentPortfolioComponent extends DashboardParentComponent {
  public chart: Chart;

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
        const investmentProductList = s[0];
        const investmentCurrencyUnitList = s[1];
        const temp = Enumerable.from(investmentProductList)
          .select(x => {
            const currency = investmentCurrencyUnitList.find(icu => icu.id === x.currencyUnitId);
            return {
              name: x.name,
              value: x.amount * x.latestRate * currency.latestRate
            };
          })
          .orderByDescending(x => x.value);

        this.chart = new Chart({
          ...HighchartsOptions.defaultOptions,
          chart: {
            ...HighchartsOptions.defaultOptions.chart,
            type: 'pie'
          },
          title: {
            ...HighchartsOptions.defaultOptions.title,
            text: null
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
              return `${this.key}<br>${Highcharts.numberFormat(this.y, 0, '', ',')}円<br>(${this.percentage.toFixed(3)}%)`;
            }
          },
          legend: {
            ...HighchartsOptions.defaultOptions.legend,
            labelFormatter: function () {
              return `${this.name}<br/><span style="font-size:0.6rem">(${Highcharts.numberFormat(this.y, 0, '', ',')}円)</span>`;
            } as Highcharts.FormatterCallbackFunction<Highcharts.Point>,
            enabled: true,
            align: "right",
            layout: "vertical",
            verticalAlign: "top"
          },
          series: [{
            name: 'カテゴリ',
            data: temp
              .select((x, index) => {
                return {
                  name: x.name,
                  y: x.value,
                  color: Highcharts.getOptions().colors[index % Highcharts.getOptions().colors.length],
                };
              }).toArray()
            ,
            showInLegend: true,
            dataLabels: {
              enabled: false
            }
          } as any]
        });
      });
  }
}