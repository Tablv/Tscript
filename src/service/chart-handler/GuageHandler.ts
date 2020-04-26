import { AnalysisResults } from "@/model/types/AnalysisResults";
import { SplitedFieldNames } from "../EChartsService";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import EChartsService from "../EChartsService";
import ChartHandler from "../interfaces/ChartHandler";
import { PieChartOption } from "@/config/chart-config/Pie";

/**
 * 仪表盘处理
 */
export default class GuageHandler implements ChartHandler {
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

    style.series = this.getSeries(fieldNames, result);
    style.tooltip = this.getTooltips();

    return style;
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

    fieldNames.measures.forEach(measures => {
      const seriesData = {
        type: "gauge",
        detail: { formatter: "{value}" },
        data: result.map(item => ({
          name: measures,
          value: item[measures]
        }))
      } as echarts.EChartOption.Series;
      series.push(seriesData);
    });

    return series;
  }

  // 提示信息
  getTooltips() {
    return {
      formatter: "{b} : {c}"
    };
  }
}
