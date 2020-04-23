import { BarStackConfig, BarStackChartOption } from "./BarStack";
import ObjectUtil from "@/util/ObjectUtil";
import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";

/**
 * 图表类型
 */
export type BarPercentageChartOption = BarStackChartOption;

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      barPercentage: ObjectUtil.copy(
        BarStackConfig.templates.echarts.sampleStyle.barStack
      )
    }
  }
};

/**
 * 菜单选项
 */
const menuOptions = ObjectUtil.copy(BarStackConfig.menuOptions);

/**
 * 创建菜单配置
 */
const createMenuConfig = {
  iconClass: "gw-iconfsux_tubiao_baifenbiduijizhuzhuangtu",
  title: "百分比堆积柱图",
  createType: ChartType.barPercentage,
  enable: true
};

/**
 * 配置项
 */
const config = ObjectUtil.copy(BarStackConfig.config);

export const BarPercentageConfig: ChartConfigItem = {
  templates,
  menuOptions,
  createMenuConfig,
  config
};
