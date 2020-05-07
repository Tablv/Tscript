import { AnalysisResults } from "@/model/types/AnalysisResults";
import { SplitedFieldNames } from "../EChartsService";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import PieHandler from "./PieHandler";
import EChartsService from "../EChartsService";
import { RosePieChartOption } from "@/config/chart-config/RosePie";

/**
 * 玫瑰图处理
 */
export default class RosePieHandler extends PieHandler {
  public getChartHandleResult(
    result: AnalysisResults,
    dashboard: Dashboard,
    sampleStyle: RosePieChartOption
  ): echarts.EChartOption {
    let style: echarts.EChartOption = super.getChartHandleResult(
      result,
      dashboard,
      sampleStyle
    ) as echarts.EChartOption;

    if (ObjectUtil.isEmpty(result)) {
      return {};
    }

    // 存在数据时，继续处理
    const fieldNames: SplitedFieldNames = EChartsService.splitFieldNames(
      result[0],
      dashboard
    );

    style.series = this.getSeries(fieldNames, result);

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
    series = (super.getSeries(fieldNames, result) as Array<
      echarts.EChartOption.SeriesPie
    >).map(seriesData => {
      seriesData.roseType = "radius";
      return seriesData;
    });
    return series;
  }
}
