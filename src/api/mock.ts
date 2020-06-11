/**
 * Axios 请求
 */
import AxiosUtil from "@/util/AxiosUtil";
import ObjectUtil from "@/util/ObjectUtil";

import AnalysisDTO from "glaway-bi-model/params/AnalysisDTO";
import DashboardSet from "glaway-bi-model/view/DashboardSet";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { BackgroundType } from "glaway-bi-model/enums/DashboardSet";

const API = {
  /**
   * 数据集
   */
  findDatasetGroup: "/datasetGroup/findAll",
  findDataset: "/dataset/findOne",

  /**
   * 表关系
   */
  findTables: "/dashboard/container/loadCube",

  /**
   * 分析
   */
  analysis: {
    build: "/api/v1/build",
    sql: "/api/v1/s"
  },

  /**
   * 仪表盘
   */
  findDashboard: "/dashboard/findBySetId",
  saveDashboard: "/dashboard/save",

  /**
   * 仪表盘集
   */
  findDashboardSet: "/dashboard/container",
  saveDashboardSet: "/dashboardSet/update",

  /**
   * 分享
   */
  findShare: "/shareAdmin/getShareData",
  saveShare: "/shareAdmin/save"
};

let mockList = [
  {
    id: "6cba940665594ede989f696582313dde",
    visualData: {
      grid: [10, 10],
      width: 640,
      position: {
        x: 0,
        y: 0,
        z: 1
      },
      type: "bar",
      height: 290
    },
    echarts: {
      grid: {
        show: false,
        containLabel: true
      },
      legend: {
        orient: "horizontal",
        data: [],
        top: "30",
        show: false,
        textStyle: {
          fontSize: 12
        },
        right: "10%"
      },
      series: [],
      title: {
        left: "center",
        text: "人员编制分布",
        textStyle: {
          fontFamily: "Microsoft YaHei",
          color: "#000",
          fontSize: 18
        }
      },
      sampleStyle: {
        bar: {
          axisLabel: {
            rotate: 18,
            interval: 0
          },
          width: {
            unit: "",
            value: 23
          },
          label: {
            show: false,
            position: "top"
          }
        },
        global: {
          color: [
            "#118DFF",
            "#12239E",
            "#E66C37",
            "#6B007B",
            "#E044A7",
            "#744EC2",
            "#D9B300",
            "#D64550"
          ],
          grid: {
            top: {
              unit: "",
              value: 60
            },
            left: {
              unit: "",
              value: 50
            },
            bottom: {
              unit: "",
              value: 30
            },
            right: {
              unit: "",
              value: 50
            }
          }
        }
      }
    },
    staticData: {
      json: {
        data: "",
        enable: false
      },
      sql: {
        data: "",
        enable: false
      }
    },
    analysis: {
      resultStyle: {},
      isReact: false,
      joinRelation: [],
      sort: {
        data: [],
        custom: [],
        id: "NONE",
        type: 0
      },
      fromTable: {
        schema: "xu.bidemo",
        name: "hr",
        alias: "G4if7K8b9c",
        datasetId: "fe1afce26eaa4a3591a04125522b17db",
        id: "00cd45a95f1f439ba1573669856f2df7"
      },
      filter: {
        data: [],
        id: "DEFAULT"
      },
      warn: {
        displayType: 0,
        color: "#FF0000",
        id: "NONE",
        value: []
      },
      resultTmp: [],
      measures: [
        {
          func: ["count"],
          alias: "ID",
          id: "caf4dab8b11f48bd801b44f7c35ca7c8",
          tableAlias: "G4if7K8b9c",
          type: "y",
          tableName: "hr",
          columnName: "ID",
          group: 0
        }
      ],
      datasetId: "fe1afce26eaa4a3591a04125522b17db",
      where: [],
      dimensions: [
        {
          func: [],
          alias: "BIANZHI",
          id: "ced1201275674ac69eecd7878573cf9e",
          tableAlias: "G4if7K8b9c",
          type: "x",
          tableName: "hr",
          columnName: "BIANZHI",
          group: 0
        }
      ],
      order: []
    },
    events: {
      triggerEvent: "",
      triggerMethod: "",
      eventOptions: {}
    }
  }
];

