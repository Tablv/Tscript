import { AnalysisResults } from "@/model/types/AnalysisResults";
import { SplitedFieldNames } from "../EChartsService";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import EChartsService from "../EChartsService";
import ChartHandler from "../interfaces/ChartHandler";
import EChartDataUtil from "@/util/EChartDataUtil";
import { PieChartOption } from "@/config/chart-config/Pie";

/**
 * 饼图处理
 */
export default class PieHandler implements ChartHandler {
  public getChartHandleResult(
    result: AnalysisResults,
    dashboard: Dashboard,
    sampleStyle: PieChartOption
  ): echarts.EChartOption {
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

    style.legend = this.getLegend(fieldNames, result);
    style.series = this.getSeries(fieldNames, result);

    return style;
  }

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
    sampleStyle: PieChartOption
  ): Array<echarts.EChartOption.XAxis> {
    return [] as Array<echarts.EChartOption.XAxis>;
  }

  /**
   * 获取Y轴数据
   */
  getYAxis(): Array<echarts.EChartOption.YAxis> {
    return [] as Array<echarts.EChartOption.YAxis>;
  }

  /**
   * 获取图例
   *
   * @param fieldNames 分析结果划分数据
   * @param result 分析结果
   */
  public getLegend(
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
  public getSeries(
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
          data: EChartDataUtil.getPieFieldDataArray(
            dimensionName,
            measureName,
            result
          )
        } as echarts.EChartOption.Series;
        series.push(seriesData);
      });
    });

    return series;
  }
}
