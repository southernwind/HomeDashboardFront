import { Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { UntilDestroy } from '@ngneat/until-destroy';
import * as Highcharts from 'highcharts';
import { HighchartsOptions } from 'src/utils/highcharts.options';
import { Chart } from 'angular-highcharts';
import * as moment from 'moment';
import { ElectricPowerApiService } from '../../../services/electric-power.service';

@UntilDestroy()
@Component({
  selector: "electric-power-realtime-chart",
  templateUrl: "./electric-power-realtime-chart.component.html"
})
export class ElectricPowerRealtimeChartComponent extends DashboardParentComponent {
  public chart: Chart;
  constructor(private electricPowerApiService: ElectricPowerApiService) {
    super();
    this.onInit.subscribe(() => {
      this.electricPowerApiService.electricPowerAsObservable().subscribe(x => {
        this.chart.addPoint([moment(x.timeStamp).toDate().getTime(), x.electricPower], 0, true, false);
      });
      const $this = this;
      this.chart = new Chart({
        ...HighchartsOptions.defaultOptions,
        chart: {
          ...HighchartsOptions.defaultOptions.chart,
          type: 'line',
          zoomType: "xy"
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
            return `<span style="font-size:10px">${$this.chart.ref.time.dateFormat("%Y/%m/%d %H:%M:%S", this.key)}<span><br><span style="fill:${this.color}">●</span><span>${this.series.name} :</span> <span style="font-weight:bold">${this.y}</span> W`;
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
      this.chart.addSeries({
        name: '消費電力',
        yAxis: 0,
        color: Highcharts.getOptions().colors[0],
        data: []
      } as any, false, false);
    });
  }
}
