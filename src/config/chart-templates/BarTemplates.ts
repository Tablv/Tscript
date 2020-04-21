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

export const BarTemplates = {
  templates,
  menuOptions
};
