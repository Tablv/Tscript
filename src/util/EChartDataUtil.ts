import { AnalysisResults } from "@/model/types/AnalysisResults";
import { EChartsSampleStyle } from "@/model/view/dashboard/EChartsOption";

export default class EChartServiceUtil {
  /**
   * 通过字段名，获取结果集内的数据数组
   *
   * @param fieldName 字段名
   * @param result 结果集
   */
  public static getFieldDataArray(
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
  public static getBarWidth(
    sampleStyle: EChartsSampleStyle
  ): string | undefined {
    return sampleStyle.bar
      ? sampleStyle.bar.width.value + sampleStyle.bar.width.unit
      : undefined;
  }

  public static getSeriesLabel(
    sampleStyle: EChartsSampleStyle
  ): echarts.EChartOption.SeriesBar["label"] {
    return sampleStyle.bar
      ? {
          show: sampleStyle.bar.label.show,
          position: sampleStyle.bar.label.position
        }
      : {};
  }

  /**
   * 通过字段名，获取结果集内的数据数组
   *
   * @param dimensionName 维度字段名
   * @param measureName 度量字段名
   * @param result 结果集
   */
  public static getPieFieldDataArray(
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
}
