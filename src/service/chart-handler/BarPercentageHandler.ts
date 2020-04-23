import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import EChartDataUtil from "@/util/EChartDataUtil";
import BarStackHandler from "./BarStackHandler";
import { BarChartOption } from "@/config/chart-config/Bar";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import EChartsService from "../EChartsService";
import warnConfigure from "./configure/WarnConfigure";
import { WARN_DEFAULT_VALUE } from "@/model/view/Warn";

/**
 * 堆积柱图处理
 */
export default class BarPercentageHandler extends BarStackHandler {
  public getChartHandleResult(
    result: AnalysisResults,
    dashboard: Dashboard,
    sampleStyle: BarChartOption
  ): echarts.EChartOption {
    let style: echarts.EChartOption = {};

    if (ObjectUtil.isEmpty(result)) {
      style.xAxis = {};
      style.yAxis = {};
      style.series = [];
      style.tooltip = {};
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
    style.tooltip = this.getToolTip();

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
        data: EChartDataUtil.getFieldDataArray(dimensionName, result),
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
        min: 0,
        max: 100,
        axisLabel: {
          show: true,
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
        stack: "barPercentage",
        data: EChartDataUtil.getPercentageArray(measureName, result),
        barWidth: EChartDataUtil.getBarWidth(sampleStyle),
        label: EChartDataUtil.getBarSeriesLabel(sampleStyle)
      };
      series.push(seriesData);
    });
    return series;
  }

  /**
   * 获取图表提示tooltip
   */
  public getToolTip(): echarts.EChartOption.Tooltip {
    return {
      show: true,
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        axis: "x",
        shadowStyle: {
          shadowBlur: 0,
          opacity: 0
        }
      },
      backgroundColor: "#fff",
      textStyle: {
        color: "#b5b2b2"
      }
    };
  }

  public formatterToolTip(params: any, ticket: any, callback: any) {
    let tipString = `${params[0].axisValue}<br/>`; // 显示提示文字模板
    for (let i = 0, length = params.length; i < length; i++) {
      tipString += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background:${params[i].color}"></span>`;
      tipString += `${params[i].seriesName}: ${params[i].currentData}(${params[i].value}%)<br/>`;
    }
    return tipString;
  }
}
