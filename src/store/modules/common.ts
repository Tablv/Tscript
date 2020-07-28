import UUID from "glaway-bi-util/UUID";
import { WidgetBuilder } from "@/config/WidgetBuilder";
import { Module, GetterTree, MutationTree, ActionTree } from "vuex";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import ReactWhere from "glaway-bi-model/view/ReactWhere";
import DefaultTemplate, {
  defaultDashboardSet
} from "glaway-bi-component/src/config/DefaultTemplate";
import DashboardSet from "glaway-bi-model/view/DashboardSet";
import { AxiosRequest } from "@/api/AxiosRequest";
// import { AxiosRequest } from "@/api/mock";
import { ChartType } from "glaway-bi-model/enums/ChartType";
import Draggable from "glaway-bi-model/view/Draggable";
import DashboardUtil from "@/util/DashboardUtil";
import UIUtil from "@/util/UIUtil";
import { WidgetType } from "@/config/WidgetType";
import { DashWidget, widgetConfig } from "@/types/DashWidget";

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
    selectedIndex: null,
    oldDashboardId: null,
    rotationTask: {
      ratotionEnable: false,
      ratotionNumb: 5,
      ratotionId: null
    },
    dashboardId: null,
    datasetId: null,
    where: null
  },

  // 聚焦图表信息
  focusDashboard: {
    id: "",
    visualData: {}
  },

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
  },

  // 滚动条信息
  scrollStyle: {
    scrollLeft: 0,
    scrollTop: 0
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
        z: currentDataLength
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
    let [offsetX, offsetY] = state.dashboardSet.grid || [10, 10];
    let originX = newDashboard.visualData.position.x;
    let originY = newDashboard.visualData.position.y;
    let latestPosition = {
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

  createWidget(
    state: any,
    baseConfig: { type: WidgetType; position: { x: number; y: number } }
  ): void {
    let currentDataLength: number = state.dashboards.length;
    const { type, position } = baseConfig;

    /**
     * 构建组件
     */
    const widgetBuilder = new WidgetBuilder(type, {
      ...position,
      z: currentDataLength
    });

    let newWidget: DashWidget<any> = {
      id: UUID.generate(),
      type,
      visualData: widgetBuilder.buildVisualData(),
      config: widgetBuilder.buildConfig()
    };

    if (!newWidget) {
      UIUtil.showErrorMessage("创建初始化数据出错");
      throw "创建初始化数据出错";
    }
    // 添加仪表盘
    state.dashboards.push(newWidget);
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
    const delDashboard = state.dashboards.splice(index, 1)[0];

    if (delDashboard.id === state.focusDashboard.id) {
      state.focusDashboard.id = "";
    }

    if (delDashboard.id === state.reactWhere.dashboardId) {
      state.reactWhere.dashboardId = "";
      state.reactWhere.where = null;
    }
  },

  // 设置仪表盘集ID
  setDashboardSetId(state, id: string): void {
    state.dashboardSetId = id;
  },

  // 设置仪表盘集数据
  setDashboardSet(state, dashboardSet: DashboardSet): void {
    state.dashboardSet = ObjectUtil.merge(state.dashboardSet, dashboardSet);
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
    state.dashboardIndex = index;
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

  // 清空联动条件
  resetReactWhere(state): void {
    ObjectUtil.merge(state.reactWhere, {
      selectedIndex: null,
      dashboardId: null,
      where: null
    });
  },

  /**
   * 设置保存截图标志
   * 控制 截图背景灰色
   */
  setSavingScreenhot(state, isSaving: boolean): void {
    state.isSavingScreenhot = isSaving;
  },

  /**
   * 设置聚焦图表信息
   * @param focusDashboard {Dashboard} 聚焦图表信息
   */
  setFocusDashboard(state, focusDashboard: Dashboard | DashWidget<any>): void {
    state.focusDashboard = focusDashboard;
  },

  // 设置阴影风格
  setShadowStyle(state, shadowStyle: Draggable) {
    state.shadowStyle = shadowStyle;
  },

  // 设置是否开启阴影
  setShowshadow(state, value: boolean) {
    state.isShowshadow = value;
  },

  // 设置滚动条信息
  setScrollStyle(
    state,
    scrollStyle: {
      scrollLeft: number;
      scrollTop: number;
    }
  ): void {
    state.scrollStyle = scrollStyle;
  }
};

const actions: ActionTree<any, any> = {
  /**
   * 加载仪表盘配置
   */
  loadDashboards({ state, commit }): Promise<void> {
    // return AxiosRequest.dashboards
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
          dashboard = <any>JSON.parse(JSON.stringify(dashboard));
          if (!dashboard.echarts) {
            dashboard.config = ObjectUtil.copy(dashboard.analysis);
            dashboard.analysis = null;
            return dashboard;
          }
          const viewName: string = dashboard.analysis.viewName || "";
          dashboard.tableView = {
            viewName,
            fromTable:
              ObjectUtil.copy(dashboard.analysis.fromTable) ||
              DashboardUtil.getFormTable(viewName)
          };

          const type = dashboard.visualData.type;

          const defaultConfig = ObjectUtil.copy(
            DefaultTemplate.getDefaultConfig(type)
          );

          return ObjectUtil.merge(defaultConfig, dashboard);
        });

        // 设置仪表盘
        commit("setDashboards", result);
        return Promise.resolve();
      })
      .catch(err => Promise.reject(err));
  },

  loadDashboardSet({ state, commit }): Promise<void> {
    return AxiosRequest.dashboardSet
      .find(state.dashboardSetId)
      .then(res => {
        const { container, dashboards } = res;
        // 清空联动条件
        commit("resetReactWhere");

        // 设置仪表盘集
        commit("setDashboardSet", container);
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
