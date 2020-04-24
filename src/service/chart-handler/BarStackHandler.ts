import { BarChartOption } from "@/config/chart-config/Bar";
import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import EChartDataUtil from "@/util/EChartDataUtil";
import BarHandler from "./BarHandler";

/**
 * 堆积柱图处理
 */
export default class BarStackHandler extends BarHandler {
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
    let series: Array<echarts.EChartOption.Series | { data: Array<any> }> = [];

    fieldNames.measures.forEach(measureName => {
      const seriesData = {
        name: measureName,
        type: "bar",
        stack: "stack",
        data: EChartDataUtil.getFieldDataArray(measureName, result),
        barWidth: EChartDataUtil.getBarWidth(sampleStyle),
        label: EChartDataUtil.getBarSeriesLabel(sampleStyle)
      };
      series.push(seriesData);
    });

    return series;
  }
}
