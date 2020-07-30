<template>
  <div
    class="dashboard-widget"
    v-on="autoListenres"
    v-loading="isFetching"
  >
    <div
      class="toolbar-box"
      v-show="!isSavingScreenhot && index === activeIndex"
    >
      <chart-toolbar :dashboard.sync="thisDashboard" />
    </div>

    <!-- 既没有拖入字段，也没有启用静态数据，显示如下 -->
    <div
      :id="thisDashboard.id"
      :data-title="thisDashboard.echarts.title.text"
      class="chart-component"
    >
      <div v-show="!isShowChart">
        <div v-if="analysisSuccess" class="no-chart-text">
          拖入字段，生成图表
        </div>
        <div v-else class="no-chart-text">分析出错，请稍后重试</div>
        <div class="no-chart-img"></div>
      </div>
      <chart-component
        v-show="isShowChart"
        ref="chartComponent"
        :dashboard.sync="thisDashboard"
        :analysisdata="analysisResult"
        :reactWhere="reactWhere"
        :key="thisDashboard.id"
        @error="doHandleError"
        @setReact="setReactHandle"
        @resetReact="resetReactHandle"
      />
    </div>
  </div>
</template>

<script lang="ts">
import ChartComponent from "glaway-bi-component/src/components/ChartComponent";
import { Component, Prop, Watch, Vue, Provide } from "vue-property-decorator";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ChartUIService from "glaway-bi-component/src/interfaces/ChartUIService";
// Vue-Draggable-Resizable
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { ChartType } from "glaway-bi-model/enums/ChartType";
import ObjectUtil from "@/util/ObjectUtil";
import UIUtil, { MessageType } from "@/util/UIUtil";
import ChartToolbar from "@/layout/editor/chart-toolbar/index.vue";
import {
  AnalysisResults,
  AnalysisResult
} from "glaway-bi-model/types/AnalysisResults";
import ReactWhere from "glaway-bi-model/view/ReactWhere";
import { SortType } from "glaway-bi-model/enums/SortType";
import EChartsService, {
  reactUpdate,
  bindEvents,
  renderChart,
  renderChartByJSON
} from "glaway-bi-component/src/service/EChartsService";
import FieldDTO from "glaway-bi-model/params/FieldDTO";
import EChartsUtil from "@/util/EChartsUtil";
import { AxiosRequest } from "@/api/AxiosRequest";
import DashboardUtil from "@/util/DashboardUtil";
import ComponentUtil from "@/util/ComponentUtil";
import DashboardSet from "glaway-bi-model/view/DashboardSet";
import { DashWidget } from "@/types/DashWidget";

@Component({
  components: {
    vdr,
    ChartComponent,
    ChartToolbar
  }
})
export default class DashboardWidget extends Vue {
  /**
   * 每个可调整元素的数据和所在下标
   */
  @Prop()
  item!: Dashboard | DashWidget<any>;

  @Prop()
  index!: number;

  // 是否正在加载数据
  isFetching = false;

  // 是否分析成功
  analysisSuccess = true;

  // 是否显示详细工具栏
  isShowDetail = false;

  analysisResult: AnalysisResults = [];

  /**
   * 仪表盘部分
   */
  @CommonStore.State("dashboards")
  dashboards!: Array<Dashboard>;

  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 正在截图标志
  @CommonStore.State("isSavingScreenhot")
  isSavingScreenhot!: number;

  // 处于聚焦状态
  @CommonStore.State("focusDashboard")
  focusDashboard!: Dashboard;

  // 设置选中元素的层级
  @CommonStore.Mutation("setDashboardIndex")
  setActiveIndex!: Function;

  // 设置菜单是否可见
  @EditorStore.Mutation("setMenuVisible")
  setMenuVisible!: Function;

  // 联动
  @CommonStore.State("reactWhere")
  reactWhere!: ReactWhere;

  // 设置联动
  @CommonStore.Mutation("setReactWhere")
  setReactHandle!: Function;

  // 清空联动条件
  @CommonStore.Mutation("resetReactWhere")
  resetReactHandle!: Function;

