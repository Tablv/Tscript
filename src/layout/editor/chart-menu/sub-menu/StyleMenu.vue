<template>
  <!-- 属性设置 -->
  <div>
    <!-- 外观样式 -->
    <appearance-style />

    <!-- 图表样式 -->
    <specific-style />

    <!-- 标题 -->
    <title-style />

    <!-- 图例 -->
    <legend-style />

    <!-- 标注 -->
    <mark-style />

    <!-- 数据 -->
    <data-style />

    <!-- 数据轴 -->
    <grid-style />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Provide } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import AppearanceStyle from "./style/AppearanceStyle.vue";
import SpecificStyle from "./style/SpecificStyle.vue";
import TitleStyle from "./style/TitleStyle.vue";
import GridStyle from "./style/GridStyle.vue";
import MarkStyle from "./style/MarkStyle.vue";
import DataStyle from "./style/DataStyle.vue";
import LegendStyle from "./style/LegendStyle.vue";

@Component({
  components: {
    AppearanceStyle,
    SpecificStyle,
    TitleStyle,
    LegendStyle,
    MarkStyle,
    DataStyle,
    GridStyle
  }
})
export default class StyleMenu extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @Provide()
  getSpecificStyle() {
    return this.currentDashboard.echarts.sampleStyle[this.chartType];
  }
  @Provide()
  setPieCenter(config: object) {
    (this.currentDashboard.echarts.sampleStyle[
      this.chartType
    ] as any).center = config;
  }

  get chartType() {
    return this.currentDashboard.visualData.type;
  }
}
</script>

<style lang="scss" scoped>
// 颜色定义
$fieldColor: #409eff;
</style>
