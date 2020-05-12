import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import EChartDataUtil from "@/util/EChartDataUtil";
import BarStackHandler from "./BarStackHandler";
import { BarChartOption } from "@/config/chart-config/Bar";
import ObjectUtil from "@/util/ObjectUtil";

/**
 * 百分比堆积柱图处理
 */
export default class BarPercentageHandler extends BarStackHandler {
  /**
   * 获取Y轴数据
   */
  public getYAxis(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: BarChartOption
  ): Array<echarts.EChartOption.YAxis> {
    return super
      .getYAxis(fieldNames, result, sampleStyle)
      .map((yAxis: echarts.EChartOption.YAxis) => {
        return ObjectUtil.merge(yAxis, {
          min: 0,
          max: 100,
          axisLabel: {
            show: true,
            formatter: "{value} %"
          },
          show: true
        });
      });
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
    result.forEach(item => {
      item.sum = fieldNames.measures.reduce(
        (sum: number, name: any) => sum + Number(item[name]),
        0
      );
    });
    fieldNames.measures.forEach(measureName => {
      const seriesData = {
        name: measureName,
        type: "bar",
        stack: "barPercentage",
        data: EChartDataUtil.getPercentageArray(
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
}
