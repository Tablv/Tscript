import { ChartOption } from "@/config/ChartConfig";
import ObjectUtil from "@/util/ObjectUtil";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import Dashboard from "@/model/view/dashboard/Dashboard";
import GlobalHandler from "./chart-handler/GlobalHandler";
import handlerRegistry from "./HandlerRegistry";

export default function handleChart(
  result: AnalysisResults,
  dashboard: Dashboard
) {
  const customizedHandler = handlerRegistry[dashboard.visualData.type];

  if (!customizedHandler) {
    throw new Error("找不到对应图表类型的处理方法");
  }

  const sampleStyle = dashboard.echarts.sampleStyle[
    dashboard.visualData.type
  ] as ChartOption;

  let styleCustomized = customizedHandler.getChartHandleResult(
      result,
      dashboard,
      sampleStyle
    ),
    styleGlobal = GlobalHandler(result, dashboard),
    resultStyle = ObjectUtil.merge(styleCustomized, styleGlobal, true);

  return resultStyle;
}
