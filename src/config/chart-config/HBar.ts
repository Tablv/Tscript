import ObjectUtil from "@/util/ObjectUtil";
import { BarConfig, BarChartOption } from "./Bar";
import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";

/**
 * 图表类型
 */
export type HBarChartOption = BarChartOption;

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      hbar: ObjectUtil.copy(BarConfig.templates.echarts.sampleStyle.bar)
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
  iconClass: "gw-iconfsux_tubiao_zhuzhuangtu",
  title: "条图",
  createType: ChartType.hbar,
  enable: true
};

/**
 * 配置项
 */
const config = ObjectUtil.copy(BarConfig.config);

export const HBarConfig: ChartConfigItem = {
  templates,
  menuOptions,
  createMenuConfig,
  config
};
