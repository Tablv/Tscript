import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import { EChartsSampleStyle } from "@/model/view/dashboard/EChartsOption";
// import ChartHandler from "../interfaces/ChartHandler";
import EChartDataUtil from "@/util/EChartDataUtil";
import BarStackHandler from "./BarStackHandler";
import { BarChartOption } from "@/config/chart-config/Bar";

/**
 * 堆积柱图处理
 */
export default class BarPercentageHandler extends BarStackHandler {
  /**
   * 获取Y轴数据
   */
  public getYAxis(): Array<echarts.EChartOption.YAxis> {
    return [
      {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: {
          show: true,
          // interval: "auto",
          formatter: "{value} %"
        },
        show: true
      }
    ] as Array<echarts.EChartOption.YAxis>;
  }

  /**
   * 获取Series数据
   *
   * @param fieldNames 分析结果划分数据
   * @param result 分析结果
   * @param sampleStyle 样例样式
   */
  public getSeries(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: BarChartOption
  ): Array<echarts.EChartOption.Series> {
    let series: Array<echarts.EChartOption.Series> = [];

    fieldNames.measures.forEach(measureName => {
      const seriesData = {
        name: measureName,
        type: "bar",
        stack: "stack",
        data: EChartDataUtil.getPercentageArray(measureName, result),
        barWidth: EChartDataUtil.getBarWidth(sampleStyle),
        label: EChartDataUtil.getBarSeriesLabel(sampleStyle)
      };
      series.push(seriesData);
    });
    return series;
  }
}
