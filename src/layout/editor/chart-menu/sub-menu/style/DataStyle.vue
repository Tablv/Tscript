<template>
  <!-- 数据设置 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>数据设置</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="小数位数设置">
        <el-input-number v-model="specificStyle.decimals.value" :min="0" />
      </el-form-item>

      <el-form-item label="数据单位" v-if="!this.specificStyle.centerConfig">
        <el-input v-model="specificStyle.decimals.unit" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject, Model } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

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

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle() {
    return this.getSpecificStyle();
  }
}
</script>

<style lang="scss" scoped></style>
