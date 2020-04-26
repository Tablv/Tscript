import { BarChartOption } from "@/config/chart-config/Bar";
import { BarStackChartOption } from "@/config/chart-config/BarStack";
import { HBarChartOption } from "@/config/chart-config/HBar";
import { HBarStackChartOption } from "@/config/chart-config/HBarStack";
import { PieChartOption } from "@/config/chart-config/Pie";
import { RPieChartOption } from "@/config/chart-config/RPie";
import { RosePieChartOption } from "@/config/chart-config/RosePie";
import { SunPieChartOption } from "@/config/chart-config/SunPie";
import { RadarChartOption } from "@/config/chart-config/Radar";
import { LineChartOption } from "@/config/chart-config/Line";
import { BarPercentageChartOption } from "@/config/chart-config/BarPercentage";
import { BiaxialChartOption } from "@/config/chart-config/Biaxial";
import { HBarPercentageChartOption } from "@/config/chart-config/HBarPercentage";

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

  // 百分比堆积柱图
  barPercentage?: BarPercentageChartOption;

  // 条图
  hbar?: HBarChartOption;

  // 堆积条图
  hbarStack?: HBarStackChartOption;

  // 百分比堆积条图
  hbarPercentage?: HBarPercentageChartOption;

  // 饼图配置
  pie?: PieChartOption;

  //环形图配置
  rpie?: RPieChartOption;

  //玫瑰图配置
  rosepie?: RosePieChartOption;

  //旭日图配置
  sunpie?: SunPieChartOption;

  //雷达图配置
  radar?: RadarChartOption;

  // 线图配置
  line?: LineChartOption;

  // 组合图配置
  biaxial?: BiaxialChartOption;
}
