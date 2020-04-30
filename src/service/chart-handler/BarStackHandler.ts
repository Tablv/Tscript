import { BarChartOption } from "@/config/chart-config/Bar";
import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
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
    let series: Array<
      echarts.EChartOption.Series | { data: Array<any> }
    > = super.getSeries(fieldNames, result, sampleStyle);
    series.forEach(item => {
      (item as any).stack = "stack";
    });

    return series;
  }
}
