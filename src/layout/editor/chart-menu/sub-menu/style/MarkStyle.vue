<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <div slot="header">
      <span
        >数据标注
        <el-tag style="margin-left: 6px;" size="mini" type="danger"
          >待开发</el-tag
        >
      </span>
    </div>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="显示数据标签">
        <el-switch active-color="#13ce66" />
      </el-form-item>

      <el-form-item label="显示数据标注">
        <el-switch active-color="#13ce66" />
      </el-form-item>

      <el-form-item label="位置">
        <el-input />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "@/model/view/dashboard/Dashboard";

@Component
export default class MarkStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  boxCardShadow!: string;
}
</script>

<style lang="scss" scoped></style>
