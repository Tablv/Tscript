<template>
  <!-- 属性设置 -->
  <div>
    <!-- 外观样式 -->
    <appearance-style />

    <!-- 图表样式 -->
    <specific-style />

    <!-- 地图组件 -->
    <geo-style />

    <!-- 视觉映射 -->
    <visual-map-style />

    <!-- 数据提示 -->
    <tooltip-style />

    <!-- 标题 -->
    <title-style />

    <!-- 图例 -->
    <legend-style />

    <!-- 标注 -->
    <mark-style />

    <!-- 数据 -->
    <data-style />

    <!-- 数据轴 -->
    <margin-style />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Provide } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import AppearanceStyle from "./style/AppearanceStyle.vue";
import SpecificStyle from "./style/SpecificStyle.vue";
import TitleStyle from "./style/TitleStyle.vue";
import MarginStyle from "./style/MarginStyle.vue";
import MarkStyle from "./style/MarkStyle.vue";
import DataStyle from "./style/DataStyle.vue";
import GeoStyle from "./style/GeoStyle.vue";
import VisualMapStyle from "./style/VisualMapStyle.vue";
import LegendStyle from "./style/LegendStyle.vue";
import TooltipStyle from "./style/TooltipStyle.vue";

@Component({
  components: {
    AppearanceStyle,
    SpecificStyle,
    TitleStyle,
    LegendStyle,
    MarkStyle,
    DataStyle,
    MarginStyle,
    GeoStyle,
    VisualMapStyle,
    TooltipStyle
  }
})
export default class StyleMenu extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @Provide()
  getSpecificStyle() {
    return this.currentDashboard.echarts.sampleStyle[this.chartType];
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
