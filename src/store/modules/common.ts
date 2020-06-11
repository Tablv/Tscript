import UUID from "@/util/UUID";
import { Module, GetterTree, MutationTree, ActionTree } from "vuex";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import ReactWhere from "glaway-bi-model/view/ReactWhere";
import DefaultTemplate, {
  defaultDashboardSet
} from "glaway-bi-component/src/config/DefaultTemplate";
import DashboardSet from "glaway-bi-model/view/DashboardSet";
// import { AxiosRequest } from "@/api/AxiosRequest";
import { AxiosRequest } from "@/api/mock";
import { ChartType } from "glaway-bi-model/enums/ChartType";
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
  savingAnalysis: false,

  // 正在保存截图标志位
  isSavingScreenhot: false,

  // 仪表阴影
  isShowshadow: false,

  // 阴影风格
  shadowStyle: {
    w: 300,
    h: 400,
    x: 0,
    y: 0,
    z: 1000,
    grid: [10, 10],
    handles: []
  }
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
  createDashboard(
    state: any,
    baseConfig: { chartType: ChartType; position?: { x: number; y: number } }
  ): void {
    // 当前存在的数据
    let currentDataLength = state.dashboards.length;
    const { chartType, position } = baseConfig;

    // 根据模板，创建新数据
    let initData: Dashboard | undefined = DashboardUtil.getInitDashboard(
      currentDataLength,
      chartType
    );
    if (initData === undefined) {
      UIUtil.showErrorMessage("创建初始化数据出错");
      throw "创建初始化数据出错";
    }
    if (position) {
      initData.visualData.position = {
        x: position.x,
        y: position.y,
        z: initData.visualData.position.z
      };
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
    state.dashboardSet = ObjectUtil.merge(dashboardSet, state.dashboardSet);
  },

  // 设置仪表盘数据
  setDashboards(state, dashboards: Array<Dashboard>): void {
    state.dashboards = dashboards;
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
  },

  // 设置正在保存截图
  setSavingScreenhot(state, isSaving: boolean): void {
    state.isSavingScreenhot = isSaving;
  },

  setShadowStyle(
    state,
    shadowStyle: {
      w: number;
      h: number;
      x: number;
      y: number;
      z: number;
      grid: Array<number>;
      handles: Array<string>;
    }
  ) {
    state.shadowStyle = shadowStyle;
  },

  setShowshadow(state, value: boolean) {
    state.isShowshadow = value;
  }
};

const actions: ActionTree<any, any> = {
  /**
   * 加载仪表盘配置
   */
  loadDashboardSet({ state, commit }): Promise<void> {
    return AxiosRequest.dashboardSet
      .find(state.dashboardSetId)
      .then(res => {
        const { container, dashboards } = res;
        // 清空联动条件
        commit("resetReactWhere");

        // 设置仪表盘集
        commit("setDashboardSet", container);
        // 处理老旧数据，合并最近的公共配置
        const result = dashboards.map((dashboard: any) => {
          dashboard = JSON.parse(JSON.stringify(dashboard));
          const type = dashboard.visualData.type;
          const defaultConfig = ObjectUtil.copy(
            DefaultTemplate.getDefaultConfig(type)
          );
          // dashboard.analysis.datasetId = state.dashboardSetId;
          return ObjectUtil.merge(defaultConfig, dashboard);
        });

        // 设置仪表盘
        commit("setDashboards", result);
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
