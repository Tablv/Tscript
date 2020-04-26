import { AnalysisResults } from "@/model/types/AnalysisResults";
import { SplitedFieldNames } from "../EChartsService";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import PieChartOption from "./PieHandler";
import EChartsService from "../EChartsService";
import { SunPieChartOption } from "@/config/chart-config/SunPie";
import EChartDataUtil from "@/util/EChartDataUtil";

/**
 * 旭日图处理
 */
export default class SunPieHandler extends PieChartOption {
    public getChartHandleResult(
        result: AnalysisResults,
        dashboard: Dashboard,
        sampleStyle: SunPieChartOption
    ): echarts.EChartOption {
        let style: echarts.EChartOption = super.getChartHandleResult(
            result,
            dashboard,
            sampleStyle
        );

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
        fieldNames.dimensions.forEach(dimensionName => {
            fieldNames.measures.forEach(measureName => {
                const seriesData = {
                    type: "sunburst",
                    radius: ["15%", "80%"],
                    sort: null,
                    highlightPolicy: 'ancestor',
                    levels: [],
                    label: {
                        rotate: 'radial'
                    },
                    data: EChartDataUtil.getDataByAxisName(
                        dimensionName,
                        measureName,
                        result
                    )
                } as echarts.EChartOption.Series;
                series.push(seriesData);
            });
        });
        return series;
    }
}
