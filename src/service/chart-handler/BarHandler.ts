import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import EChartsService from "../EChartsService";
import warnConfigure from "./configure/WarnConfigure";
import { WARN_DEFAULT_VALUE } from "@/model/view/Warn";
import ChartHandler from "../interfaces/ChartHandler";
import EChartDataUtil from "@/util/EChartDataUtil";
import { BarChartOption } from "@/config/chart-config/Bar";

/**
 * 柱图处理
 */
export default class BarHandler implements ChartHandler {
  /**
   * 数据设置
   * 后面有其他的设置也加入到这里
   */
  public decimals: any;

  /**
   * 设置仪表盘配置
   * @param sampleStyle 仪表盘配置数据
   */
  public setSampleStyle(sampleStyle: BarChartOption) {
    this.decimals = sampleStyle.decimals;
  }

  /**
   * 获取图表的处理结果
   * @param result 数据集
   * @param dashboard 仪表盘数据
   * @param sampleStyle 仪表盘简单配置
   */
  public getChartHandleResult(
    result: AnalysisResults,
    dashboard: Dashboard,
    sampleStyle: BarChartOption
  ): echarts.EChartOption {
    let style: echarts.EChartOption = {};

    this.setSampleStyle(sampleStyle);

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
    sampleStyle: BarChartOption
  ): Array<echarts.EChartOption.XAxis> {
    let xAxis: Array<echarts.EChartOption.XAxis> = [];

    // 遍历生成X轴
    fieldNames.dimensions.forEach(dimensionName => {
      const axisXData = {
        name: dimensionName,
        type: "category",
        data: EChartDataUtil.getDataByFieldName(dimensionName, result),
        axisLabel: {
          interval: sampleStyle ? sampleStyle.axisLabel.interval : 0,
          rotate: sampleStyle ? sampleStyle.axisLabel.rotate : 0
        }
      } as echarts.EChartOption.XAxis;
      xAxis.push(axisXData);
    });
    return xAxis;
  }

  /**
   * 获取Y轴数据
   */
  public getYAxis(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: BarChartOption
  ): Array<echarts.EChartOption.YAxis> {
    return [
      {
        type: "value",
        name: this.decimals.unit
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
        data: EChartDataUtil.getDataByFieldName(
          measureName,
          result,
          this.decimals
        ),
        barWidth: EChartDataUtil.getBarWidth(sampleStyle),
        label: EChartDataUtil.getBarSeriesLabel(sampleStyle)
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
