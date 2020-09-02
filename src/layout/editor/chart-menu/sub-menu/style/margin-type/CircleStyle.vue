<template>
  <el-form label-position="right" :label-width="elFormLabelWidth">
    <value-unit-option
      form-label="顶部"
      v-model="specificStyle.center[1]"
      :selection="styleSelection.grid.unit.selection"
    />
    <value-unit-option
      form-label="左侧"
      v-model="specificStyle.center[0]"
      :selection="styleSelection.grid.unit.selection"
    />
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
