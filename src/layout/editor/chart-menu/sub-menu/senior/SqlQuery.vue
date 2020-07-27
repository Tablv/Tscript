<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header class="clearfix">
      <span
        >使用 SQL 查询
        <el-tag style="margin-left: 6px;" size="mini" type="danger"
          >待开发</el-tag
        >
      </span>
      <el-switch
        class="pull-right"
        active-color="#13ce66"
        :value="currentDashboard.staticData.sql.enable"
        @click.native="sqlSwitchChange"
      />
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="SQL">
        <el-input
          type="textarea"
          :autosize="{ minRows: 8 }"
          :disabled="!currentDashboard.staticData.sql.enable"
          v-model="currentDashboard.staticData.sql.data"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import UIUtil, { ConfirmType } from "@/util/UIUtil";

@Component
export default class SqlQuery extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;
  // @Inject()
  // elFormLabelWidth!: string;
  elFormLabelWidth: string = "50px";

  /**
   * Getter Setter
   */
  get jsonEnable(): boolean {
    return this.currentDashboard.staticData.json.enable;
  }

  get sqlEnable(): boolean {
    return this.currentDashboard.staticData.sql.enable;
  }

  set jsonEnable(value: boolean) {
    this.currentDashboard.staticData.json.enable = value;
  }

  set sqlEnable(value: boolean) {
    this.currentDashboard.staticData.sql.enable = value;
  }

  sqlSwitchChange(): void {
    // 待开发功能
    (this as any).$message.info("功能待开发");
    return;

    // 未启用 SQL 查询 && 启用 JSON 数据
    if (!this.sqlEnable && this.jsonEnable) {
      UIUtil.confirm(ConfirmType.info, "启用 SQL 查询时，将关闭 JSON 数据功能")
        .then(() => {
          this.jsonEnable = false;
          this.sqlEnable = true;
        })
        .catch(() => {});
    } else {
      this.sqlEnable = !this.sqlEnable;
    }
  }
}
</script>

<style lang="scss" scoped></style>
