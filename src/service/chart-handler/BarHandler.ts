import { SplitedFieldNames } from "../EChartsService";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import EChartsService from "../EChartsService";
import warnConfigure from "./configure/WarnConfigure";
import { WARN_DEFAULT_VALUE } from "@/model/view/Warn";
import { ChartHandler } from "../interfaces/ChartHandler";
import EChartDataUtil from "@/util/EChartDataUtil";
import { BarChartOption } from "@/model/view/dashboard/ChartOption";

/**
 * 柱图处理
 */
export default class BarHandler implements ChartHandler {
  /**
   * 分析字段
   */
  public fieldNames: SplitedFieldNames;
  /**
   * 数据设置
   * 后面有其他的设置也加入到这里
   * @param result 分析结果
   * @param dashboard 仪表盘数据
   * @param sampleStyle 样例样式
   */
  constructor(
    public result: AnalysisResults,
    public dashboard: Dashboard,
    public sampleStyle: BarChartOption
  ) {
    this.fieldNames = EChartsService.splitFieldNames(
      this.result[0],
      this.dashboard
    );
  }

  /**
   * 获取图表的处理结果
   */
  public getStyle(): echarts.EChartOption {
    let style: echarts.EChartOption = {};

    if (ObjectUtil.isEmpty(this.result)) {
      style.xAxis = [];
      style.yAxis = [];
      style.series = [];
      return {};
    }

    style.xAxis = this.getXAxis();
    style.yAxis = this.getYAxis();
    style.series = this.getSeries();
    style.legend = this.getLegend();

    /**
     * 预警处理
     */
    if (this.dashboard.analysis.warn.id !== WARN_DEFAULT_VALUE) {
      warnConfigure(this.dashboard, style);
    }

    return style;
  }

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
        data: EChartDataUtil.getDataByFieldName(dimensionName, this.result),
        axisLabel: {
          interval: this.sampleStyle.axisLabel.interval || 0,
          rotate: this.sampleStyle.axisLabel.rotate || 0
        }
      } as echarts.EChartOption.XAxis;
      xAxis.push(axisXData);
    });
    return xAxis;
  }

  /**
   * 获取Y轴数据
   */
  public getYAxis(): Array<echarts.EChartOption.YAxis> {
    return [
      {
        type: "value",
        name: this.sampleStyle.decimals.unit
      }
    ] as Array<echarts.EChartOption.YAxis>;
  }

  /**
   * 获取Series数据
   */
  public getSeries(): Array<echarts.EChartOption.Series> {
    let series: Array<echarts.EChartOption.Series> = [];

    this.fieldNames.measures.forEach(measureName => {
      const seriesData = {
        name: measureName,
        type: "bar",
        data: EChartDataUtil.getDataByFieldName(
          measureName,
          this.result,
          this.sampleStyle.decimals
        ),
        barWidth: EChartDataUtil.getBarWidth(this.sampleStyle),
        label: EChartDataUtil.getBarSeriesLabel(this.sampleStyle)
      };
      series.push(seriesData);
    });

    return series;
  }

  /**
   * 获取图例
   */
  public getLegend(): echarts.EChartOption.Legend {
    const legend = {
      data: this.fieldNames.measures
    };
    return legend;
  }
}
