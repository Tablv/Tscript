import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";

/**
 * 图表类型
 */
export type PieChartOption = {};

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      pie: {}
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
  iconClass: "gw-icon gw-iconfsux_tubiao_bingtu1",
  title: "饼图",
  createType: ChartType.pie,
  enable: true
};

/**
 * 配置项
 */
const config = {
  warnable: false,
  changeLimit: []
};

export const PieConfig: ChartConfigItem = {
  templates,
  menuOptions,
  createMenuConfig,
  config
};
