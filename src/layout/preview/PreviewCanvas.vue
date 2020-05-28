<template>
  <div class="borderBg">
    <preview-chart
      v-for="(item, index) in dashboards"
      :key="item.id"
      :item="item"
      :index="index"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PreviewChart from "./PreviewChart.vue";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { CommonStore } from "@/store/modules-model";

@Component({
  components: {
    PreviewChart
  }
})
export default class PreviewCanvas extends Vue {
  // 图表数据数组
  @CommonStore.State("dashboards")
  dashboards!: Array<Dashboard>;
}
</script>

<style lang="scss" scoped>
.borderBg {
  display: block;
  position: relative;
  margin: auto;
}
</style>
