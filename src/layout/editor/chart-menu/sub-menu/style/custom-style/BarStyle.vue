<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>柱图样式</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <!-- 配色部分 -->
      <color-option />

      <!-- 柱宽 -->
      <el-form-item label="柱宽">
        <el-row>
          <el-col :span="12">
            <el-slider
              v-model="specificStyle.width.value"
              :max="30"
              :min="1"
            />
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

      <!-- 标签 (Y轴) -->
      <el-form-item label="数据标注">
        <el-row>
          <el-col :span="12">
            <el-switch
              v-model="specificStyle.label.show"
              active-color="#13ce66"
            />
          </el-col>
          <el-col v-if="specificStyle.label.show" :span="10"  :offset="2" style="position: relative;">
            <span class="position-lable">位置</span>
            <el-select
              v-model="specificStyle.label.position"
              size="mini"
              placeholder="位置"
            >
              <el-option
                v-for="(unit, index) in styleSelection.series.barLabel.position.selection"
                :key="index"
                :label="unit.text"
                :value="unit.value"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 标签角度 -->
      <el-form-item label="标签角度">
        <el-row>
          <el-col :offset="1" :span="23">
            <el-slider
              v-model="specificStyle.axisLabel.rotate"
              :max="360"
              :min="0"
            />
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
import Dashboard from "@/model/view/dashboard/Dashboard";
import ColorOption from "../common/ColorOption.vue";
import { BarChartOption } from "@/config/chart-config/Bar";
import { ChartOption } from '@/config/ChartConfig';

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
.position-lable{
  position:absolute;
  z-index: 10;
  left: -34px;
  font-size: 13px;
  color: #606266;
}
</style>
