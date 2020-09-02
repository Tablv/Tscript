<template>
  <div class="specific-style-items">
    <!-- 长宽比 -->
    <!-- <el-form-item label="长宽比">
      <el-row>
        <el-col :span="24">
          <el-slider
            v-model="currentDashboard.echarts.geo.aspectScale"
            :format-tooltip="formatTooltip"
            :min="1"
          />
        </el-col>
      </el-row>
    </el-form-item> -->
    <!-- 放大 -->
    <!-- <el-form-item label="放大倍数">
      <el-row>
        <el-col :span="24">
          <el-slider
            v-model="currentDashboard.echarts.geo.zoom"
            step="0.1"
            :min="1"
            :max="10"
          />
        </el-col>
      </el-row>
    </el-form-item> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { BarSeriesOption } from "glaway-bi-model/view/dashboard/chart/SeriesOption";

@Component({
  components: {}
})
export default class BarStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: any;

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle(): BarSeriesOption {
    return this.getSpecificStyle();
  }
  formatTooltip(val: number) {
    return val / 100;
  }
}
</script>
