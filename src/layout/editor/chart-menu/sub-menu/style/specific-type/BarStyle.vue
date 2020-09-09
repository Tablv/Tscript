<template>
  <div class="specific-style-items">
    <!-- 柱宽 -->
    <el-form-item label="柱宽">
      <el-row>
        <el-col :span="12">
          <el-slider v-model="specificStyle.width.value" :min="1" />
        </el-col>
        <el-col :span="8" :offset="2">
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
  </div>
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
}
</script>
