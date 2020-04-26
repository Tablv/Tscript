import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";
import ObjectUtil from "@/util/ObjectUtil";
import { PieConfig, PieChartOption } from "./Pie";
/**
 * 图表类型
 */
export type GaugeChartOption = PieChartOption;

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      gauge: ObjectUtil.copy(PieConfig.templates.echarts.sampleStyle.pie)
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
  iconClass: "gw-iconfsux_tubiao_yibiaopan",
  title: "仪表盘",
  createType: ChartType.guage,
  enable: true
};

/**
 * 配置项
 */
const config = ObjectUtil.copy(PieConfig.config);

export const GuageConfig: ChartConfigItem = {
  templates,
  menuOptions,
  createMenuConfig,
  config
};
