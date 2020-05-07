import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";

/**
 * 图表类型
 */
export type LineChartOption = {
  decimals: {
    value: number;
    unit: String | number;
  };
  label:{
    show:boolean;
    position:String;
    color:String;
    fontSize:number;
    fontFamily:String;
  }
};

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      line: {
        decimals: {
          value: 0,
          unit: ""
        },
        label: {
          show: false,
          position: 'top',
          color: '#000',
          fontSize: 12,
          fontFamily: 'Microsoft YaHei'
        }
      }
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
  iconClass: "gw-iconfsux_zhexiantu",
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
