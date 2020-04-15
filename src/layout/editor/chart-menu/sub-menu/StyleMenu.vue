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
    <data-style />

    <!-- 标签 -->
    <grid-style />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model } from "vue-property-decorator";
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
export default class StyleMenu extends Vue {}
</script>

<style lang="scss" scoped>
// 颜色定义
$fieldColor: #409eff;
</style>
