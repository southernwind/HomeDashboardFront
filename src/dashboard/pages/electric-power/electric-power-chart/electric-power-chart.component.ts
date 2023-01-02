import { Component, Input, ElementRef } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { UntilDestroy } from '@ngneat/until-destroy';
import * as Highcharts from 'highcharts';
import { HighchartsOptions } from 'src/utils/highcharts.options';
import { Chart } from 'angular-highcharts';
import * as moment from 'moment';
import { ElectricPower } from '../../../models/electric-power.model';
import { Observable } from 'rxjs';
import { ResizedEvent } from 'angular-resize-event';

@UntilDestroy()
@Component({
  selector: "electric-power-chart",
  templateUrl: "./electric-power-chart.component.html"
})
export class ElectricPowerChartComponent extends DashboardParentComponent {
  public chart: Chart;
  @Input()
  public set chartData(electricPowers: ElectricPower[] | Observable<ElectricPower>) {
    if ((electricPowers as ElectricPower[])?.values) {
      this.chart.removeSeries(0);
      this.addSeries();
      for (const electricPower of electricPowers as ElectricPower[]) {
        this.chart.addPoint([moment(electricPower.timeStamp).toDate().getTime(), electricPower.electricPower], 0, false, false);
      }
      this.chart.ref.reflow();
    } else if ((electricPowers as Observable<ElectricPower>)?.subscribe) {
      (electricPowers as Observable<ElectricPower>).subscribe(x => {
        this.chart.addPoint([moment(x.timeStamp).toDate().getTime(), x.electricPower], 0, true, false);
      });
    }
  }

  constructor() {
    super();
    this.onInit.subscribe(() => {
      const $this = this;
      this.chart = new Chart({
        ...HighchartsOptions.defaultOptions,
        chart: {
          ...HighchartsOptions.defaultOptions.chart,
          type: 'line'
        },
        title: {
          ...HighchartsOptions.defaultOptions.title,
          text: "電力消費量",
        },
        xAxis: {
          ...HighchartsOptions.defaultOptions.xAxis,
          type: 'datetime'
        },
        tooltip: {
          ...HighchartsOptions.defaultOptions.tooltip,
          formatter: function () {
            return `<span style="font-size:10px">${$this.chart.ref.time.dateFormat("%Y/%m/%d %H:%M:%S", Number(this.key))}<span><br><span style="fill:${this.color}">●</span><span>${this.series.name} :</span> <span style="font-weight:bold">${this.y}</span> W`;
          }
        },
        yAxis: [{
          ...HighchartsOptions.defaultOptions.yAxis,
          labels: {
            ...(HighchartsOptions.defaultOptions.yAxis as any).labels,
            format: '{value} W'
          },
          title: {
            ...(HighchartsOptions.defaultOptions.yAxis as any).title,
            text: '消費電力'
          },
          min: 0
        }],
      });
      this.addSeries();
    });
  }

  /**
   * リサイズイベント
   *
   * @param {ResizedEvent} event
   * @memberof ElectricPowerChartComponent
   */
  public onResized(_: ResizedEvent) {
    this.chart?.ref?.reflow();
  }

  private addSeries(): void {
    this.chart.addSeries({
      name: '消費電力',
      yAxis: 0,
      color: Highcharts.getOptions().colors[0],
      data: []
    } as any, false, false);
  }
}
