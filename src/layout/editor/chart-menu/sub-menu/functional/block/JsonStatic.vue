<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <div slot="header">
      <span>使用 JSON 数据</span>
      <el-switch
        class="pull-right"
        active-color="#13ce66"
        :value="currentDashboard.staticData.json.enable"
        @click.native="jsonSwitchChange"
      ></el-switch>
    </div>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="数据">
        <el-input
          type="textarea"
          :autosize="{ minRows: 8 }"
          :disabled="!currentDashboard.staticData.json.enable"
          v-model="currentDashboard.staticData.json.data"
        ></el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "@/model/view/dashboard/Dashboard";
import UIUtil, { ConfirmType } from "@/util/UIUtil";

@Component
export default class JsonStatic extends Vue {
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

  jsonSwitchChange(): void {
    // 未启用 JSON 数据 && 启用 SQL 查询
    if (!this.jsonEnable && this.sqlEnable) {
      UIUtil.confirm(ConfirmType.info, "启用 JSON 数据时，将关闭 SQL 查询功能")
        .then(() => {
          this.sqlEnable = false;
          this.jsonEnable = true;
        })
        .catch(() => {});
    } else {
      this.jsonEnable = !this.jsonEnable;
    }
  }
}
</script>

<style lang="scss" scoped></style>
