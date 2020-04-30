import { BarChartOption } from "@/config/chart-config/Bar";
import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import BarHandler from "./BarHandler";

/**
 * 条图处理
 */
export default class HBarHandler extends BarHandler {
  /**
   * 获取X轴数据
   *
   * @param fieldNames 列数据
   * @param result 分析结果
   * @param sampleStyle 样例样式
   */
  public getXAxis(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: BarChartOption
  ): Array<echarts.EChartOption.XAxis> {
    /*
     * 横向条形图 X轴配置，使用竖向柱状图 Y轴配置
     */
    let show = super.getYAxis(fieldNames, result, sampleStyle) as Array<
      echarts.EChartOption.XAxis
    >;
    return show;
  }

  /**
   * 获取Y轴数据
   */
  public getYAxis(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: BarChartOption
  ): Array<echarts.EChartOption.YAxis> {
    /*
     * 横向条形图 Y轴配置，使用竖向柱状图 X轴配置
     */
    return super.getXAxis(fieldNames, result, sampleStyle) as Array<
      echarts.EChartOption.YAxis
    >;
  }
}
