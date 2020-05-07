import UUID from "@/util/UUID";
import { Module, GetterTree, MutationTree, ActionTree } from "vuex";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import DefaultTemplates from "@/config/DefaultTemplate";
import ReactWhere from "@/model/view/ReactWhere";
import { defaultDashboardSet } from "@/config/DefaultTemplate";
import DashboardSet from "@/model/view/DashboardSet";
import { AxiosRequest } from "@/api/AxiosRequest";
import { ChartType } from "@/enums/ChartType";
import DashboardUtil from "@/util/DashboardUtil";
import UIUtil from "@/util/UIUtil";

const state: any = {
  // 当前仪表盘集ID
  dashboardSetId: "",

  // 仪表盘集设置
  dashboardSet: ObjectUtil.copy(defaultDashboardSet),

  // 仪表盘数据数组
  dashboards: [],

  // 当前激活的数据数组的下标
  dashboardIndex: -1,

  // 联动条件
  reactWhere: {
    dashboardId: null,
    datasetId: null,
    where: null
  },

  // 正在保存分析标志位
  savingAnalysis: false
};

const getters: GetterTree<any, any> = {
  // 获取当前仪表盘
  currentDashboard(state): Dashboard {
    return state.dashboards[state.dashboardIndex];
  }
};

const mutations: MutationTree<any> = {
  /**
   * 创建仪表盘
   * @param chartType {ChartType} 仪表类型
   */
  createDashboard(state: any, chartType: ChartType): void {
    // 当前存在的数据
    let currentDataLength = state.dashboards.length;

    // 根据模板，创建新数据
    let initData: Dashboard | undefined = DashboardUtil.getInitDashboard(
      currentDataLength,
      chartType
    );
    if (initData === undefined) {
      UIUtil.showErrorMessage("创建初始化数据出错");
      throw "创建初始化数据出错";
    }

    // 添加仪表盘
    state.dashboards.push(initData);
  },

  /**
   * 复制仪表盘
   *
   */
  copyDashboard(state: any, sourceIndex: number): void {
    let sourceDashboard = state.dashboards[sourceIndex];

    if (sourceDashboard === undefined) {
      UIUtil.showErrorMessage("复制出错");
      throw "复制仪表盘出错";
    }

    let newDashboard: Dashboard = ObjectUtil.copy(sourceDashboard);

    // 生成新ID
    newDashboard.id = UUID.generate();

    // 移动位置以防止重叠
    let offsetX = newDashboard.visualData.grid[0],
      offsetY = newDashboard.visualData.grid[1],
      originX = newDashboard.visualData.position.x,
      originY = newDashboard.visualData.position.y,
      latestPosition = {
        x: originX + offsetX,
        y: originY + offsetY,
        z: state.dashboards.length - 1
      };
    newDashboard.visualData.position = latestPosition;

    // 加入仪表盘数组
    state.dashboards.push(newDashboard);

    // 选中复制的仪表盘
    setTimeout(() => (state.dashboardIndex = state.dashboards.length - 1), 300);
  },

  /**
   * 删除可视化数据
   *
   */
  deleteDashboard(state: any, index: number): void {
    // 判断下标是否存在
    let dashboardLength = state.dashboards.length;

    if (index === -1 || index >= dashboardLength) {
      throw "操作失败，当前操作数据不存在...";
    }

    // 当前下标置为-1
    state.dashboardIndex = -1;

    // 删除指定数据
    state.dashboards.splice(index, 1);
  },

  // 清空数据
  resetReactWhere(state): void {
    state.reactWhere = {
      datasetId: null,
      where: null
    };
  },

  // 设置仪表盘集ID
  setDashboardSetId(state, id: string): void {
    state.dashboardSetId = id;
  },

  // 设置仪表盘集数据
  setDashboardSet(state, dashboardSet: DashboardSet): void {
    state.dashboardSet = ObjectUtil.merge(
      dashboardSet,
      state.dashboardSet,
      true
    );
  },

  // 设置仪表盘数据
  // setDashboards(state, result: Array<Dashboard>): void {
  //   result.forEach(dashboard => {
  //     let chartType = dashboard.visualData.type,
  //       defaultConfig = DefaultTemplates.getDefaultConfig(chartType);
  //     console.error(defaultConfig);
  //     ObjectUtil.merge(dashboard, defaultConfig);
  //   });

  //   state.dashboards = result;
  // },
  setDashboards(state, result: Array<Dashboard>): void {
    state.dashboards = result;
  },

  // 设置当前选中仪表盘
  setDashboardIndex(state, index: number): void {
    state.dashboardIndex = index;
  },

  // 设置当前选中仪表盘的层级
  /**
   * @param index {number} 激活图表下标
   */
  setDashboardChartZIndex(state, index: number): void {
    // state.currentDashboard.visualData.position.z = zIndex;
    const maxZIndex = state.dashboards.length - 1;
    const oldZIndex = state.dashboards[index].visualData.position.z;
    state.dashboards.forEach((dashboard: Dashboard) => {
      if (dashboard.visualData.position.z > oldZIndex) {
        dashboard.visualData.position.z -= 1;
      }
    });
    state.dashboards[index].visualData.position.z = maxZIndex;
  },

  // 设置联动条件
  setReactWhere(state, reactWhere: ReactWhere): void {
    state.reactWhere = reactWhere;
  },

  // 设置是否正在保存分析数据
  setSavingAnalysis(state, isSaving: boolean): void {
    state.savingAnalysis = isSaving;
  }
};

const actions: ActionTree<any, any> = {
  /**
   * 加载仪表盘配置
   */
  async loadDashboardSet({ state, commit }): Promise<void> {
    return await AxiosRequest.dashboardSet
      .find(state.dashboardSetId)
      .then(settings => {
        state.dashboardSet = ObjectUtil.merge(
          settings,
          state.dashboardSet,
          true
        );
        return Promise.resolve();
      })
      .catch(err => Promise.reject(err));
  },

  /**
   * 加载仪表盘配置
   */
  async loadDashboards({ state, commit }): Promise<void> {
    return await AxiosRequest.dashboardRequest
      .find(state.dashboardSetId)
      .then(resultData => {
        // 清空联动条件
        commit("resetReactWhere");
        // 保存仪表盘
        commit("setDashboards", resultData);

        return Promise.resolve();
      })
      .catch(err => Promise.reject(err));
  }
};

const module: Module<any, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default module;
