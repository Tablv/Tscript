<template>
  <dialog-button
    :title="title"
    :icon-class="iconClass"
    :visible.sync="dialogVisible"
    :enable-footer="false"
    width="300px"
    @closed="close"
  >
    <template #dialog-content v-loading="isLoading">
      <el-row :gutter="20" class="dialog-main-box">
        <el-col :span="8" v-for="(opt, idx) in createOptions" :key="idx">
          <el-button
            class="change-type-chart-btn"
            :title="opt.title"
            :disabled="!opt.enable"
            @click="doClick(opt.createType)"
          >
            <svg class="icon-svg" aria-hidden="true">
              <use :xlink:href="'#' + opt.iconClass" />
            </svg>
          </el-button>
        </el-col>
      </el-row>
    </template>
  </dialog-button>
</template>

<script lang="ts">
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { CommonStore } from "@/store/modules-model";
import { Vue, Component, Emit, Model, Prop } from "vue-property-decorator";
import DialogButton from "../toolkit/DialogButton.vue";
import { ChartType } from "glaway-bi-model/enums/ChartType";
import { chartCreateOptions } from "@/config/EditorOptions";
import MenuOptions from "@/config/MenuOptions";
import ObjectUtil from "@/util/ObjectUtil";
import { thresholdComparators } from "glaway-bi-model/enums/ComparableSymbol";
import { WarnSymbolType } from "glaway-bi-model/enums/WarnType";

@Component({
  components: {
    DialogButton
  }
})
export default class TypeChangeView extends Vue {
  @Model("visible")
  visible!: boolean;

  @Prop()
  title!: string;

  @Prop()
  iconClass!: string;

  @Emit("close")
  close() {}

  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  get dialogVisible() {
    return this.visible;
  }

  set dialogVisible(val: boolean) {
    this.$emit("visible", val);
  }

  get createOptions() {
    // 维度
    const dimensionsNum =
      this.currentDashboard?.analysis.dimensions.length || 0;
    // 度量
    const measuresNum = this.currentDashboard?.analysis.measures.length || 0;

    const chartOptions = ObjectUtil.copy(chartCreateOptions);

    return chartOptions.map(item => {
      const menuOptions = ObjectUtil.copy(
        MenuOptions.getChartFunctionalOptions(item.createType)
      );
      item.enable = menuOptions.changeLimit.some((configs: any) => {
        const result =
          configs.dimensions.every((config: any) => {
            return this.doComparer(dimensionsNum, config.symbol, config.value);
          }) &&
          configs.measures.every((config: any) => {
            return this.doComparer(dimensionsNum, config.symbol, config.value);
          });
        return result;
      });
      return item;
    });
  }

  doComparer(
    value: number,
    symbol: WarnSymbolType,
    threshold: number
  ): boolean {
    const handle = thresholdComparators[symbol];
    if (!handle) {
      console.error(`找不到比较方法: ${symbol}`);
      return false;
    }
    const result = handle(value, threshold);

    return result;
  }

  doClick(chartType: ChartType) {
    this.currentDashboard.visualData.type = chartType;
    this.dialogVisible = false;
  }
}
</script>
<style lang="scss" scoped>
$mainMinHeight: 320px;
$mainMaxHeight: 350px;

.dialog-main-box {
  min-height: $mainMinHeight;
  max-height: $mainMaxHeight;
  overflow-x: hidden;
}
.change-type-chart-btn {
  margin-bottom: 15px;
}
.change-type-chart-btn.is-disabled,
.change-type-chart-btn.is-disabled:focus,
.change-type-chart-btn.is-disabled:hover {
  background: #dddddd;
}
</style>
