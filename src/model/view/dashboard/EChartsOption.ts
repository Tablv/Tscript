/**
 *
 * ECharts Option
 *
 */
export default interface EChartsOption {
  sampleStyle: EChartsSampleStyle;

  title: {
    text: string;
    left: string;
    textStyle: {
      color: string;
      fontFamily: string;
      fontSize: number;
    };
  };

  legend: {
    show: boolean;
    left: string;
    top: string;
    data: Array<string>;
  };

  xAxis: Array<ChartSeries>;

  yAxis: Array<ChartSeries>;

  series: Array<ChartSeries>;
}

/**
 * Echarts Series
 */
export interface ChartSeries {
  name?: string;
  type?: string;
  data?: Array<number> | Array<string>;
}

/**
 * 各图表自定义样式
 *
 * (用于合成Series数组 或 合并数值、单位 生成属性)
 *
 */
export interface EChartsSampleStyle {
  // 全局配置
  global: {
    color: Array<string>;
    grid: {
      top: {
        value: number;
        unit: string;
      };
      left: {
        value: number;
        unit: string;
      };
      right: {
        value: number;
        unit: string;
      };
      bottom: {
        value: number;
        unit: string;
      };
    };
  };

  // 柱图配置
  bar?: {
    width: {
      value: number;
      unit: string; // '%'  or  '' (px)
    };
    label: {
      show: boolean;
      position: string; // 'top' 'left' 'right' 'bottom' 'inside'
    };
    axisLabel: {
      interval: 0;
      rotate: 0;
    };
  };

  // 堆积柱图
  barStack?: {};

  // 条图
  hbar?: {};

  // 饼图配置
  pie?: {};

  // 线图配置
  line?: {};

  // 组合图配置
  biaxial?: {};
}
