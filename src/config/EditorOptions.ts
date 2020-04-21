import { ChartType } from "@/enums/ChartType";

/**
 * 编辑器部分
 */

// 可选图表选项
export const chartCreateOptions = [
  {
    iconClass: "gw-icon gw-iconfsux_tubiao_zhuzhuangtu1",
    desc: "柱状图",
    createType: ChartType.bar,
    enable: true
  },
  {
    iconClass: "gw-icon gw-iconfsux_tubiao_duijizhuzhuangtu",
    desc: "堆积柱图",
    createType: ChartType.barStack,
    enable: true
  },
  {
    iconClass: "gw-icon gw-iconfsux_tubiao_bingtu1",
    desc: "饼图",
    createType: ChartType.pie,
    enable: true
  },
  {
    iconClass: "gw-icon gw-iconfsux_zhexiantu",
    desc: "折线图",
    createType: ChartType.line,
    enable: true
  }
];

/**
 * 仪表盘集
 */
export const dashboardSetOptions: any = {
  terminalType: {
    selection: [
      { text: "PC", value: 0 },
      { text: "大屏幕", value: 1 },
      { text: "手机", value: 2 }
    ]
  }
};
