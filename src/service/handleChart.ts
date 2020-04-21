import ObjectUtil from "@/util/ObjectUtil";
import { AnalysisResults } from "@/model/types/AnalysisResults";
import Dashboard from "@/model/view/dashboard/Dashboard";
import GlobalHandler from "./chart-handler/GlobalHandler";
import handlerRegistry from "./chart-handler/HandlerRegistry";

export default function handleChart(
  result: AnalysisResults,
  dashboard: Dashboard
) {
  const customizedHandler = handlerRegistry[dashboard.visualData.type];

  if (!customizedHandler) {
    throw new Error("找不到对应图表类型的处理方法");
  }

  let styleCustomized = customizedHandler.getChartHandleResult(
      result,
      dashboard
    ),
    styleGlobal = GlobalHandler(result, dashboard),
    resultStyle = ObjectUtil.merge(styleCustomized, styleGlobal, true);

  return resultStyle;
}
