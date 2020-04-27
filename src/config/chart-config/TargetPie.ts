import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";
import ObjectUtil from "@/util/ObjectUtil";
import { PieConfig, PieChartOption } from "./Pie";
/**
 * 图表类型
 */
export type TargetPieChartOption = PieChartOption;

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      targetpie: ObjectUtil.copy(PieConfig.templates.echarts.sampleStyle.pie)
    }
  }
};

/**
 * 菜单选项
 */
const menuOptions = ObjectUtil.copy(PieConfig.menuOptions);

/**
 * 创建菜单配置
 */
const createMenuConfig = {
  iconClass: "gw-iconfsux_tubiao_baifenbihuantu",
  title: "指示器",
  createType: ChartType.targetpie,
  enable: true
};

/**
 * 配置项
 */
const config = ObjectUtil.copy(PieConfig.config);

export const TargetPieConfig: ChartConfigItem = {
  templates,
  menuOptions,
  createMenuConfig,
  config
};
