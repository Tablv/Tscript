import ObjectUtil from "@/util/ObjectUtil";
import { HBarStackConfig, HBarStackChartOption } from "./HBarStack";
import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";

/**
 * 图表类型 百分比堆积条图
 */
export type HBarPercentageChartOption = HBarStackChartOption;

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      hbarPercentage: ObjectUtil.copy(
        HBarStackConfig.templates.echarts.sampleStyle.hbarStack
      )
    }
  }
};

/**
 * 菜单选项
 */
const menuOptions = ObjectUtil.copy(HBarStackConfig.menuOptions);

/**
 * 创建菜单配置
 */
const createMenuConfig = {
  iconClass: "gw-iconfsux_tubiao_baifenbiduijitiaoxingtu",
  title: "百分比堆积条图",
  createType: ChartType.hbarPercentage,
  enable: true
};

/**
 * 配置项
 */
const config = ObjectUtil.copy(HBarStackConfig.config);

export const HBarPercentageConfig: ChartConfigItem = {
  templates,
  menuOptions,
  createMenuConfig,
  config
};
