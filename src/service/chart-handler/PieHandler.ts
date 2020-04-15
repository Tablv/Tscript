import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import EChartsService from "../EChartsService";

export default function(result: AnalysisResults, dashboard: Dashboard) {
  let style: echarts.EChartOption = {};

  if (ObjectUtil.isEmpty(result)) {
    style.series = [];
    return {};
  }

  // 存在数据时，继续处理
  const fieldNames: SplitedFieldNames = EChartsService.splitFieldNames(
    result[0],
    dashboard
  );

  style.legend = getLegend(fieldNames, result);
  style.series = getSeries(fieldNames, result);

  return style;
}

/**
 * 获取图例
 *
 * @param fieldNames 分析结果划分数据
 * @param result 分析结果
 */
function getLegend(
  fieldNames: SplitedFieldNames,
  result: AnalysisResults
): echarts.EChartOption.Legend {
  let legend: echarts.EChartOption.Legend = {},
    legendData: Array<string> = [];

  fieldNames.dimensions.forEach(dimensionName => {
    result.forEach(data => {
      const dimension = data[dimensionName] as string;
      legendData.push(dimension);
    });
  });

  legend.data = legendData;

  return legend;
}

/**
 * 获取Series数据
 *
 * @param fieldNames 分析结果划分数据
 * @param result 分析结果
 */
function getSeries(
  fieldNames: SplitedFieldNames,
  result: AnalysisResults
): Array<echarts.EChartOption.Series> {
  let series: Array<echarts.EChartOption.Series> = [];

  fieldNames.dimensions.forEach(dimensionName => {
    fieldNames.measures.forEach(measureName => {
      const seriesData = {
        type: "pie",
        label: {
          normal: {
            show: true,
            formatter: "{b} - {d}%"
          }
        },
        data: getFieldDataArray(dimensionName, measureName, result)
      } as echarts.EChartOption.Series;
      series.push(seriesData);
    });
  });

  return series;
}

/**
 * 通过字段名，获取结果集内的数据数组
 *
 * @param dimensionName 维度字段名
 * @param measureName 度量字段名
 * @param result 结果集
 */
function getFieldDataArray(
  dimensionName: string,
  measureName: string,
  result: AnalysisResults
): echarts.EChartOption.SeriesBar["data"] {
  let fieldArray: Array<echarts.EChartOption.SeriesBar.DataObject> = [];

  result.forEach(data => {
    const fieldObj: echarts.EChartOption.SeriesBar.DataObject = {
      name: data[dimensionName] as string,
      value: data[measureName] as number
    };
    fieldArray.push(fieldObj);
  });

  return fieldArray;
}
