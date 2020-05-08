import { ChartOption } from "@/config/ChartConfig";
import { ChartConfigItem } from "@/config/ChartConfig";
import { ChartType } from "@/enums/ChartType";

/**
 * 图表类型
 */
export type BarChartOption = ChartOption & {
  width: {
    value: number;
    unit: string; // '%'  or  '' (px)
  };
  label: {
    show: boolean;
    position: string; // 'top' 'left' 'right' 'bottom' 'inside'
    color: string;
    fontSize: number;
    fontFamily: string;
  };
  axisLabel: {
    interval: 0;
    rotate: 0;
  };
  decimals: {
    value: number;
    unit: String | number;
  };
};

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      bar: {
        width: {
          value: 13,
          unit: ""
        },
        label: {
          show: false,
          position: "top",
          color: "#000",
          fontFamily: "Microsoft YaHei",
          fontSize: 12
        },
        axisLabel: {
          interval: 0,
          rotate: 0
        },
        decimals: {
          value: 0,
          unit: ""
        }
      }
    }
  }
};

/**
 * 菜单选项
 */
const menuOptions = {
  series: {
    barWidth: {
      unit: {
        selection: [
          { text: "px", value: "" },
          { text: "%", value: "%" }
        ]
      }
    },
    barLabel: {
      position: {
        selection: [
          { text: "顶部", value: "top" },
          { text: "内部", value: "inside" }
        ]
      }
    }
  }
};

/**
 * 创建菜单配置
 */
const createMenuConfig = {
  iconClass: "gw-iconfsux_tubiao_zhuzhuangtu1",
  title: "柱状图",
  createType: ChartType.bar,
  enable: true
};

/**
 * 配置项
 */
const config = {
  warnable: true,
  changeLimit: []
};

export const BarConfig: ChartConfigItem = {
  templates,
  menuOptions,
  config,
  createMenuConfig
};
