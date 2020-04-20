import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import Dashboard from "@/model/view/dashboard/Dashboard";
import { EChartsSampleStyle } from "@/model/view/dashboard/EChartsOption";

/**
 * 图表通用信息 接口
 */
export default interface ChartHandle {
  getChartHandleResult(
    result: AnalysisResults,
    dashboard: Dashboard
  ): echarts.EChartOption;
  /**
   * 获取X轴数据
   *
   * @param fieldNames 列数据
   * @param result 分析结果
   * @param sampleStyle 样例样式
   */
  getXAxis(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: EChartsSampleStyle
  ): Array<echarts.EChartOption.XAxis>;

  /**
   * 获取Y轴数据
   */
  getYAxis(): Array<echarts.EChartOption.YAxis>;

  /**
   * 获取Series数据
   *
   * @param fieldNames 分析结果划分数据
   * @param result 分析结果
   * @param sampleStyle 样例样式
   */
  getSeries(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: EChartsSampleStyle
  ): Array<echarts.EChartOption.Series>;
  /**
   * 获取图例
   *
   * @param fieldNames 分析结果划分数据
   */
  getLegend(
    fieldNames: SplitedFieldNames,
    result?: AnalysisResults
  ): echarts.EChartOption.Legend;
}
