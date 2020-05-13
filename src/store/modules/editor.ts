import Dashboard from "@/model/view/dashboard/Dashboard";
import TableVO from "@/model/results/TableVO";
import TableInfoVO from "@/model/results/TableInfoVO";
import { Module, GetterTree, MutationTree, ActionTree } from "vuex";
import { ShortcutType } from "@/enums/ShortcutType";
import { ChartType } from "@/enums/ChartType";
import UIUtil from "@/util/UIUtil";
import MenuOptions from "@/config/MenuOptions";
import ObjectUtil from "@/util/ObjectUtil";
import { AxiosRequest } from "@/api/AxiosRequest";
import { customDataTemplates } from "@/config/DefaultTemplate";

const state = {
  /**
   * 视图状态
   */

  // 菜单是否显示
  menuVisible: false,

  // 当前激活快捷键类型（用于区分全局快捷键、网格部分快捷键等）
  activeShortcutType: ShortcutType.global,

  /**
   * 标志位
   */

  // 解决因为监听分析属性, 赋值 fromTable与relation 带来的重新拉取分析数据
  menuLoading: false,

  /**
   * 样式编辑部分
   */

  // 样式选项
  styleSelection: {},

  // 功能项
  functionalOptions: {},

  /**
   * 数据集字段部分
   */
  tables: []
};

const getters: GetterTree<any, any> = {
  /**
   * 获取所有字段
   */
  allColumns(state): Array<TableInfoVO> {
    return state.tables.flatMap((table: TableVO) => table.children);
  }
};

const mutations: MutationTree<any> = {
  // 设置菜单是否可见
  setMenuVisible(state: any, visible: boolean): void {
    state.menuVisible = visible;
  },

  // 设置当前激活的快捷键区域
  // type 全局或网格部分
  setActiveShortcutType(state: any, type: ShortcutType): void {
    state.activeShortcutType = type;
  },

  // 设置是否正在打开菜单
  setMenuLoading(state): void {
    state.menuLoading = true;
  },
  setMenuLoadFinish(state): void {
    state.menuLoading = false;
  }
};

const actions: ActionTree<any, any> = {
  /**
   * 加载数据集
   */
  async loadDataset({ state, rootGetters }): Promise<void> {
    debugger
    const currentDashboard = rootGetters["common/currentDashboard"],
      datasetId = currentDashboard.analysis.datasetId;
    if (datasetId === null) {
      state.tables = [];
      return;
    }
    return AxiosRequest.table.find(datasetId)
      .then((tables: TableVO) => {
        // 赋值
        state.tables = tables;
        return Promise.resolve();
      })
      .catch(err => Promise.reject(err));
  },

  // 加载图表选项
  loadOptions({ state, rootGetters }: any): Promise<void> {
    const currentDashboard: Dashboard = rootGetters["common/currentDashboard"],
      type = currentDashboard.visualData.type as ChartType,
      chartStyleOptions = MenuOptions.getChartStyleOptions(type),
      chartFunctionalOptions = MenuOptions.getChartFunctionalOptions(type);

    if (!chartStyleOptions || !chartFunctionalOptions) {
      return Promise.reject("图表配置选项不存在");
    }

    state.styleSelection = ObjectUtil.copy(chartStyleOptions);
    state.functionalOptions = ObjectUtil.copy(chartFunctionalOptions);

    return Promise.resolve();
  },

  // 改变图表类型
  changeChartType(
    { rootGetters }: any,
    { newType, oldType }: { [key: string]: ChartType }
  ): Promise<void> {
    const currentDashboard: Dashboard | null =
      rootGetters["common/currentDashboard"];
    if (!currentDashboard) return Promise.reject("未选中仪表盘");

    // delete currentDashboard.echarts.sampleStyle[oldType];
    currentDashboard.echarts.sampleStyle[newType] = ObjectUtil.copy(
      customDataTemplates[newType].echarts.sampleStyle
    );
    return Promise.resolve();
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
