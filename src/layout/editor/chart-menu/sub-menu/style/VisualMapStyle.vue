<template>
  <!-- 视觉映射 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
    v-if="currentDashboard.echarts.visualMap"
  >
    <template #header>
      <span>视觉映射</span>
    </template>
    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="开启映射功能">
        <el-switch
          active-color="#13ce66"
          v-model="currentDashboard.echarts.visualMap.enable"
        />
      </el-form-item>
      <el-form-item label="显示映射组件">
        <el-switch
          active-color="#13ce66"
          v-model="currentDashboard.echarts.visualMap.show"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { BarSeriesOption } from "glaway-bi-model/view/dashboard/chart/BarSeriesOption";

@Component({
  components: {}
})
export default class VisualMapStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: any;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle(): BarSeriesOption {
    return this.getSpecificStyle();
  }
}
</script>
