import { ChartOption } from "@/config/ChartConfig";
import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import Dashboard from "@/model/view/dashboard/Dashboard";

/**
 * 图表通用处理 接口
 */
export default interface ChartHandler {
  getChartHandleResult(
    result: AnalysisResults,
    dashboard: Dashboard,
    sampleStyle: ChartOption
  ): echarts.EChartOption;
  /**
   * 获取 X轴 数据
   *
   * @param fieldNames 列数据
   * @param result 分析结果
   * @param sampleStyle 样例样式
   */
  getXAxis?(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: ChartOption
  ): Array<echarts.EChartOption.XAxis>;

  /**
   * 获取 Y轴 数据
   */
  getYAxis?(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: ChartOption
  ): Array<echarts.EChartOption.YAxis>;

  /**
   * 获取 Series 数据
   *
   * @param fieldNames 分析结果划分数据
   * @param result 分析结果
   * @param sampleStyle 样例样式
   */
  getSeries(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: ChartOption
  ): Array<echarts.EChartOption.Series>;

  /**
   * 获取图例
   *
   * @param fieldNames 分析结果划分数据
   */
  getLegend?(
    fieldNames: SplitedFieldNames,
    result?: AnalysisResults
  ): echarts.EChartOption.Legend;
}
