import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import TableVO, { tableViewInfo } from "glaway-bi-model/results/TableVO";
import TableInfoVO from "glaway-bi-model/results/TableInfoVO";
import { Module, GetterTree, MutationTree, ActionTree } from "vuex";
import { ShortcutType } from "glaway-bi-model/enums/ShortcutType";
import { ChartType } from "glaway-bi-model/enums/ChartType";
import MenuOptions from "@/config/MenuOptions";
import ObjectUtil from "@/util/ObjectUtil";
import { AxiosRequest } from "@/api/AxiosRequest";
import {
  customDataTemplates,
  generalDataTemplate
} from "glaway-bi-component/src/config/DefaultTemplate";
import TableView from "glaway-bi-model/view/dashboard/TableView";
import DashboardUtil from "@/util/DashboardUtil";

const state = {
  /**
   * 视图状态
   */
  // 菜单是否显示
  menuVisible: false,

  // 当前激活快捷键类型（用于区分全局快捷键、网格部分快捷键等）
  activeShortcutType: ShortcutType.global,

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
  tableList: [],

  /**
   * 视图信息
   */
  viewName: []
};

const getters: GetterTree<any, any> = {
  /**
   * 获取所有字段
   */
  allColumns(state): Array<TableInfoVO> {
    return state.tableList.flatMap((table: TableVO) => table.columns);
  }
};

const mutations: MutationTree<any> = {
  // 设置菜单是否可见
  setMenuVisible(state: any, visible: boolean): void {
    state.menuVisible = visible;
  },

  setViewName(state: any, viewName: Array<string>) {
    state.viewName = viewName;
  },

  // 设置当前激活的快捷键区域
  // type 全局或网格部分
  setActiveShortcutType(state: any, type: ShortcutType): void {
    state.activeShortcutType = type;
  }
};

const actions: ActionTree<any, any> = {
  /**
   * 加载数据集
   */
  async loadTables({ state, rootGetters }): Promise<TableView> {
    const currentDashboard = rootGetters["common/currentDashboard"],
      datasetId = currentDashboard.analysis.datasetId;
    if (datasetId === null) {
      state.tableList = [];
      return Promise.resolve(DashboardUtil.initTableView());
    }
    // 枚举类
    const dataTypeList = ["DATE", "NUMBER", "VARCHAR"];
    return AxiosRequest.table
      .find(datasetId)
      .then(
        ({ tables, cube }: tableViewInfo): Promise<TableView> => {
          if (!cube.viewname) {
            console.error("视图信息为null");
            return Promise.resolve(DashboardUtil.initTableView());
          }
          // 这块代码要优化
          const fromTable = DashboardUtil.getFormTable(cube.viewname);
          state.tableList = tables.map((table: TableVO) => {
            const { schema, alias } = fromTable;
            const columns = table.columns
              ?.map((column: TableInfoVO) => {
                const columnName =
                  column.vcolumn || column.alias || column.columnName;
                return {
                  id: column.id,
                  schema,
                  dataType: column.dataType,
                  tableAlias: alias,
                  columnName,
                  alias: columnName,
                  vcolumn: columnName
                };
              })
              .sort((tablea: any, tableb: any) => {
                const result =
                  dataTypeList.indexOf(tableb.dataType) -
                  dataTypeList.indexOf(tablea.dataType);
                return result;
              });
            return {
              id: table.id,
              schema,
              alias,
              columns,
              showName: (<any>cube).name || "",
              name: alias
            };
          });
          return Promise.resolve({
            viewName: cube.viewname,
            fromTable
          });
        }
      )
      .catch(err => Promise.reject(err));
  },

  // 加载图表选项
  loadOptions({ state, rootGetters }): Promise<void> {
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
  changeChartType({ rootGetters }: any, newType: ChartType): Promise<void> {
    let currentDashboard: Dashboard | null =
      rootGetters["common/currentDashboard"];
    if (!currentDashboard) return Promise.reject("未选中仪表盘");

    // 先这样，后面之前的数据怎么保存，之后再说
    const sampleStyle = ObjectUtil.copy(
        customDataTemplates[newType].echarts.sampleStyle
      ),
      generalSampleStyle = ObjectUtil.copy(
        generalDataTemplate.echarts.sampleStyle
      );
    currentDashboard.echarts.sampleStyle = ObjectUtil.merge(
      sampleStyle,
      generalSampleStyle
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
