import ObjectUtil from "@/util/ObjectUtil";
import { HBarConfig, HBarChartOption } from "./HBar";
import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";

/**
 * 图表类型
 */
export type HBarStackChartOption = HBarChartOption;

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      hbar: ObjectUtil.copy(HBarConfig.templates.echarts.sampleStyle.bar)
    }
  }
};

/**
 * 菜单选项
 */
const menuOptions = ObjectUtil.copy(HBarConfig.menuOptions);

/**
 * 创建菜单配置
 */
const createMenuConfig = {
  iconClass: "gw-iconfsux_tubiao_duijizhuzhuangtu1",
  title: "堆积条图",
  createType: ChartType.hbarStack,
  enable: true
};

/**
 * 配置项
 */
const config = ObjectUtil.copy(HBarConfig.config);

export const HBarStackConfig: ChartConfigItem = {
  templates,
  menuOptions,
  createMenuConfig,
  config
};
