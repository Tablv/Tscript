import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import EChartDataUtil from "@/util/EChartDataUtil";
import { BarChartOption } from "@/config/chart-config/Bar";
import BarPercentageHandler from "./BarPercentageHandler";

/**
 * 百分比堆积条图处理
 */
export default class HBarPercentageHandler extends BarPercentageHandler {
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
    ] as Array<echarts.EChartOption.XAxis>;
  }

  /**
   * 获取Y轴数据
   */
  public getYAxis(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: BarChartOption
  ): Array<echarts.EChartOption.YAxis> {
    let yAxis: Array<echarts.EChartOption.YAxis> = [];
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
      } as echarts.EChartOption.YAxis;
      yAxis.push(axisXData);
    });

    return yAxis;
  }
}