  // 联动轮播
  @CommonStore.State("reactTask")
  reactTask!: object;

  @CommonStore.Mutation("setReactTask")
  setReactTask!: Function;

  // 改变图表类型
  @EditorStore.Action("changeChartType")
  changeChartType!: Function;

  // 改变图表类型
  @EditorStore.Action("loadOptions")
  loadOptions!: Function;

  // 仪表盘集配置
  @CommonStore.State("dashboardSet")
  dashboardSet!: DashboardSet;

  /**
   * Getter
   */
  get autoListenres(): any {
    return Object.assign({}, this.$listeners, {
      mousedown: this.hideDetailBar.bind(this, true)
    });
  }

  get setting(): any {
    return this.dashboardSet.canvasSetting;
  }

  get isCurrent(): boolean {
    return (
      this.activeIndex !== -1 &&
      this.thisDashboard.id === this.dashboards[this.activeIndex].id
    );
  }

  get thisDashboard(): Dashboard {
    return this.item as Dashboard;
  }

  set thisDashboard(dashboard: Dashboard) {
    this.$emit("update:item", dashboard);
  }

  get thisChartType(): ChartType {
    return this.thisDashboard.visualData.type;
  }

  get thisEchartsOption() {
    return this.thisDashboard.echarts;
  }

  get thisAnalysis() {
    return this.thisDashboard.analysis;
  }

  get thisEvents() {
    return this.thisDashboard.events;
  }

  /**
   * 轮播任务
   */
  get thisTasks() {
    return this.thisDashboard.tasks;
  }

  set thisTasks(tasks) {
    this.thisDashboard.tasks = tasks;
  }

  get isRotationEnable() {
    return this.thisTasks.ratotionEnable;
  }

  set isRotationEnable(flag: boolean) {
    this.thisTasks.ratotionEnable = flag;
  }

  get isRotationNumb() {
    return this.thisTasks.ratotionNumb;
  }

  /**
   * 静态数据 Getter
   */
  get thisStatic() {
    return this.thisDashboard.staticData;
  }

  /**
   * JSON
   */
  get isJsonEnable(): boolean {
    return this.thisStatic.json.enable;
  }

  get jsonData(): string {
    return this.thisStatic.json.data;
  }

  /**
   * SQL
   */
  get isSqlEnable(): boolean {
    return this.thisStatic.sql.enable;
  }

  get sqlData(): string {
    return this.thisStatic.sql.data;
  }

  /**
   * 是否开启联动
   */
  get isReact(): boolean {
    return this.thisDashboard.analysis.isReact;
  }

  /**
   * 图表组件 Getter
   */
  get chartComponent(): ChartUIService {
    return this.$refs.chartComponent as any;
  }

  /**
   * 是否不存在拖入字段
   * isEmptyArray 是不是空数组
   */
  get noField(): boolean {
    return (
      ObjectUtil.isEmptyArray(this.thisAnalysis.dimensions) &&
      ObjectUtil.isEmptyArray(this.thisAnalysis.measures)
    );
  }

  /**
   * 是否显示图表
   */
  get isShowChart(): boolean {
    return (
      (!this.noField || this.isJsonEnable || this.isSqlEnable) &&
      this.analysisSuccess
    );
  }

  /**
   * 是否需要获取数据
   */
  get needFetchData(): boolean {
    return !this.noField || this.isSqlEnable;
  }

  mounted() {
    this.setActiveIndex(-1);

    if (!this.chartComponent) return;

    // 初始化
    this.chartComponent?.initChart();

    // 绑定事件
    this.chartComponent.bindChartEvents(false, this.thisEvents);

    // 获取数据
    if (this.needFetchData) {
      this.fetchToShow();
    } else if (this.isJsonEnable) {
      this.chartComponent.renderChart();
    }
  }

  /**
   * 监听数据
   */

