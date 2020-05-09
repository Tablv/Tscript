<template>
  <div>
    <!-- 各图表自定义样式 -->
    <!-- <component :is="currentStyleView" /> -->
    <specific-style />

    <!-- 标题 -->
    <title-style />

    <!-- 图例 -->
    <legend-style />

    <!-- 标注 -->
    <mark-style />

    <!-- 数据 -->
    <data-style v-if="decimals" />

    <!-- 标签 -->
    <grid-style />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Provide } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import Dashboard from "@/model/view/dashboard/Dashboard";
import SpecificStyle from "./style/SpecificStyle.vue";
import TitleStyle from "./style/TitleStyle.vue";
import GridStyle from "./style/GridStyle.vue";
import MarkStyle from "./style/MarkStyle.vue";
import DataStyle from "./style/DataStyle.vue";
import LegendStyle from "./style/LegendStyle.vue";

@Component({
  components: {
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
  setSpecificStyle(val: object) {
    (this.currentDashboard.echarts.sampleStyle[
      this.chartType
    ] as any).centerConfig = val;
  }

  get chartType() {
    return this.currentDashboard.visualData.type;
  }

  get decimals() {
    return (
      (this.currentDashboard.echarts.sampleStyle[this.chartType] as any)
        .decimals || false
    );
  }
}
</script>

<style lang="scss" scoped>
// 颜色定义
$fieldColor: #409eff;
</style>
