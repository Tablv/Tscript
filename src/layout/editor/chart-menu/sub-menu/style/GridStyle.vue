<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>数值轴</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <value-unit-option
        form-label="顶部"
        v-model="currentDashboard.echarts.sampleStyle.global.grid.top"
        :selection="styleSelection.grid.unit.selection"
      />

      <value-unit-option
        form-label="底部"
        v-model="currentDashboard.echarts.sampleStyle.global.grid.bottom"
        :selection="styleSelection.grid.unit.selection"
      />

      <value-unit-option
        form-label="左侧"
        v-model="currentDashboard.echarts.sampleStyle.global.grid.left"
        :selection="styleSelection.grid.unit.selection"
      />

      <value-unit-option
        form-label="右侧"
        v-model="currentDashboard.echarts.sampleStyle.global.grid.right"
        :selection="styleSelection.grid.unit.selection"
      />

      <el-form-item label="显示网格">
        <el-switch
          v-model="currentDashboard.echarts.grid.show"
          active-color="#13ce66"
        >
        </el-switch>
      </el-form-item>

      <el-form-item label="包含标签">
        <el-switch
          v-model="currentDashboard.echarts.grid.containLabel"
          active-color="#13ce66"
        >
        </el-switch>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ValueUnitOption from "./common/ValueUnitOption.vue";

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
}
</script>

<style lang="scss" scoped></style>