  /**
   * 图表类型
   */
  @Watch("thisChartType")
  onChartTypeChange(newType: ChartType, oldType: ChartType) {
    this.changeChartType(newType)
      .then(() => {
        this.setMenuVisible(false);
        // 去获取选项配置 同下标图表切换类型，需要手动触发加载配置
        this.loadOptions().then(() => {
          this.chartComponent?.renderChart();
        });
      })
      .catch((err: Error) => {
        UIUtil.showErrorMessage("切换图表类型失败");
      });
  }

  /**
   * 监听聚焦
   */
  @Watch("focusDashboard", {
    deep: true
  })
  onFocusDashboardChange() {
    this.chartComponent.resizeChart();
  }

  /**
   * JSON 数据
   */
  @Watch("isJsonEnable")
  @Watch("jsonData")
  onJsonDataUpdate(): void {
    if (!this.chartComponent) return;

    /**
     * 刷新条件
     *  - 未开启 JSON 时，刷新渲染视图
     *  - 开启 JSON 时，判断是否为空，不为空 则渲染
     */
    if (!this.isJsonEnable && this.needFetchData) {
      this.fetchToShow();
      return;
    }

    if (ObjectUtil.isEmptyString(this.jsonData)) {
      UIUtil.showMessage("请键入需要使用的 JSON 数据", MessageType.warning);
      this.chartComponent.clearChart();
    } else {
      this.chartComponent.renderChart();
    }
  }

  /**
   * SQL 查询
   */
  @Watch("isSqlEnable")
  @Watch("sqlData")
  onSqlSwitchUpdate(): void {
    if (this.isSqlEnable) {
      this.fetchToShow();
    }
  }

  // 联动条件
  @Watch("reactWhere", {
    deep: true,
    immediate: true
  })
  onReactWhereUpdate(): void {
    const rotationTask = this.reactWhere.rotationTask;
    this.thisTasks = {
      ratotionEnable: rotationTask.ratotionEnable,
      ratotionNumb: rotationTask.ratotionNumb,
      ratotionId: this.thisTasks.ratotionId
    };

    // 是否是联动主体
    const notCurrent = this.thisDashboard.id === this.reactWhere.dashboardId;

    // 是否是上次联动主体
    const resetCurrent =
      this.thisDashboard.id === this.reactWhere.oldDashboardId;
    // 如果没有开启联动 && 需要清除选中效果 && 不是联动主体
    // 重置透明度
    if (!this.isReact && resetCurrent && !notCurrent) {
      this.chartComponent.resetOpacity();
    }

    if (!this.isReact || notCurrent) {
      return;
    }
    reactUpdate(this.thisDashboard, this.reactWhere, this.fetchToShow);
  }

  // 分析
  @Watch("thisAnalysis", {
    deep: true
  })
  onAnalysisUpdate(): void {
    // 非当前仪表盘 || 正在打开菜单 || 不存在字段
    if (!this.isCurrent || this.noField || this.isSqlEnable) {
      return;
    }
    if (
      this.reactWhere.dashboardId &&
      this.reactWhere.dashboardId === this.thisDashboard.id
    ) {
      this.resetReactHandle();
    }
    this.fetchToShow();
  }

  /**
   * 中间值
   */
  @Watch("analysisResult", {
    deep: true,
    immediate: false
  })
  onAnalysisResultChange(): void {
    this.chartComponent?.resizeChart();
    this.chartComponent?.renderChart(this.analysisResult);
  }

  /**
   * 监听图表选项
   */
  @Watch("thisEchartsOption", {
    deep: true,
    immediate: true
  })
  onEchartsOptionUpdate(): void {
    /**
     * 非当前仪表盘 || 正在打开菜单 || 没有维度字段
     */
    if (!this.isCurrent) {
      return;
    }
    this.chartComponent?.renderChart();
  }

  /**
   * 事件
   */
  @Watch("thisEvents", {
    deep: true,
    immediate: true
  })
  onEventsUpdate(): void {
    // 非当前仪表盘 || 图表组件为空
    if (!this.isCurrent || !this.chartComponent) {
      return;
    }
    this.chartComponent.bindChartEvents(true, this.thisEvents);
  }

