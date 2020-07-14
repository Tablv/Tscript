<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>图表样式</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <!-- 配色部分 -->
      <color-option />

      <!-- 柱宽 -->
      <el-form-item label="柱宽">
        <el-row>
          <el-col :span="12">
            <el-slider v-model="specificStyle.width.value" :max="30" :min="1" />
          </el-col>
          <el-col :span="10" :offset="2">
            <el-select
              v-model="specificStyle.width.unit"
              size="mini"
              placeholder="单位"
            >
              <el-option
                v-for="(unit, index) in styleSelection.series.barWidth.unit
                  .selection"
                :key="index"
                :label="unit.text"
                :value="unit.value"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ColorOption from "../common/ColorOption.vue";
import {
  BarChartOption,
  ChartOption
} from "glaway-bi-model/view/dashboard/chart/ChartOption";

@Component({
  components: {
    ColorOption
  }
})
export default class BarStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: any;

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle(): ChartOption {
    return this.getSpecificStyle();
  }

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;
}
</script>

<style lang="scss" scoped>
.position-lable {
  position: absolute;
  z-index: 10;
  left: -34px;
  font-size: 13px;
  color: #606266;
}
</style>
