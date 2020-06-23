<template>
  <section class="select-view">
    <main>
      <!-- 添加按钮 -->
      <el-button class="row-button" size="medium" @click="doCreate">
        <i class="el-icon-plus"></i>
        <span>添加过滤器</span>
      </el-button>
      <!-- 分割线 -->
      <el-divider />

      <div class="main-content">
        <!-- 选择已有配置 -->
        <el-radio v-model="appliedDatapackId" :label="DEFAULT_VALUE" border>
          <div class="label-container">
            <div class="label-main">
              <div class="label-title">默认</div>
              <div v-if="dashboardWhereDesc !== ''" class="label-content">
                {{ dashboardWhereDesc }}
              </div>
            </div>
          </div>
        </el-radio>

        <el-radio
          v-for="(filterDatapack, datapackIndex) in filterDatapacks"
          :key="filterDatapack.id"
          v-model="appliedDatapackId"
          :label="filterDatapack.id"
          border
        >
          <div class="label-container">
            <div class="label-main">
              <div class="label-title">{{ filterDatapack.name }}</div>
              <div class="label-content">
                <span v-for="config in filterDatapack.config" :key="config.id">
                  <span
                    >{{
                      config.fieldData.alias
                        ? config.fieldData.alias
                        : config.fieldData.columnName
                    }}：{{ config.values }}</span
                  >
                </span>
              </div>
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
import { CommonStore, EditorStore } from "@/store/modules-model";
import ObjectUtil from "@/util/ObjectUtil";
import {
  FILTER_DEFAULT_VALUE,
  FilterDatapack
} from "glaway-bi-model/view/Filter";
import { AxiosRequest } from "@/api/AxiosRequest";
import UIUtil, { MessageType, ConfirmType } from "@/util/UIUtil";
import UUID from "@/util/UUID";

@Component
export default class SelectView extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  /**
   * Props
   */
  @Prop()
  datapacks!: Array<FilterDatapack>;

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
      filterId: this.appliedDatapackId
    };
  }

  // 关闭
  @Emit("close")
  close() {}

  // 默认值
  DEFAULT_VALUE = FILTER_DEFAULT_VALUE;

  appliedDatapackId = "";

  mounted() {
    this.appliedDatapackId = this.currentDashboard?.analysis.filter.id;
  }

  /**
   * 数据包
   */
  // 数据包
  get filterDatapacks(): Array<FilterDatapack> {
    return this.datapacks;
  }

  set filterDatapacks(datapack) {
    this.$emit("update:datapacks", datapack);
  }

  // 仪表盘 Where 描述
  get dashboardWhereDesc(): string {
    // 遍历 Where、遍历 WhereColumn，拼接描述
    const whereDesc = this.currentDashboard?.analysis.where
      .map(where => {
        const whereCols = where.w
          ?.map(whereColumn => whereColumn.value)
          .join(", ");
        return `${where.columnName}: ${whereCols}`;
      })
      .join("; ");

    return whereDesc;
  }

  /**
   * 操作部分
   */

  // 删除数据包
  removeDatapack(datapackIndex: number) {
    UIUtil.confirm(ConfirmType.warning, "确认删除?")
      .then(() => {
        return this.getDatapack(datapackIndex);
      })
      .then((datapack: FilterDatapack) => {
        AxiosRequest.filterConfig
          .remove(datapack.id)
          .then(() => {
            UIUtil.showMessage("已删除过滤器", MessageType.success);
            // 选中删除
            if (datapack.id === this.appliedDatapackId) {
              this.appliedDatapackId = this.DEFAULT_VALUE;
              const filterId = this.currentDashboard.analysis.filter.id;
              if (datapack.id === filterId) {
                this.doApply(false);
              }
            }
            this.doReload();
          })
          .catch(err => {
            console.error(err);
            UIUtil.showErrorMessage("删除过滤器失败 请稍后重试");
          });
      })
      .catch(() => {
        UIUtil.showErrorMessage("无法编辑过滤器配置");
      });
  }

  /**
   * 获取指定数据包
   */
  getDatapack(datapackIndex: number): Promise<FilterDatapack> {
    let datapack = this.filterDatapacks[datapackIndex];
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
