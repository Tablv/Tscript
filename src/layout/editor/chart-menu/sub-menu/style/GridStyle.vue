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
        v-model="specificStyle.grid.top"
        :selection="styleSelection.grid.unit.selection"
        @change="handlerAxias($event, 'yAxias')"
      />

      <value-unit-option
        form-label="底部"
        v-model="specificStyle.grid.bottom"
        :selection="styleSelection.grid.unit.selection"
        v-show="!this.specificStyle.centerConfig"
        @change="handleChange"
      />

      <value-unit-option
        form-label="左侧"
        v-model="specificStyle.grid.left"
        :selection="styleSelection.grid.unit.selection"
        @change="handlerAxias($event, 'xAxias')"
      />

      <value-unit-option
        form-label="右侧"
        v-model="specificStyle.grid.right"
        :selection="styleSelection.grid.unit.selection"
        v-show="!this.specificStyle.centerConfig"
        @change="handleChange"
      />

      <el-form-item label="显示网格" v-show="!this.specificStyle.centerConfig">
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
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
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

  @Inject()
  getSpecificStyle!: Function;

  @Inject()
  setPieCenterConfig!: Function;

  get specificStyle() {
    return this.getSpecificStyle();
  }

  handlerAxias(conObj: { value: string; unit: string }, fieldName: string) {
    this.handleChange();
    if (!this.specificStyle.centerConfig) return;
    let config = Object.assign({}, this.specificStyle.centerConfig);
    config[fieldName] = Object.values(conObj).join("");
    this.setPieCenterConfig(config);
  }

  handleChange() {
    Object.assign(
      this.currentDashboard.echarts.sampleStyle.global.grid,
      this.specificStyle.grid
    );
  }
}
</script>

<style lang="scss" scoped></style>
