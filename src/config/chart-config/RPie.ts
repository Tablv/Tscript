import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";
import ObjectUtil from "@/util/ObjectUtil";
import { PieConfig, PieChartOption} from './Pie';
/**
 * 图表类型
 */
export type RPieChartOption = PieChartOption;

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      pie:ObjectUtil.copy(PieConfig.templates.echarts.sampleStyle.pie)
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
  iconClass: "gw-icon gw-iconfsux_tubiao_baifenbihuantu", 
  title: "环形图",
  createType: ChartType.rpie,
  enable: true
};

/**
 * 配置项
 */
const config = ObjectUtil.copy(PieConfig.config);

export const RPieConfig: ChartConfigItem = {
  templates,
  menuOptions,
  createMenuConfig,
  config
};
