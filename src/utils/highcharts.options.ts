import * as Highcharts from 'highcharts';
const defaultHighChartsColors: string[] = ["#7cb5ec", "#636368", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"];

export const highChartsColors = defaultHighChartsColors;
export function getHighChartsColor(num: number): string {
  var id = num % highChartsColors.length;
  return highChartsColors[id];
}
export class HighchartsOptions {
  public static defaultOptions: Highcharts.Options = {
    chart: {
      backgroundColor: "#FFF3",
      animation: {
        duration: 200
      }
    },
    colors: highChartsColors,
    time: {
      useUTC: false
    },
    title: {
      style: {
        color: '#EEE',
        fontSize: '20px'
      }
    },
    tooltip: {
      dateTimeLabelFormats: {
        year: '%Y',
        month: '%Y/%m',
        week: '%Y/%m/%d',
        day: '%Y/%m/%d',
        hour: '%Y/%m/%d %H',
        minute: '%Y/%m/%d %H:%M',
        second: '%Y/%m/%d %H:%M:%S',
      }
    },
    subtitle: {
      style: {
        color: '#EEE',
        fontSize: '16px'
      }
    },
    xAxis: {
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
        style: {
          color: '#A0A0A3'
        }
      }
    },
    yAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      minorTicks: true,
      title: {
        style: {
          color: '#A0A0A3'
        }
      }
    },
    plotOptions: {
      area: {
        stacking: 'normal'
      },
      series: {
        dataLabels: {
          color: '#F0F0F3',
          style: {
            fontSize: '13px'
          }
        },
        marker: {
          enabled: false
        },
      },
    },
    legend: {
      backgroundColor: '#FFF3',
      itemStyle: {
        color: '#DDD'
      },
      itemHoverStyle: {
        color: '#FFF'
      },
      itemHiddenStyle: {
        color: '#666'
      },
      title: {
        style: {
          color: '#CCC'
        }
      }
    },
    credits: {
      enabled: false
    },
    drilldown: {
      activeAxisLabelStyle: {
        color: '#F0F0F3'
      },
      activeDataLabelStyle: {
        color: '#F0F0F3'
      }
    },
    rangeSelector: {
      buttonTheme: {
        fill: '#505053',
        stroke: '#000000',
        style: {
          color: '#CCC'
        },
        states: {
          hover: {
            fill: '#707073',
            stroke: '#000000',
            style: {
              color: 'white'
            }
          },
          select: {
            fill: '#000003',
            stroke: '#000000',
            style: {
              color: 'white'
            }
          }
        }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
        backgroundColor: '#333',
        color: 'silver'
      },
      labelStyle: {
        color: 'silver'
      }
    },
    navigator: {
      handles: {
        backgroundColor: '#666',
        borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
        color: '#7798BF',
        lineColor: '#A6C7ED'
      },
      xAxis: {
        gridLineColor: '#505053'
      }
    },
    scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
    }
  };
}