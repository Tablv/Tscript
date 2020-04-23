import { BarConfig, BarChartOption } from "./Bar";
import ObjectUtil from "@/util/ObjectUtil";
import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";

/**
 * 图表类型
 */
export type BarStackChartOption = BarChartOption;

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      barStack: ObjectUtil.copy(BarConfig.templates.echarts.sampleStyle.bar)
    }
  }
};

/**
 * 菜单选项
 */
const menuOptions = ObjectUtil.copy(BarConfig.menuOptions);

/**
 * 创建菜单配置
 */
const createMenuConfig = {
  iconClass: "gw-iconfsux_tubiao_duijizhuzhuangtu",
  title: "堆积柱图",
  createType: ChartType.barStack,
  enable: true
};

/**
 * 配置项
 */
const config = ObjectUtil.copy(BarConfig.config);

export const BarStackConfig: ChartConfigItem = {
  templates,
  menuOptions,
  createMenuConfig,
  config
};
