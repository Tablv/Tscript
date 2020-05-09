import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";
import ObjectUtil from "@/util/ObjectUtil";
import { PieConfig, PieChartOption } from "./Pie";

/**
 * 图表类型
 */
export type RadarChartOption = PieChartOption;

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      radar: ObjectUtil.copy(PieConfig.templates.echarts.sampleStyle.pie)
    }
  }
};

/**
 * 菜单选项
 */
// const menuOptions = ObjectUtil.copy(PieConfig.menuOptions);
const menuOptions = {
  label: {
    position: {
      selection: [
        { text: "顶部", value: "top" },
        { text: "内部", value: "inside" }
      ]
    }
  }
};

/**
 * 创建菜单配置
 */
const createMenuConfig = {
  iconClass: "gw-iconfsux_tubiao_leidatu",
  title: "雷达图",
  createType: ChartType.radar,
  enable: true
};

/**
 * 配置项
 */
const config = ObjectUtil.copy(PieConfig.config);

export const RadarConfig: ChartConfigItem = {
  templates,
  menuOptions,
  createMenuConfig,
  config
};
