import { ChartType } from "@/enums/ChartType";
import { ChartConfigItem } from "../ChartConfig";

/**
 * 图表类型
 */
export type PieChartOption = {
  decimals: {
    value: number;
    unit: String | number;
  };
  label: {
    show: boolean;
    position: String;
    color: String;
    fontSize: number;
    fontFamily: String;
  };
  centerConfig: {
    xAxias: string;
    yAxias: string;
  };
};

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      pie: {
        label: {
          show: false,
          position: "top",
          color: "#000",
          fontSize: 12,
          fontFamily: "Microsoft YaHei"
        },
        centerConfig: {
          xAxias: "50%",
          yAxias: "50%"
        }
      }
    }
  }
};

/**
 * 菜单选项
 */
const menuOptions = {
  label: {
    position: {
      selection: [
        { text: "外侧", value: "top" },
        { text: "内部", value: "inside" },
        { text: "中心", value: "center" }
      ]
    }
  }
};

/**
 * 创建菜单配置
 */
const createMenuConfig = {
  iconClass: "gw-iconfsux_tubiao_bingtu1",
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
