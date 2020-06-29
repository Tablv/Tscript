<template>
  <div class="resizable-chart">
    <vdr
      @dragstop="onDragStop"
      @dragging="onDrageding"
      @resizestop="onResizeStop"
      :w="thisDashboard.visualData.width"
      :h="thisDashboard.visualData.height"
      :x="thisDashboard.visualData.position.x"
      :grid="thisDashboard.visualData.grid"
      :y="thisDashboard.visualData.position.y"
      :z="thisDashboard.visualData.position.z"
      :class="{ activeElement: index === activeIndex && !isSavingScreenhot }"
    >
      <div
        class="draggable-content"
        @mousedown="hideDetailBar(true)"
        v-loading="isFetching"
      >
        <div class="toolbar-box" v-show="!isSavingScreenhot">
          <chart-toolbar :dashboard.sync="thisDashboard" />
        </div>

        <!-- 既没有拖入字段，也没有启用静态数据，显示如下 -->
        <div
          :id="thisDashboard.id"
          :data-title="thisDashboard.echarts.title.text"
          class="chart-component"
        >
          <div v-show="!showChart">
            <div v-if="analysisSuccess" class="no-chart-text">
              拖入字段，生成图表
            </div>
            <div v-else class="no-chart-text">分析出错，请稍后重试</div>
            <div class="no-chart-img"></div>
          </div>
          <chart-component
            v-show="showChart"
            ref="chartComponent"
            :dashboard.sync="thisDashboard"
            :analysisdata="resultTmp"
            :reactWhere="reactWhere"
            :key="index"
            @error="doHandleError"
            @setReact="setReactHandle"
            @resetReact="resetReactHandle"
          />
        </div>
      </div>
    </vdr>
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
import ChartToolbar from "@/layout/chartToolBar/CommonToolbar.vue";
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
import EChartsUtil from "../../util/EChartsUtil";
import { AxiosRequest } from "../../api/AxiosRequest";
import DashboardUtil from "../../util/DashboardUtil";
import ComponentUtil from "../../util/ComponentUtil";

@Component({
  components: {
    vdr,
    ChartComponent,
    ChartToolbar
  }
})
export default class ResizableElement extends Vue {
  /**
   * 每个可调整元素的数据和所在下标
   */
  @Prop()
  item!: Dashboard;

  @Prop()
  index!: number;

  // 是否正在加载数据
  isFetching = false;

  // 是否分析成功
  analysisSuccess = true;

  // 是否显示详细工具栏
  isShowDetail = false;

  resultTmp: AnalysisResults = [];

  defaultConfig: any;

  // 正在加载菜单
  @EditorStore.State("menuLoading")
  menuLoading!: boolean;

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

  // 设置选中元素的层级
  @CommonStore.Mutation("setDashboardIndex")
  setActiveIndex!: Function;

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

  /**
   * Getter
   */
  get isCurrent(): boolean {
    return (
      this.activeIndex !== -1 &&
      this.thisDashboard.id === this.dashboards[this.activeIndex].id
    );
  }

  get thisDashboard(): Dashboard {
    return this.item;
  }

  set thisDashboard(dashboard: Dashboard) {
    this.$emit("update:item", dashboard);
  }

