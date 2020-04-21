import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import { EChartsSampleStyle } from "@/model/view/dashboard/EChartsOption";
import EChartsService from "../EChartsService";
import warnConfigure from "./configure/WarnConfigure";
import { WARN_DEFAULT_VALUE } from "@/model/view/Warn";
import EChartDataUtil from "@/util/EChartDataUtil";
import BarHandler from "./BarHandler";

export default class HBarHandler extends BarHandler {
  public getChartHandleResult(
    result: AnalysisResults,
    dashboard: Dashboard
  ): echarts.EChartOption {
    let style: echarts.EChartOption = {};

    if (ObjectUtil.isEmpty(result)) {
      style.xAxis = {};
      style.yAxis = {};
      style.series = [];
      return {};
    }

    // 存在数据时，继续处理
    const fieldNames: SplitedFieldNames = EChartsService.splitFieldNames(
        result[0],
        dashboard
      ),
      sampleStyle = dashboard.echarts.sampleStyle;

    style.xAxis = this.getXAxis(fieldNames, result, sampleStyle);
    style.yAxis = this.getYAxis(fieldNames, result, sampleStyle);
    style.series = this.getSeries(fieldNames, result, sampleStyle);
    style.legend = this.getLegend(fieldNames);

    /**
     * 预警处理
     */
    if (dashboard.analysis.warn.id !== WARN_DEFAULT_VALUE) {
      warnConfigure(dashboard, style);
    }

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
    sampleStyle: EChartsSampleStyle
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
    sampleStyle: EChartsSampleStyle
  ): Array<echarts.EChartOption.YAxis> {
    return super.getXAxis(fieldNames, result, sampleStyle) as Array<
      echarts.EChartOption.YAxis
    >;
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
    sampleStyle: EChartsSampleStyle
  ): Array<echarts.EChartOption.Series> {
    let series: Array<echarts.EChartOption.Series> = [];

    fieldNames.measures.forEach(measureName => {
      const seriesData = {
        name: measureName,
        type: "bar",
        data: EChartDataUtil.getFieldDataArray(measureName, result),
        barWidth: EChartDataUtil.getBarWidth(sampleStyle),
        label: EChartDataUtil.getSeriesLabel(sampleStyle)
      };
      series.push(seriesData);
    });

    return series;
  }
  /**
   * 获取图例
   *
   * @param fieldNames 分析结果划分数据
   */
  public getLegend(fieldNames: SplitedFieldNames): echarts.EChartOption.Legend {
    const legend = {
      data: fieldNames.measures
    };
    return legend;
  }
}
