<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span
        >数据设置
        <!-- <el-tag style="margin-left: 6px;" size="mini" type="danger"
          >待开发</el-tag
        > -->
      </span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="小数位数设置">
        <el-input-number v-model="decimals.value" :min="0" />
      </el-form-item>

      <el-form-item label="数据单位">
        <el-input v-model="decimals.unit" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject, Model } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "@/model/view/dashboard/Dashboard";

@Component
export default class DataStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  boxCardShadow!: string;

  get decimals() {
    const currentDashboard: any = this.currentDashboard as any;
    const chartType = currentDashboard.visualData.type;
    return currentDashboard.echarts.sampleStyle[chartType].decimals;
  }
}
</script>

<style lang="scss" scoped></style>
