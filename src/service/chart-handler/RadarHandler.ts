import { AnalysisResults } from "@/model/types/AnalysisResults";
import { SplitedFieldNames } from "../EChartsService";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import EChartsService from "../EChartsService";
import ChartHandler from "../interfaces/ChartHandler";
import EChartDataUtil from "@/util/EChartDataUtil";
import { RadarChartOption } from "@/config/chart-config/Radar";

/**
 * 雷达图处理
 */
export default class RadarHandler implements ChartHandler {
  public getChartHandleResult(
    result: AnalysisResults,
    dashboard: Dashboard,
    sampleStyle: RadarChartOption
  ): echarts.EChartOption {
    let style: echarts.EChartOption = {};

    if (ObjectUtil.isEmpty(result)) {
      style.series = [];
      style.radar = {};
      return {};
    }

    // 存在数据时，继续处理
    const fieldNames: SplitedFieldNames = EChartsService.splitFieldNames(
      result[0],
      dashboard
    );

    style.legend = this.getLegend(fieldNames);
    style.series = this.getSeries(fieldNames, result, sampleStyle);
    style.radar = this.getRadar(fieldNames, result);
    return style;
  }

  /**
   * 获取图例
   *
   * @param fieldNames 分析结果划分数据
   */
  public getLegend(fieldNames: SplitedFieldNames): echarts.EChartOption.Legend {
    const legend = {
      data: fieldNames.measures
    };
    return legend;
  }

  /**
   * 获取radar坐标
   * @param fieldNames
   * @param result
   *
   */

  getRadar(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults
  ): echarts.EChartOption.SeriesRadar.DataObject {
    let radarData: any = {
      indicator: []
    };
    fieldNames.dimensions.forEach(dimensionName => {
      result.forEach(data => {
        const radarObj = {
          name: data[dimensionName]
        };
        radarData.indicator.push(radarObj);
      });
    });
    return radarData as echarts.EChartOption.SeriesRadar.DataObject;
  }

  /**
   * 获取Series数据
   *
   * @param fieldNames 分析结果划分数据
   * @param result 分析结果
   */
  public getSeries(
    fieldNames: SplitedFieldNames,
    result: AnalysisResults,
    sampleStyle: RadarChartOption
  ): Array<echarts.EChartOption.SeriesRadar> {
    return [
      {
        type: "radar",
        label: {
          show: sampleStyle.label.show,
          position: sampleStyle.label.position,
          color: sampleStyle.label.color,
          fontSize: sampleStyle.label.fontSize,
          fontFamily: sampleStyle.label.fontFamily
        },
        data: fieldNames.measures.map(measureName =>
          EChartDataUtil.getRadarDataByAxisName(measureName, result)
        )
      }
    ] as Array<echarts.EChartOption.SeriesRadar>;
  }
}
