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

      <el-form-item label="背景色">
        <el-row>
          <el-col :span="5" :offset="1" style="height: 32px;">
            <el-color-picker
              v-model="currentDashboard.visualData.background"
              :show-alpha="true"
              color-format="hex"
              size="mini"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="边框">
        <el-switch v-model="borderFlag" active-color="#13ce66" />
      </el-form-item>
      <div v-show="borderFlag">
        <el-form-item label="颜色">
          <el-row>
            <el-col :span="5" :offset="1" style="height: 32px;">
              <el-color-picker
                v-model="currentDashboard.visualData.borderColor"
                :show-alpha="true"
                color-format="hex"
                size="mini"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="样式">
          <el-row>
            <el-col :span="12" :offset="1" style="height: 32px;">
              <el-select v-model="currentDashboard.visualData.borderStyle">
                <el-option key="dotted" label="点状" value="dotted" />
                <el-option key="solid" label="实线" value="solid" />
                <el-option key="double" label="双线" value="double" />
                <el-option key="dashed" label="虚线" value="dashed" />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="宽度">
          <el-row>
            <el-col :span="12" :offset="1" style="height: 32px;">
              <el-select v-model="currentDashboard.visualData.borderWidth">
                <el-option
                  v-for="(sel, idx) in styleSelection.legend.fontSize.selection"
                  :key="idx"
                  :label="sel.value"
                  :value="sel.value"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="圆角">
          <el-row>
            <el-col :span="12" :offset="1" style="height: 32px;">
              <el-slider
                class="grid-card-font-size"
                v-model="currentDashboard.visualData.borderRadius"
                :max="50"
                :min="0"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </div>

      <!-- 柱宽 -->
      <el-form-item label="柱宽">
        <el-row>
          <el-col :span="12">
            <el-slider v-model="specificStyle.width.value" :min="1" />
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

      <!-- 圆角 -->
      <el-form-item label="圆角">
        <el-row>
          <el-col :span="22">
            <el-slider v-model="specificStyle.radius" :min="1" />
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

  borderFlag: boolean = false;
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
