import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import { BarChartOption } from "@/config/chart-config/Bar";
import ObjectUtil from "@/util/ObjectUtil";
import HBarStackHandler from "./HBarStackHandler";
import EChartDataUtil from "@/util/EChartDataUtil";

/**
 * 百分比堆积条图处理
 */
export default class HBarPercentageHandler extends HBarStackHandler {
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
    return super
      .getXAxis(fieldNames, result, sampleStyle)
      .map((xAxis: echarts.EChartOption.XAxis) => {
        return ObjectUtil.merge(xAxis, {
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
        stack: "hbarPercentage",
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
