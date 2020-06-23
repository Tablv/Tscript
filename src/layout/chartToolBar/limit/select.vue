<template>
  <section class="select-view">
    <main>
      <!-- 添加按钮 -->
      <el-button class="row-button" size="medium" @click="doCreate">
        <i class="el-icon-plus"></i>
        <span>添加排名</span>
      </el-button>

      <!-- 分割线 -->
      <el-divider />

      <div class="main-content">
        <!-- 选择已有配置 -->
        <el-radio v-model="appliedDatapackId" :label="DEFAULT_VALUE" border>
          <div class="label-container">
            <div class="label-main">
              <div class="label-title">默认</div>
            </div>
          </div>
        </el-radio>

        <el-radio
          v-for="(limitDatapack, datapackIndex) in limitDatapacks"
          :key="limitDatapack.id"
          v-model="appliedDatapackId"
          :label="limitDatapack.id"
          border
        >
          <div class="label-container">
            <div class="label-main">
              <div class="label-title">{{ limitDatapack.name }}</div>
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
      </div>
    </main>

    <footer>
      <el-button type="text" @click="close">关 闭</el-button>
      <el-button type="primary" @click="doApply">应 用</el-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { CommonStore } from "@/store/modules-model";

import ObjectUtil from "@/util/ObjectUtil";
import { LIMIT_DEFAULT_VALUE, LimitDatapack } from "glaway-bi-model/view/Limit";
import { AxiosRequest } from "@/api/AxiosRequest";
import UIUtil, { MessageType, ConfirmType } from "@/util/UIUtil";

@Component
export default class SelectView extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  /**
   * Props
   */
  @Prop()
  datapacks!: Array<LimitDatapack>;

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
  doApply(closeFlag: boolean = true) {
    return {
      closeFlag,
      limitId: this.appliedDatapackId
    };
  }

  // 关闭
  @Emit("close")
  close() {}

  // 默认值
  DEFAULT_VALUE = LIMIT_DEFAULT_VALUE;

  appliedDatapackId = "";

  mounted() {
    this.appliedDatapackId = this.currentDashboard?.analysis.limit.id;
  }

  /**
   * 数据包
   */
  // 数据包
  get limitDatapacks(): Array<LimitDatapack> {
    return this.datapacks;
  }

  set limitDatapacks(datapack) {
    this.$emit("update:datapacks", datapack);
  }

  /**
   * 操作部分
   */

  // 删除数据包
  removeDatapack(datapackIndex: number) {
    UIUtil.confirm(ConfirmType.warning, "确认删除?")
      .then(() => {
        this.getDatapack(datapackIndex)
          .then((datapack: LimitDatapack) => {
            AxiosRequest.limitConfig
              .remove(datapack.id)
              .then(() => {
                UIUtil.showMessage("已删除排序", MessageType.success);
                if (datapack.id === this.appliedDatapackId) {
                  this.appliedDatapackId = this.DEFAULT_VALUE;
                  const limitId = this.currentDashboard.analysis.limit.id;
                  if (datapack.id === limitId) {
                    this.doApply(false);
                  }
                }
                this.doReload();
              })
              .catch(err => {
                console.error(err);
                UIUtil.showErrorMessage("删除排序失败 请稍后重试");
              });
          })
          .catch(() => {
            UIUtil.showErrorMessage("无法编辑排序配置");
          });
      })
      .catch(error => {});
  }

  /**
   * 获取指定数据包
   */
  getDatapack(datapackIndex: number): Promise<LimitDatapack> {
    let datapack = this.limitDatapacks[datapackIndex];
    return datapack
      ? Promise.resolve(ObjectUtil.copy(datapack))
      : Promise.reject();
  }
}
</script>

<style lang="scss" scoped>
@import "../toolkit/select-view";
$mainMinHeight: 220px;
$mainMaxHeight: 250px;

@include defaultSelectView($mainMinHeight, $mainMaxHeight);
</style>
