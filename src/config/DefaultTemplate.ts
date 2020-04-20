import { generalChartStyleOptions } from "./Options";
import { WarnDisplayType } from "@/enums/WarnType";
import { SortType } from "@/enums/SortType";
import { ChartType } from "@/enums/ChartType";
import ObjectUtil from "@/util/ObjectUtil";
import UUID from "@/util/UUID";
import Dashboard from "@/model/view/dashboard/Dashboard";
import DashboardSet from "@/model/view/DashboardSet";
import { BackgroundType } from "@/enums/DashboardSet";
import { FILTER_DEFAULT_VALUE } from "@/model/view/Filter";
import { SORT_DEFAULT_VALUE } from "@/model/view/Sort";
import { WARN_DEFAULT_VALUE } from "@/model/view/Warn";

/**
 * 仪表盘集通用初始化数据
 */
export const defaultDashboardSet: DashboardSet = {
  terminalType: 0,
  widthRatio: 16,
  heightRatio: 9,
  canvasSetting: {
    background: {
      type: BackgroundType.color,
      color: "#fff",
      url: ""
    }
  },
  tempParams: {
    ratio: 80, // 1 : 80px
    zoom: 1
  }
};

/**
 * 仪表盘通用初始化数据
 */
export const generalDataTemplate: any = {
  analysis: {
    datasetId: null,
    dimensions: [],
    measures: [],
    fromTable: null,
    where: [],
    order: [],
    isReact: false,
    joinRelation: [],
    resultStyle: {},
    filter: {
      id: FILTER_DEFAULT_VALUE,
      data: []
    },
    sort: {
      id: SORT_DEFAULT_VALUE,
      type: SortType.result,
      data: [],
      custom: []
    },
    warn: {
      id: WARN_DEFAULT_VALUE,
      color: "#FF0000",
      displayType: WarnDisplayType.NONE,
      value: []
    }
  },
  events: {
    triggerMethod: "",
    triggerEvent: "",
    eventOptions: {}
  },
  staticData: {
    json: {
      enable: false,
      data: ""
    },
    sql: {
      enable: false,
      data: ""
    }
  },
  visualData: {
    grid: [10, 10],
    width: 400,
    height: 300
  },
  echarts: {
    sampleStyle: {
      global: {
        color: generalChartStyleOptions.color.selection[0].colors,
        grid: {
          top: {
            value: 50,
            unit: ""
          },
          left: {
            value: 50,
            unit: ""
          },
          right: {
            value: 50,
            unit: ""
          },
          bottom: {
            value: 50,
            unit: ""
          }
        }
      }
    },
    title: {
      text: "图表",
      left: "left",
      textStyle: {
        color: "#000",
        fontFamily: "Microsoft YaHei",
        fontSize: 18
      }
    },
    grid: {
      show: false,
      containLabel: true
    },
    legend: {
      show: true,
      orient: "horizontal",
      textStyle: {
        fontSize: 12
      },
      data: [],
      left: "80%",
      top: "5%"
    },
    series: []
  }
};

/**
 * 各类型仪表盘自定义初始化数据
 */
export const customDataTemplates: any = {
  bar: {
    visualData: {
      type: ChartType.bar
    },
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
  },
  pie: {
    visualData: {
      type: ChartType.pie
    },
    echarts: {
      sampleStyle: {
        pie: {}
      }
    }
  },
  line: {
    visualData: {
      type: ChartType.line
    },
    echarts: {
      sampleStyle: {
        line: {}
      }
    }
  },
  biaxial: {
    visualData: {
      type: ChartType.biaxial
    },
    echarts: {
      sampleStyle: {
        biaxial: {}
      }
    }
  },
  barStack: {
    visualData: {
      type: ChartType.barStack
    },
    echarts: {
      sampleStyle: {
        barStack: {
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
  }
};

/**
 * 初始化模板类
 */
export default class DefaultTemplate {
  /**
   * 配置和选项缓存
   */
  private static configCache: Map<ChartType, Dashboard> = new Map();

  /**
   * 获取图表默认配置
   *
   * @param chartType 图表类型
   */
  public static getDefaultConfig(chartType: ChartType): Dashboard {
    // 读取缓存
    let cache = this.configCache.get(chartType);
    if (cache !== undefined) {
      return cache;
    }

    // 合并数据
    let generalData = generalDataTemplate,
      customData = customDataTemplates[chartType],
      defaultConfig = ObjectUtil.merge(generalData, customData, true);

    // 保存缓存
    this.configCache.set(chartType, defaultConfig);

    return defaultConfig;
  }

  /**
   * 获取仪表盘可选配置
   *
   * @param chartType 图表类型
   */
  public static getInitData(chartType: ChartType): Dashboard {
    let initData = this.getDefaultConfig(chartType);

    initData.id = UUID.generate();

    return initData;
  }
}
