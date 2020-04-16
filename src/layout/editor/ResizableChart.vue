<template>
  <div class="resizable-chart">
    <vdr
      @dragstop="onDragStop"
      @resizestop="onResizeStop"
      :w="thisDashboard.visualData.width"
      :h="thisDashboard.visualData.height"
      :grid="thisDashboard.visualData.grid"
      :x="thisDashboard.visualData.position.x"
      :y="thisDashboard.visualData.position.y"
      :z="thisDashboard.visualData.position.z"
      :class="{ activeElement: index === activeIndex }"
    >
      <div
        class="draggable-content"
        @mousedown="hideDetailBar(true)"
        v-loading="isFetching"
      >
        <div class="toolbar-box" @click.stop v-show="isCurrent">
          <chart-toolbar
            v-model="isShowDetail"
            :dashboard.sync="thisDashboard"
          />
        </div>

        <!-- 既没有拖入字段，也没有启用静态数据，显示如下 -->
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
          :item="thisDashboard"
          :index="index"
          :style="{
            width: thisDashboard.visualData.width + 'px',
            height: thisDashboard.visualData.height + 'px'
          }"
        />
      </div>
    </vdr>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

// Vue-Draggable-Resizable
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
import { CommonStore, EditorStore } from "@/store/modules-model";
import Dashboard from "@/model/view/dashboard/Dashboard";
import { ChartType } from "@/enums/ChartType";
import ReactWhere from "@/model/view/ReactWhere";
import ChartUIService from "@/service/interfaces/ChartUIService";
import { reactUpdate } from "@/service/EChartsService";
import ChartComponent from "@/layout/common/EChartsComponent.vue";
import ObjectUtil from "@/util/ObjectUtil";
import UIUtil, { MessageType } from "@/util/UIUtil";
import ChartToolbar from "@/layout/common/chart-toolbar/CommonToolbar.vue";
import { customDataTemplates } from "@/config/DefaultTemplate";

@Component({
  components: {
    vdr,
    ChartToolbar,
    ChartComponent
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

  /**
   * 标志位
   */
  // 不监听分析结果
  @CommonStore.State("savingAnalysis")
  savingAnalysis!: boolean;

  @CommonStore.Mutation("setSavingAnalysis")
  setSavingAnalysis!: Function;

  // 正在加载菜单
  @EditorStore.State("menuLoading")
  menuLoading!: boolean;

  // 是否正在加载数据
  isFetching = false;

  // 是否分析成功
  analysisSuccess = true;

  // 是否显示详细工具栏
  isShowDetail = false;

  /**
   * 仪表盘部分
   */
  @CommonStore.State("dashboards")
  dashboards!: Array<Dashboard>;

  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  @CommonStore.Mutation("setDashboardIndex")
  setActiveIndex!: Function;

  @CommonStore.State("reactWhere")
  reactWhere!: ReactWhere;

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
    this.item = dashboard;
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
   */
  get noField(): boolean {
    let options = this.thisDashboard.analysis;
    return (
      ObjectUtil.isEmptyArray(options.dimensions) &&
      ObjectUtil.isEmptyArray(options.measures)
    );
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
   * 需要获取数据
   */
  get needFetchData(): boolean {
    return !this.noField || this.thisStatic.sql.enable;
  }

  mounted() {
    if (!this.chartComponent) return;

    // 初始化
    this.chartComponent.initChart();

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

  @Watch("thisChartType")
  onChartTypeChange(newType: ChartType, oldType: ChartType) {
    this.changeChartType({ newType, oldType })
      .then(() => {
        this.chartComponent?.renderChart();
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
    if (!this.isJsonEnable) {
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

  // 联动
  @Watch("reactWhere", {
    deep: true,
    immediate: true
  })
  onReactWhereUpdate(): void {
    reactUpdate(this.thisDashboard, this.reactWhere, this.fetchToShow);
  }

  @Watch("thisAnalysis", {
    deep: true,
    immediate: true
  })
  onAnalysisUpdate(): void {
    // 正在保存分析临时数据
    if (this.savingAnalysis) {
      this.setSavingAnalysis(false);
      return;
    }

    // 非当前仪表盘 || 正在打开菜单 || 不存在字段
    if (!this.isCurrent || this.menuLoading || this.noField) {
      return;
    }

    this.fetchToShow();
  }

  @Watch("thisEchartsOption", {
    deep: true,
    immediate: true
  })
  onEchartsOptionUpdate(): void {
    /**
     * 非当前仪表盘 || 正在打开菜单
     */
    if (!this.isCurrent || this.menuLoading) {
      return;
    }

    this.chartComponent?.renderChart();
  }

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
   * 获取偏移位置
   */
  onDragStop(x: number, y: number): void {
    // 防止出现非当前下标的元素被操作的问题
    this.setActiveIndex(this.index);
    this.setPosition(x, y);
  }

  /**
   * 调整大小
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
  fetchToShow(): void {
    this.isFetching = true;

    // 获取数据
    this.chartComponent
      ?.fetchData()
      .then(data => {
        if (this.thisStatic.sql.enable) {
          UIUtil.showMessage("暂不支持 SQL 查询", MessageType.warning);
          this.chartComponent.clearChart();
          return;
        }

        // 分析成功
        this.analysisSuccess = true;

        // 防止无限循环监听，此时忽略监听Analysis属性
        this.setSavingAnalysis(true);
        this.thisAnalysis.resultTmp = data;

        // 不存在时，初始化图表
        this.chartComponent.initChart();

        // 调整尺寸
        this.chartComponent.resizeChart();

        // 绘制图表
        this.chartComponent.renderChart();
      })
      .catch(err => {
        // 分析失败
        this.analysisSuccess = false;
        UIUtil.showErrorMessage("分析出错，请稍后重试");
        console.error(err);
      })
      .finally(() => {
        this.isFetching = false;
      });
  }
}
</script>

<style lang="scss" scoped>
$bgColor: #fff;
$handleColor: #09f;
$borderColor: #00a2ff;
$shadowColor: #58bee9;
$shadow: 0 0 6px $shadowColor;

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
      margin-top: -2px;
      margin-left: -2px;
    }

    // topMiddle
    .handle-tm {
      margin-top: -3px;
      margin-left: -5px;
    }

    // topRight
    .handle-tr {
      margin-top: -2px;
      margin-left: -8px;
    }

    // middleLeft
    .handle-ml {
      margin-top: -5px;
      margin-left: -3px;
    }

    // middleRight
    .handle-mr {
      margin-top: -5px;
      margin-left: -7px;
    }

    // bottomLeft
    .handle-bl {
      margin-top: -8px;
      margin-left: -2px;
    }

    // bottomMiddle
    .handle-bm {
      margin-top: -7px;
      margin-left: -5px;
    }

    // bottomRight
    .handle-br {
      margin-top: -8px;
      margin-left: -8px;
    }
  }
}
</style>
