<template>
  <div class="preview-element" :style="sizeStyle">
    <chart-component :item="item" :index="index" ref="chartComponent" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ReactWhere from "@/model/view/ReactWhere";
import DashboardSet from "@/model/view/DashboardSet";
import { reactUpdate } from "@/service/EChartsService";
import ChartUIService from "@/service/interfaces/ChartUIService";
import ChartComponent from "@/layout/common/EChartsComponent.vue";
import ViewUtil from "@/util/ViewUtil";
import UIUtil, { MessageType } from "@/util/UIUtil";

@Component({
  components: {
    ChartComponent
  }
})
export default class PreviewChart extends Vue {
  /**
   * 仪表盘数组
   */
  @CommonStore.State("dashboards")
  dashboards!: Array<Dashboard>;

  // 仪表盘集样式
  @CommonStore.State("dashboardSet")
  dashboardSet!: DashboardSet;

  @CommonStore.State("reactWhere")
  reactWhere!: ReactWhere;

  @CommonStore.Mutation("setReactWhere")
  setReact!: Function;

  @Prop()
  item!: Dashboard;

  @Prop()
  index!: number;

  // 尺寸样式类
  sizeStyle: SizeStyle | any = {};

  /**
   * Getter
   */
  get thisDashboard(): Dashboard {
    return this.dashboards[this.index];
  }

  get thisAnalysis() {
    return this.thisDashboard.analysis;
  }

  get thisStatic() {
    return this.thisDashboard.staticData;
  }

  get thisEvents() {
    return this.thisDashboard.events;
  }

  get chartComponent(): ChartUIService {
    return this.$refs.chartComponent as any;
  }

  mounted(): void {
    this.chartComponent.initChart();

    // 设置比例
    this.setRatio();

    window.addEventListener("resize", () => {
      this.setRatio();
    });

    // 获取分析数据
    this.fetchToShow();
  }

  @Watch("dashboardSet", { deep: true })
  onDashboardSetUpdate(): void {
    this.setRatio();
  }

  @Watch("reactWhere", { deep: true })
  onReactWhereUpdate(): void {
    reactUpdate(this.thisDashboard, this.reactWhere, this.fetchToShow);
  }

  /**
   * 设置图表显示比例
   */
  setRatio(): void {
    /* eslint-disable */
    let setStyle = this.dashboardSet,
      dashboard = this.thisDashboard,
      editorWidth = setStyle.widthRatio * setStyle.tempParams.ratio,
      viewWidth = ViewUtil.getViewportWidth(),
      ratio = Math.floor((viewWidth / editorWidth) * 100) / 100 - 0.01;
    /* eslint-enable */

    this.sizeStyle = {
      width: `${dashboard.visualData.width * ratio}px`,
      height: `${dashboard.visualData.height * ratio}px`,
      left: `${dashboard.visualData.position.x * ratio}px`,
      top: `${dashboard.visualData.position.y * ratio}px`,
      zIndex: dashboard.visualData.position.z
    };

    this.chartComponent.resizeChart();
  }

  fetchToShow(): void {
    this.chartComponent.fetchData().then(data => {
      if (this.thisStatic.sql.enable) {
        UIUtil.showMessage("暂不支持 SQL 查询", MessageType.warning);
        return;
      }
      this.thisAnalysis.resultTmp = data;
      this.chartComponent.renderChart();
      this.chartComponent.bindChartEvents(true, this.thisEvents);
    });
  }
}

/**
 * 尺寸样式
 */
export interface SizeStyle {
  // 宽度
  width: string;

  // 高度
  height: string;

  // 左偏移
  left: string;

  // 顶偏移
  top: string;

  // 层级
  zIndex: number;
}
</script>

<style lang="scss" scoped>
$bgColor: #fff;
$handleColor: map-get($colors, "chart");
$borderColor: #00a2ff;
$shadowColor: #ccc;

$shadow: 0 10px 20px $shadowColor;

.preview-element {
  background-color: $bgColor;
  position: absolute;
  @include transition(0.2s);

  box-sizing: border-box;
  border: 1px solid $shadowColor;
  overflow: hidden;

  // 悬停效果
  // &:hover {
  //     box-shadow: $shadow;
  // }

  // 修复调整尺寸时，图表溢出的问题
  .chart-wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .no-chart {
    background: url("#{$basePath}img/no-chart.svg") no-repeat center;
    background-size: contain;
    position: absolute;
    top: 40px;
    left: 20px;
    right: 20px;
    bottom: 0;
  }
}
</style>
