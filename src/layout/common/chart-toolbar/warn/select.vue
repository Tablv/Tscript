<template>
  <section class="select-view">
    <main>
      <!-- 添加按钮 -->
      <el-button class="row-button" size="medium" @click="doCreate">
        <i class="el-icon-plus"></i>
        <span>添加预警</span>
      </el-button>

      <!-- 分割线 -->
      <el-divider />

      <!-- 选择已有配置 -->
      <el-radio v-model="appliedDatapackId" :label="DEFAULT_VALUE" border>
        <div class="label-container">
          <div class="label-main">
            <div class="label-title">无预警</div>
          </div>
        </div>
      </el-radio>

      <el-radio
        v-for="(warnDatapack, datapackIndex) in warnDatapacks"
        :key="warnDatapack.id"
        v-model="appliedDatapackId"
        :label="warnDatapack.id"
        border
      >
        <div class="label-container">
          <div class="label-main">
            <div class="label-title">{{ warnDatapack.name }}</div>
          </div>
          <div class="label-option">
            <el-button
              size="medium"
              type="text"
              icon="el-icon-edit"
              @click="doEdit(datapackIndex)"
            />

            <el-button
              size="medium"
              type="text"
              icon="el-icon-close"
              @click="removeDatapack(datapackIndex)"
            />
          </div>
        </div>
      </el-radio>
    </main>

    <footer>
      <el-button type="text" @click="close">关 闭</el-button>
      <el-button type="primary" @click="doApply">应 用</el-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import Dashboard from "@/model/view/dashboard/Dashboard";
import { CommonStore } from "@/store/modules-model";

import ObjectUtil from "@/util/ObjectUtil";
import { WarnDatapack, WARN_DEFAULT_VALUE } from "@/model/view/Warn";
import { AxiosRequest } from "@/config/AxiosRequest";
import UIUtil, { MessageType } from "@/util/UIUtil";

@Component
export default class SelectView extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  // 正在保存分析数据
  @CommonStore.Mutation("setSavingAnalysis")
  setSavingAnalysis!: Function;

  /**
   * Props
   */
  @Prop()
  datapacks!: Array<WarnDatapack>;

  /**
   * Emit
   */

  // 创建数据包
  @Emit("create")
  doCreate() {}

  // 编辑数据包
  @Emit("edit")
  doEdit(datapackIndex: number) {
    return datapackIndex;
  }

  // 刷新
  @Emit("reload")
  doReload() {}

  // 应用
  @Emit("apply")
  doApply() {}

  // 关闭
  @Emit("close")
  close() {}

  // 默认值
  DEFAULT_VALUE = WARN_DEFAULT_VALUE;

  /**
   * 数据包
   */
  // 数据包
  get warnDatapacks(): Array<WarnDatapack> {
    return this.datapacks;
  }

  set warnDatapacks(datapack) {
    this.$emit("update:datapacks", datapack);
  }

  // 应用的数据包记录
  get appliedDatapackId() {
    return this.currentDashboard?.analysis.warn.id;
  }
  set appliedDatapackId(warnId: string) {
    if (this.currentDashboard) {
      this.setSavingAnalysis(true);
      this.currentDashboard.analysis.warn.id = warnId;
    }
  }

  /**
   * 操作部分
   */

  // 删除数据包
  removeDatapack(datapackIndex: number) {
    this.getDatapack(datapackIndex)
      .then((datapack: WarnDatapack) => {
        AxiosRequest.warnConfig
          .remove(datapack.id)
          .then(() => {
            UIUtil.showMessage("已删除预警", MessageType.success);
            this.doReload();
          })
          .catch(err => {
            console.error(err);
            UIUtil.showErrorMessage("删除预警失败 请稍后重试");
          });
      })
      .catch(() => {
        UIUtil.showErrorMessage("无法编辑预警配置");
      });
  }

  /**
   * 获取指定数据包
   */
  getDatapack(datapackIndex: number): Promise<WarnDatapack> {
    let datapack = this.warnDatapacks[datapackIndex];
    return datapack
      ? Promise.resolve(ObjectUtil.copy(datapack))
      : Promise.reject();
  }
}
</script>

<style lang="scss" scoped>
@import "../toolkit/select-view";
$mainMinHeight: 300px;

@include defaultSelectView($mainMinHeight);
</style>
