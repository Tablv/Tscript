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
        style.series = this.getSeries(fieldNames, result);
        style.radar = this.getRadar(fieldNames, result, sampleStyle);

        // console.log(JSON.stringify(style));


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
        sampleStyle: RadarChartOption
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
     */
    public getLegend(fieldNames: SplitedFieldNames): echarts.EChartOption.Legend {
        const legend = {
            data: fieldNames.measures
        };
        return legend;
    }

    /**
     * 
     * @param fieldNames 获取radar坐标
     * @param result 
     * @param sampleStyle 样例样式
     */

    getRadar(
        fieldNames: SplitedFieldNames,
        result: AnalysisResults,
        sampleStyle: RadarChartOption
    ): Array<echarts.EChartOption> {
        let radarData: any = {
            indicator: [],
        };
        fieldNames.dimensions.forEach(dimensionName => {
            result.forEach(data => {
                let obj = { name: data[dimensionName] };
                radarData.indicator.push(obj);
            });
        });
        return radarData;
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
        let seriesData: any = {
            type: "radar",
            data: []
        };
        fieldNames.measures.forEach(measureName => {
            seriesData.data.push(EChartDataUtil.getRadarDataByAxisName(
                measureName,
                result
            ));
        });
        series.push(seriesData);
        return series;
    }
}
