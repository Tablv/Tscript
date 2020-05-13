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
  // 仪表板类型
  const chartType = dashboard.visualData.type;
  // 仪表板对应的处理对象
  const customizedHandler = handlerRegistry[chartType];

  if (!customizedHandler) {
    throw new Error("找不到对应图表类型的处理方法");
  }

  const sampleStyle = dashboard.echarts.sampleStyle[chartType] as ChartOption;
  let styleCustomized = customizedHandler.getChartHandleResult(
      result,
      dashboard,
      sampleStyle
    ),
    styleGlobal = GlobalHandler(result, dashboard),
    resultStyle = ObjectUtil.merge(styleCustomized, styleGlobal);

  return resultStyle;
}
