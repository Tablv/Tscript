<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <div slot="header">
      <span>百分比堆积柱图样式</span>
    </div>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <!-- 配色部分 -->
      <color-option />

      <!-- 柱宽 -->
      <el-form-item label="柱宽">
        <el-row>
          <el-col :span="12">
            <el-slider
              v-model="
                currentDashboard.echarts.sampleStyle.barStack.width.value
              "
              :max="30"
              :min="1"
            />
          </el-col>
          <el-col :span="10" :offset="2">
            <el-select
              v-model="currentDashboard.echarts.sampleStyle.barStack.width.unit"
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
      <el-form-item label="标签">
        <el-row>
          <el-col :span="12">
            <el-switch
              v-model="currentDashboard.echarts.sampleStyle.barStack.label.show"
              active-color="#13ce66"
            />
          </el-col>
          <el-col :span="10" :offset="2">
            <el-select
              v-if="currentDashboard.echarts.sampleStyle.barStack.label.show"
              v-model="
                currentDashboard.echarts.sampleStyle.barStack.label.position
              "
              size="mini"
              placeholder="位置"
            >
              <el-option
                v-for="(unit, index) in styleSelection.series.barLabel.position
                  .selection"
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
              v-model="
                currentDashboard.echarts.sampleStyle.barStack.axisLabel.rotate
              "
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
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;
}
</script>

<style lang="scss" scoped></style>
