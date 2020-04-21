import { ChartConfigItem } from "../ChartConfig";

/**
 * 图表类型
 */
export type BiaxialChartOption = {};

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      biaxial: {}
    }
  }
};

/**
 * 菜单选项
 */
const menuOptions = {};

/**
 * 配置项
 */
const config = {
  doubleMeasures: true,
  changeLimit: []
};

export const BiaxialConfig: ChartConfigItem = {
  templates,
  menuOptions,
  config
};
