import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import EChartsService from "../EChartsService";
import warnConfigure from "./configure/WarnConfigure";
import { WARN_DEFAULT_VALUE } from "@/model/view/Warn";
import ChartHandler from "../interfaces/ChartHandler";
import EChartDataUtil from "@/util/EChartDataUtil";
import { LineChartOption } from "@/config/chart-config/Line";

/**
 * 折线图处理
 */
export default class LineHandler implements ChartHandler {
  public getChartHandleResult(
    result: AnalysisResults,
    dashboard: Dashboard,
    sampleStyle: LineChartOption
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
    );

    style.xAxis = this.getXAxis(fieldNames, result, sampleStyle);
    style.yAxis = this.getYAxis();
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
    sampleStyle: LineChartOption
  ): Array<echarts.EChartOption.XAxis> {
    let xAxis: Array<echarts.EChartOption.XAxis> = [];

    // 遍历生成X轴
    fieldNames.dimensions.forEach(dimensionName => {
      const axisXData = {
        name: dimensionName,
        type: "category",
        data: EChartDataUtil.getDataByFieldName(dimensionName, result)
      } as echarts.EChartOption.XAxis;
      xAxis.push(axisXData);
    });

    return xAxis;
  }
  /**
   * 获取Y轴数据
   */
  public getYAxis(): Array<echarts.EChartOption.YAxis> {
    return [
      {
        type: "value"
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
    sampleStyle: LineChartOption
  ): Array<echarts.EChartOption.Series> {
    let series: Array<echarts.EChartOption.Series> = [];

    fieldNames.measures.forEach(measureName => {
      const seriesData = {
        name: measureName,
        type: "line",
        data: EChartDataUtil.getDataByFieldName(measureName, result)
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
