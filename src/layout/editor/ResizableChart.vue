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
      :class="{ activeElement: index === activeIndex }"
    >
      <div
        class="draggable-content"
        @mousedown="hideDetailBar(true)"
        v-loading="isFetching"
      >
        <div class="toolbar-box">
          <chart-toolbar :dashboard.sync="thisDashboard" />
        </div>
        <!-- v-model="isShowDetail" -->

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
          :dashboard.sync="thisDashboard"
          :anslysisdata="resultTmp"
          :key="index"
        />
      </div>
    </vdr>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue, Provide } from "vue-property-decorator";
import ChartComponent from "glaway-bi-component/src/components/ChartComponent";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ChartUIService from "glaway-bi-component/src/interfaces/ChartUIService";
// Vue-Draggable-Resizable
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { ChartType } from "@/enums/ChartType";
import ObjectUtil from "@/util/ObjectUtil";
import UIUtil, { MessageType } from "@/util/UIUtil";
import ChartToolbar from "@/layout/common/chart-toolbar/CommonToolbar.vue";
import {
  AnalysisResults,
  AnalysisResult
} from "../../model/types/AnalysisResults";
import ReactWhere from "@/model/view/ReactWhere";
import { SortType } from "@/enums/SortType";
import EChartsService, {
  reactUpdate,
  bindEvents,
  renderChart,
  renderChartByJSON
} from "glaway-bi-component/src/service/EChartsService";
import FieldDTO from "../../model/params/FieldDTO";
import EChartsUtil from "../../util/EChartsUtil";
// import { AxiosRequest } from "../../api/AxiosRequest";
import { AxiosRequest } from "../../api/mock";
import DashboardUtil from "../../util/DashboardUtil";

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

  resultTmp: AnalysisResults = [];

  defaultConfig: any;

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
   * 是否需要获取数据
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

    // this.chartComponent.resizeChart();

    // this.chartComponent.renderChart();
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
    reactUpdate(this.thisDashboard as any, this.reactWhere, this.fetchToShow);
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

  @Watch("resultTmp", {
    deep: true,
    immediate: false
  })
  onResultTmpChange(): void {
    this.chartComponent.resizeChart();
    this.chartComponent.renderChart(this.resultTmp);
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
   * 拖拽结束
   */
  onDragStop(x: number, y: number): void {
    // 防止出现非当前下标的元素被操作的问题
    this.setActiveIndex(this.index);
  }

  onDrageding(x: number, y: number) {
    this.setPosition(x, y);
    this.chartComponent.resizeChart();
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
   * 自定义排序
   */
  doCustomOrder(
    dataArray: AnalysisResults,
    dashboard: Dashboard
  ): AnalysisResults {
    let sort = dashboard.analysis.sort;
    if (sort.type !== SortType.customOrder) return dataArray;

    // 复制数组
    dataArray = ObjectUtil.copy(dataArray);
    // 排序后的数组
    let sortedData: AnalysisResults = [],
      fieldAlias: Array<string> = dashboard.analysis.dimensions.flatMap(
        (fieldDTO: FieldDTO) => fieldDTO.alias
      );

    /**
     * 符合排序要求的存入 sortedData
     * 其他存入 tempData 待遍历完成后一并存入 sortedData
     */
    sort.custom.map((fieldValue: string) => {
      for (let i = 0; i < dataArray.length; i++) {
        let data: AnalysisResult = dataArray[i];

        fieldAlias.map((columnName: string) => {
          if (
            data.hasOwnProperty(columnName) &&
            data[columnName] === fieldValue
          ) {
            sortedData.push(ObjectUtil.copy(data));
            // 复制后 删除源数组对应的值
            dataArray.splice(i--, 1);
          }
        });
      }
    });

    // 排序的数组 与剩余值的数组合并 返回新数组
    return sortedData.concat(dataArray);
  }

  /**
   * 请求后端，分析维度度量数据
   * 返回Promise 分析结果
   */
  fetchAnalysisData(
    thisDashboard: Dashboard,
    reactWhere: ReactWhere
  ): Promise<AnalysisResults> {
    // 分析参数
    let analysisDTO = DashboardUtil.getAnalysisDTO(thisDashboard as any);

    // 判断数据集是否一致
    if (thisDashboard.analysis.datasetId === reactWhere.datasetId) {
      DashboardUtil.pushReactWhere(analysisDTO.where, reactWhere);
    }
    return AxiosRequest.analysis.fetch(analysisDTO);
    // return AxiosReq.analysis.fetch(analysisDTO);
  }

  /**
   * 请求后端，查询 SQL
   * 返回Promise 分析结果
   */
  fetchSqlData(sql: string): Promise<any> {
    return AxiosRequest.analysis.fetchSQL(sql);
  }

  /**
   * 获取数据
   */
  async fetchData(): Promise<AnalysisResults> {
    // 判断是否为 SQL
    let fetchPromise: Promise<AnalysisResults> = this.isSqlEnable
      ? this.fetchSqlData(this.thisDashboard.staticData.sql.data)
      : this.fetchAnalysisData(this.thisDashboard as any, this.reactWhere);
    return fetchPromise
      .then((data: AnalysisResults) => {
        data = this.doCustomOrder(data, this.thisDashboard);
        return Promise.resolve(data);
      })
      .catch(err => {
        this.chartComponent.clearChart();
        return Promise.reject(err);
      });
  }

  /**
   * 获取数据，展示图表
   */
  fetchToShow(): void {
    this.isFetching = true;
    // 获取数据
    this.fetchData()
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

        // (that.thisAnalysis as any).resultTmp = data;
        this.$set(this.thisAnalysis, "resultTmp", data);
        this.resultTmp = data;
        // 分析成功
        //     this.analysisSuccess = true;

        //     // 防止无限循环监听，此时忽略监听Analysis属性
        //     this.setSavingAnalysis(true);
        //     this.thisAnalysis.resultTmp = data;

        //     // 不存在时，初始化图表
        //     this.chartComponent.initChart();

        //     // 调整尺寸
        //     this.chartComponent.resizeChart();

        //     // 绘制图表
        //     this.chartComponent.renderChart();
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
