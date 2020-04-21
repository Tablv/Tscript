import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";

/**
 * 图表类型
 */
export type LineChartOption = {};

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      line: {}
    }
  }
};

/**
 * 菜单选项
 */
const menuOptions = {};

/**
 * 创建菜单配置
 */
const createMenuConfig = {
  iconClass: "gw-icon gw-iconfsux_zhexiantu",
  title: "折线图",
  createType: ChartType.line,
  enable: true
};

/**
 * 配置项
 */
const config = {
  warnable: true,
  changeLimit: []
};

export const LineConfig: ChartConfigItem = {
  templates,
  menuOptions,
  createMenuConfig,
  config
};
