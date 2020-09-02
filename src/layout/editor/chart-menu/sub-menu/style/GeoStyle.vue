<template>
  <!-- 地图坐标系 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
    v-if="currentDashboard.echarts.geo"
  >
    <template #header>
      <span>地图坐标系</span>
    </template>
    <el-form label-position="right" :label-width="elFormLabelWidth">
      <!-- 长宽比 -->
      <el-form-item label="长宽比">
        <el-row>
          <el-col :span="24">
            <el-slider
              v-model="currentDashboard.echarts.geo.aspectScale"
              :format-tooltip="formatTooltip"
              :min="1"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 放大 -->
      <el-form-item label="放大倍数">
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
      </el-form-item>
      <value-unit-option
        form-label="顶部"
        v-model="currentDashboard.echarts.geo.layoutCenter[0]"
        :selection="styleSelection.grid.unit.selection"
      />
      <value-unit-option
        form-label="左侧"
        v-model="currentDashboard.echarts.geo.layoutCenter[1]"
        :selection="styleSelection.grid.unit.selection"
      />
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { BarSeriesOption } from "glaway-bi-model/view/dashboard/chart/SeriesOption";
import ValueUnitOption from "./common/ValueUnitOption.vue";

@Component({
  components: {
    ValueUnitOption
  }
})
export default class GeoStyle extends Vue {
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
  formatTooltip(val: number) {
    return val / 100;
  }
}
</script>
