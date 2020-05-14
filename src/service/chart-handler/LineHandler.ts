import BarHandler from "./BarHandler";
import EChartDataUtil from "@/util/EChartDataUtil";

/**
 * 折线图处理
 */
export default class LineHandler extends BarHandler {
  /**
   * 获取X轴数据
   */
  public getXAxis(): Array<echarts.EChartOption.XAxis> {
    let xAxis: Array<echarts.EChartOption.XAxis> = [];

    // 遍历生成X轴
    this.fieldNames.dimensions.forEach(dimensionName => {
      const axisXData = {
        name: dimensionName,
        type: "category",
        data: EChartDataUtil.getDataByFieldName(dimensionName, this.result)
      } as echarts.EChartOption.XAxis;
      xAxis.push(axisXData);
    });

    return xAxis;
  }

  /**
   * 获取Series数据
   */
  public getSeries(): Array<echarts.EChartOption.Series> {
    let series: Array<echarts.EChartOption.Series> = [];

    this.fieldNames.measures.forEach(measureName => {
      const seriesData = {
        name: measureName,
        type: "line",
        label: {
          show: this.sampleStyle.label.show,
          position: this.sampleStyle.label.position,
          color: this.sampleStyle.label.color,
          fontSize: this.sampleStyle.label.fontSize,
          fontFamily: this.sampleStyle.label.fontFamily
        },
        data: EChartDataUtil.getDataByFieldName(measureName, this.result)
      };
      series.push(seriesData);
    });

    return series;
  }
}
