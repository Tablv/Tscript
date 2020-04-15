import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import { EChartsSampleStyle } from "@/model/view/dashboard/EChartsOption";
import EChartsService from "../EChartsService";
import warnConfigure from "./configure/WarnConfigure";
import { WARN_DEFAULT_VALUE } from "@/model/view/Warn";

export default function(result: AnalysisResults, dashboard: Dashboard) {
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

  style.xAxis = getXAxis(fieldNames, result, sampleStyle);
  style.yAxis = getYAxis();
  style.series = getSeries(fieldNames, result, sampleStyle);
  style.legend = getLegend(fieldNames);

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
function getXAxis(
  fieldNames: SplitedFieldNames,
  result: AnalysisResults,
  sampleStyle: EChartsSampleStyle
): Array<echarts.EChartOption.XAxis> {
  let xAxis: Array<echarts.EChartOption.XAxis> = [];

  // 遍历生成X轴
  fieldNames.dimensions.forEach(dimensionName => {
    const axisXData = {
      name: dimensionName,
      type: "category",
      data: getFieldDataArray(dimensionName, result),
      axisLabel: {
        interval: sampleStyle.bar ? sampleStyle.bar.axisLabel.interval : 0,
        rotate: sampleStyle.bar ? sampleStyle.bar.axisLabel.rotate : 0
      }
    } as echarts.EChartOption.XAxis;
    xAxis.push(axisXData);
  });

  return xAxis;
}

/**
 * 获取Y轴数据
 */
function getYAxis(): Array<echarts.EChartOption.YAxis> {
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
function getSeries(
  fieldNames: SplitedFieldNames,
  result: AnalysisResults,
  sampleStyle: EChartsSampleStyle
): Array<echarts.EChartOption.Series> {
  let series: Array<echarts.EChartOption.Series> = [];

  fieldNames.measures.forEach(measureName => {
    const seriesData = {
      name: measureName,
      type: "line",
      data: getFieldDataArray(measureName, result),
      barWidth: getBarWidth(sampleStyle),
      label: getSeriesLabel(sampleStyle)
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
function getLegend(fieldNames: SplitedFieldNames): echarts.EChartOption.Legend {
  const legend = {
    data: fieldNames.measures
  };
  return legend;
}

/**
 * 通过字段名，获取结果集内的数据数组
 *
 * @param fieldName 字段名
 * @param result 结果集
 */
function getFieldDataArray(
  fieldName: string,
  result: AnalysisResults
): Array<string | number> {
  let fieldArray: Array<string | number> = [];

  result.forEach(data => {
    fieldArray.push(data[fieldName]);
  });

  return fieldArray;
}

/**
 * 获取柱宽
 *
 * @param sampleStyle 样例样式
 */
function getBarWidth(sampleStyle: EChartsSampleStyle): string | undefined {
  return sampleStyle.bar
    ? sampleStyle.bar.width.value + sampleStyle.bar.width.unit
    : undefined;
}

function getSeriesLabel(
  sampleStyle: EChartsSampleStyle
): echarts.EChartOption.SeriesBar["label"] {
  return sampleStyle.bar
    ? {
        show: sampleStyle.bar.label.show,
        position: sampleStyle.bar.label.position
      }
    : {};
}