let mockData = [
  {
    BIANZHI: "事业",
    ID: 34
  },
  {
    BIANZHI: "企业",
    ID: 34
  },
  {
    BIANZHI: "返聘",
    ID: 34
  },
  {
    BIANZHI: "劳务",
    ID: 20
  },
  {
    BIANZHI: "其他",
    ID: 20
  }
];

export const AxiosRequest = {
  /**
   * 数据集
   */
  dataset: {
    // 查找数据集
    findGroup: () =>
      AxiosUtil.get(API.findDatasetGroup)
        .then(res =>
          res.success
            ? Promise.resolve(res.result)
            : Promise.reject("加载数据集出错")
        )
        .catch(err => Promise.reject(err)),

    // 查找数据集
    find: (groupId: string) =>
      AxiosUtil.get(API.findDataset, { groupId })
        .then(res =>
          res.success
            ? Promise.resolve(res.result)
            : Promise.reject("加载数据集出错")
        )
        .catch(err => Promise.reject(err))
  },

  /**
   * 表关系
   */
  table: {
    // 查找表信息
    find: (datasetId: string) =>
      AxiosUtil.get(API.findTables, { datasetId })
        .then(res => {
          let loadSuccess = res.success && res.result;
          return loadSuccess
            ? Promise.resolve(res.result)
            : Promise.reject("加载表信息失败");
        })
        .catch(err => Promise.reject(err))

    // 查找表关系
    // findRelation: (datasetId: string) =>
    //   AxiosUtil.get(API.findRelation, { datasetId })
    //     .then(res =>
    //       res.success
    //         ? Promise.resolve(res.result)
    //         : Promise.reject("加载关系失败")
    //     )
    //     .catch(err => Promise.reject(err))
  },

  /**
   * 分析
   */
  analysis: {
    // 获取分析结果
    fetch: (analysisDTO: AnalysisDTO) => {
      const fields = analysisDTO.fields;
      if (fields.length > 1) {
        return Promise.resolve(
          mockData.map(item => {
            let obj: any = {};
            obj[fields[0].alias] = item.BIANZHI;
            obj[fields[1].alias] = item.ID;
            return obj;
          })
        );
      } else {
        return Promise.resolve([]);
      }
    },

    // 获取 SQL 查询结果
    fetchSQL: (sql: string) => {
      return AxiosUtil.post(API.analysis.sql, { sql })
        .then(res =>
          res.success && res.result !== null
            ? Promise.resolve(res.result)
            : Promise.reject("分析API返回值异常")
        )
        .catch(err => Promise.reject(err));
    }
  },

  /**
   * 仪表盘集
   */
  dashboardSet: {
    // 加载仪表盘集
    find: (setId: string) => {
      return Promise.resolve({
        container: {
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
        },
        dashboards: Object.assign([], mockList)
      });
      // AxiosUtil.get(`${API.findDashboardSet}/${setId}`)
      //   .then(res => {
      //     if (res.result && !ObjectUtil.isEmptyString(res.result.settings)) {
      //       const { settings, dashboards } = res.result;
      //       return ObjectUtil.parseJSON(settings).then(dashboardSet => {
      //         return {
      //           container: dashboardSet,
      //           dashboards
      //         };
      //       });
      //     }

      //     // 仪表盘集为空，使用默认配置
      //     return Promise.resolve({
      //       container: {},
      //       dashboards: []
      //     });
      //   })
      //   .catch(err => Promise.reject(err));
    },

    // 保存仪表盘集
    save: (
      setId: string,
      dashboardSet: DashboardSet,
      dashboards: Array<Dashboard>
    ) =>
      AxiosUtil.post(API.saveDashboardSet, {
        id: setId,
        settings: JSON.stringify(dashboardSet)
      })
        .then(res =>
          res.result ? Promise.resolve() : Promise.reject("保存仪表盘集错误")
        )
        .catch(err => Promise.reject(err))
  }
};
