<template>
  <!-- 数据轴 -->
  <el-form label-position="right" :label-width="elFormLabelWidth">
    <!-- 标签角度 -->
    <el-form-item label="标签角度" v-if="!specificStyle.center">
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

    <value-unit-option
      form-label="顶部"
      v-model="currentDashboard.echarts.grid.top"
      :selection="styleSelection.grid.unit.selection"
    />

    <value-unit-option
      form-label="底部"
      v-model="currentDashboard.echarts.grid.bottom"
      :selection="styleSelection.grid.unit.selection"
      v-show="!specificStyle.center"
    />

    <value-unit-option
      form-label="左侧"
      v-model="currentDashboard.echarts.grid.left"
      :selection="styleSelection.grid.unit.selection"
    />

    <value-unit-option
      form-label="右侧"
      v-model="currentDashboard.echarts.grid.right"
      :selection="styleSelection.grid.unit.selection"
    />

    <el-form-item label="显示网格" v-show="!specificStyle.center">
      <el-switch
        v-model="currentDashboard.echarts.grid.show"
        active-color="#13ce66"
      >
      </el-switch>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ValueUnitOption from "../common/ValueUnitOption.vue";

@Component({
  components: {
    ValueUnitOption
  }
})
export default class GridStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: Object;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle() {
    return this.getSpecificStyle();
  }
}
</script>

<style lang="scss" scoped></style>