  get thisChartType(): ChartType {
    return (this.thisDashboard.visualData as any).type;
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
      this.noDimensions && ObjectUtil.isEmptyArray(this.thisAnalysis.measures)
    );
  }

  /**
   * 是不是不存在分析字段
   */
  get noDimensions(): boolean {
    return ObjectUtil.isEmptyArray(this.thisAnalysis.dimensions);
  }

  /**
   * 是否显示图表
   */
  get showChart(): boolean {
    return (
      (!this.noField ||
        this.thisStatic.json.enable ||
        this.thisStatic.sql.enable) &&
      this.analysisSuccess
    );
  }

  /**
   * 是否需要获取数据
   */
  get needFetchData(): boolean {
    return !this.noField || this.thisStatic.sql.enable;
  }

  /**
   * 是否开启联动
   */
  get isReact(): boolean {
    return this.thisDashboard.analysis.isReact;
  }

  mounted() {
    this.setActiveIndex(-1);

    if (!this.chartComponent) return;

    // 初始化
    this.chartComponent?.initChart();

    // 绑定事件
    this.chartComponent.bindChartEvents(false, this.thisEvents);

    // 获取数据
    if (this.needFetchData && !this.noDimensions) {
      this.fetchToShow();
    } else if (this.isJsonEnable && !this.noDimensions) {
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
    this.changeChartType({ newType, oldType })
      .then(() => {
        this.chartComponent?.renderChart();
        this.chartComponent?.resizeChart();
      })
      .catch((err: Error) => {
        UIUtil.showErrorMessage("切换图表类型失败");
        console.error(err);
      });
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
    if (!this.isJsonEnable && !this.noDimensions) {
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
    deep: true,
    immediate: true
  })
  onAnalysisUpdate(): void {
    // 非当前仪表盘 || 正在打开菜单 || 不存在字段
    if (
      !this.isCurrent ||
      this.menuLoading ||
      this.noField ||
      this.isSqlEnable
    ) {
      return;
    }
    // if (this.noDimensions) {
    //   return this.chartComponent.clearChart();
    // }
    this.fetchToShow();
  }

  /**
   * 中间值
   */
  @Watch("resultTmp", {
    deep: true,
    immediate: false
  })
  onResultTmpChange(): void {
    this.chartComponent?.resizeChart();
    this.chartComponent?.renderChart(this.resultTmp);
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
    if (!this.isCurrent || this.menuLoading) {
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
   * 获取偏移位置
   * 拖拽结束
   */
  onDragStop(x: number, y: number): void {
    // 防止出现非当前下标的元素被操作的问题
    this.setActiveIndex(this.index);
  }

  /**
   * 拖拽进行时
   */
  onDrageding(x: number, y: number) {
    this.setPosition(x, y);
    this.chartComponent?.resizeChart();
  }

  /**
   * 调整大小
   * 调整结束
   */
  onResizeStop(x: number, y: number, width: number, height: number): void {
    if (this.activeIndex === -1) return;
    // 防止出现非当前下标的元素被操作的问题
    this.setActiveIndex(this.index);

    this.setPosition(x, y);
    this.setSize(width, height);

    // 如果类型为 Echarts 图表，则调用 resize 方法
    setTimeout(() => {
      this.chartComponent?.resizeChart();
    }, 500);

    this.hideDetailBar(true);
  }

  /**
   * 设置数据的坐标
   */
  setPosition(x: number, y: number): void {
    this.thisDashboard.visualData.position.x = x;
    this.thisDashboard.visualData.position.y = y;
  }

  /**
   * 设置数据的尺寸
   */
  setSize(width: number, height: number): void {
    this.thisDashboard.visualData.width = width;
    this.thisDashboard.visualData.height = height;
  }

  /**
   * 切换悬浮工具栏隐藏状态
   */
  hideDetailBar(hide: boolean): void {
    this.isShowDetail = !hide;
  }

  /**
   * 获取数据，展示图表
   */
  fetchToShow(): Promise<void> {
    this.isFetching = true;
    const reactWhere = {
      rotationTask: {} as any,
      selectedIndex: null,
      oldDashboardId: null,
      dashboardId: null,
      datasetId: null,
      where: null
    };
    const isCurrent = this.reactWhere.dashboardId === this.thisDashboard.id;
    // 获取数据
    return ComponentUtil.fetchData(
      this.isSqlEnable,
      this.thisDashboard as any,
      this.isReact && !isCurrent ? this.reactWhere : reactWhere,
      this.chartComponent
    )
      .then(data => {
        if (this.thisStatic.sql.enable) {
          UIUtil.showMessage("暂不支持 SQL 查询", MessageType.warning);
          this.chartComponent.clearChart();
          return;
        }
        // 分析成功
        this.analysisSuccess = true;

        this.resultTmp = data;

        // 不存在时，初始化图表
        // this.chartComponent.initChart();

        // 调整尺寸
        this.chartComponent?.resizeChart();

        // 绘制图表
        // this.chartComponent.renderChart();
      })
      .catch(err => {
        // 分析失败
        this.analysisSuccess = false;
        UIUtil.showErrorMessage("分析出错，请稍后重试");
        console.error(err);
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
$bgColor: #fff;
$handleColor: #09f;
$borderColor: #00a2ff;
$shadowColor: #58bee9;
$shadow: 0 0 6px $shadowColor;
@mixin topAndLeft($top, $left) {
  margin-top: $top;
  margin-left: $left;
}

.vdr {
  background-color: $bgColor;
  cursor: move;

  // 悬停效果
  &:hover {
    box-shadow: $shadow;
  }

  // 当前激活的元素
  &.activeElement {
    border: 1px solid $borderColor;
  }

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

  .draggable-content {
    position: relative;
    width: 100%;
    height: 100%;

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

  /**
   * 手柄部分自定义样式
   */
  ::v-deep {
    .handle {
      width: 10px;
      height: 10px;
      box-shadow: 0 0 0;
      border: 3px solid $handleColor;
      background-color: transparent;
      z-index: 999;
    }

    // top
    .handle-tl,
    .handle-tm,
    .handle-tr {
      top: 0;
      border-bottom: none;
    }

    // right
    .handle-tr,
    .handle-mr,
    .handle-br {
      left: 100%;
      border-left: none;
    }

    // bottom
    .handle-bl,
    .handle-bm,
    .handle-br {
      top: 100%;
      border-top: none;
    }

    // left
    .handle-tl,
    .handle-ml,
    .handle-bl {
      left: 0;
      border-right: none;
    }

    // center
    .handle-tm,
    .handle-bm {
      border-left: none;
      border-right: none;
      border-width: 5px;
    }

    // middle
    .handle-ml,
    .handle-mr {
      border-top: none;
      border-bottom: none;
      border-width: 5px;
    }

    // topLeft
    .handle-tl {
      @include topAndLeft(3px, 3px);
    }

    // topMiddle
    .handle-tm {
      @include topAndLeft(2px, -5px);
    }

    // topRight
    .handle-tr {
      @include topAndLeft(3px, -6px);
    }

    // middleLeft
    .handle-ml {
      @include topAndLeft(-5px, 2px);
    }

    // middleRight
    .handle-mr {
      @include topAndLeft(-5px, -5px);
    }

    // bottomLeft
    .handle-bl {
      @include topAndLeft(-6px, 3px);
    }

    // bottomMiddle
    .handle-bm {
      @include topAndLeft(-5px, -5px);
    }

    // bottomRight
    .handle-br {
      @include topAndLeft(-6px, -6px);
    }
  }
}
</style>
