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
  };
  axisLabel: {
    interval: 0;
    rotate: 0;
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
          position: "top"
        },
        axisLabel: {
          interval: 0,
          rotate: 0
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
  iconClass: "gw-icon gw-iconfsux_tubiao_zhuzhuangtu1",
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