  /**
   * 监听轮播
   */
  @Watch("isRotationEnable")
  onRotationEnableUpdate(): void {
    clearTimeout(this.thisTasks.ratotionId);

    // 图表组件为空 || 关闭轮播
    if (!this.chartComponent || !this.isRotationEnable) {
      return;
    }
    const time = (parseInt(this.thisTasks.ratotionNumb as string) || 1) * 1000;
    this.thisTasks.ratotionId = this.rotationLoad(time);
  }

  @Watch("isRotationNumb")
  onRotationNumbUpdate(): void {
    clearTimeout(this.thisTasks.ratotionId);
    // 图表组件为空 || 关闭轮播
    if (!this.chartComponent || !this.isRotationEnable) {
      return;
    }
    const time = (parseInt(this.thisTasks.ratotionNumb as string) || 1) * 1000;
    this.thisTasks.ratotionId = this.rotationLoad(time);
  }

  /**
   * 加载轮播
   */
  rotationLoad(timeout: any) {
    return setTimeout(() => {
      this.fetchToShow().then(() => {
        clearTimeout(this.thisTasks.ratotionId);
        this.thisTasks.ratotionId = this.rotationLoad(timeout);
      });
    }, timeout) as any;
  }

  /**
   * 拖拽回调
   */
  onDragging(x: number, y: number): void {
    // 如果类型为 Echarts 图表，则调用 resize 方法
    this.$nextTick(() => {
      this.chartComponent?.resizeChart();
    });

    this.hideDetailBar(true);
  }

  /**
   * 调整大小结束回调
   */
  onResizeStop(x: number, y: number, width: number, height: number): void {
    // 如果类型为 Echarts 图表，则调用 resize 方法
    this.$nextTick(() => {
      this.chartComponent?.resizeChart();
    });

    this.hideDetailBar(true);
  }

  /**
   * 切换悬浮工具栏隐藏状态
   */
  hideDetailBar(hide: boolean): void {
    this.isShowDetail = !hide;
  }

  // 获取联动数据
  getReactWhere(): ReactWhere {
    const isCurrent = this.reactWhere.dashboardId === this.thisDashboard.id;
    if (this.isReact && !isCurrent) {
      return this.reactWhere;
    }
    return {
      rotationTask: {} as any,
      selectedIndex: null,
      oldDashboardId: null,
      dashboardId: null,
      datasetId: null,
      where: [] as any
    };
  }

  /**
   * 获取数据，展示图表
   */
  fetchToShow(): Promise<void> {
    this.isFetching = true;
    const reactWhere: ReactWhere = this.getReactWhere();
    // 获取数据
    return ComponentUtil.fetchData(
      this.isSqlEnable,
      this.thisDashboard,
      reactWhere,
      this.chartComponent
    )
      .then(data => {
        if (this.isSqlEnable) {
          UIUtil.showMessage("暂不支持 SQL 查询", MessageType.warning);
          this.chartComponent.clearChart();
          return;
        }
        // 分析成功
        this.analysisSuccess = true;

        this.analysisResult = data;
      })
      .catch(err => {
        // 分析失败
        this.analysisSuccess = false;
        UIUtil.showErrorMessage("分析出错，请稍后重试");
      })
      .finally(() => {
        this.isFetching = false;
        return Promise.resolve();
      });
  }

  /**
   * 处理biComponent错误信息
   */
  doHandleError(errMessge: { errorPart: string; error: Error }) {
    UIUtil.showErrorMessage(errMessge.error.message);
  }
}
</script>

<style lang="scss" scoped>
.dashboard-widget {
  outline: none;

  .no-chart-text {
    padding: 16px 0;
    text-align: center;
  }

  .no-chart-img {
    background: url("#{$basePath}img/no-chart.svg") no-repeat center;
    background-size: contain;
    position: absolute;
    top: 40px;
    left: 20px;
    right: 20px;
    bottom: 0;
  }
  .chart-component {
    width: 100%;
    height: 100%;
  }

  .toolbar-box {
    width: 100%;

    .chart-toolbar {
      position: absolute;
      z-index: 1000;
    }

    .common-toolbar {
      right: 0;
    }
  }
}
</style>
