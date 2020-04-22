import { BarChartOption } from "@/config/chart-config/Bar";
import { BarStackChartOption } from "@/config/chart-config/BarStack";
import { HBarChartOption } from "@/config/chart-config/HBar";
import { HBarStackChartOption } from '@/config/chart-config/HBarStack';
import { PieChartOption } from "@/config/chart-config/Pie";
import { RPieChartOption } from "@/config/chart-config/RPie";
import { LineChartOption } from "@/config/chart-config/Line";
import { BiaxialChartOption } from "@/config/chart-config/Biaxial";

/**
 * ECharts Option
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
  bar?: BarChartOption;

  // 堆积柱图
  barStack?: BarStackChartOption;

  // 条图
  hbar?: HBarChartOption;

  // 堆积条图
  hbarStack?: HBarStackChartOption;

  // 饼图配置
  pie?: PieChartOption;

  //环形图配置
  rpie?:RPieChartOption;


  // 线图配置
  line?: LineChartOption;

  // 组合图配置
  biaxial?: BiaxialChartOption;
}
