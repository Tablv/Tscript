import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import EChartsService from "../EChartsService";
import BarStackHandler from "./BarStackHandler";
import { BarChartOption } from "@/config/chart-config/Bar";

/**
 * 堆积条图处理
 */
export default class HBarStackHandler extends BarStackHandler {
  public getChartHandleResult(
    result: AnalysisResults,
    dashboard: Dashboard,
    sampleStyle: BarChartOption
  ): echarts.EChartOption {
    let style: echarts.EChartOption = super.getChartHandleResult(
      result,
      dashboard,
      sampleStyle
    );

    if (ObjectUtil.isEmpty(result)) {
      return {};
    }

    // 存在数据时，继续处理
    const fieldNames: SplitedFieldNames = EChartsService.splitFieldNames(
      result[0],
      dashboard
    );

    style.xAxis = this.getXAxis(fieldNames, result, sampleStyle);
    style.yAxis = this.getYAxis(fieldNames, result, sampleStyle);

    return style;
  }

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
    return super.getYAxis(fieldNames, result, sampleStyle) as Array<
      echarts.EChartOption.XAxis
    >;
  }

  /**
   * 获取Y轴数据
   */
  public getYAxis(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: BarChartOption
  ): Array<echarts.EChartOption.YAxis> {
    return super.getXAxis(fieldNames, result, sampleStyle) as Array<
      echarts.EChartOption.YAxis
    >;
  }
}
