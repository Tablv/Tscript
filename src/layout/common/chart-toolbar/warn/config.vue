<template>
  <section class="config-view">
    <main>
      <el-form @submit.native.prevent label-position="right" label-width="80px">
        <el-form-item label="预警名称">
          <el-input v-model="currentWarnPack.name" />
        </el-form-item>
        <el-form-item label="预警颜色">
          <el-row>
            <el-col :span="12">
              <el-input v-model="currentWarnPack.warnColor" />
            </el-col>
            <el-col :span="8" :offset="1" class="color-picker-box">
              <el-color-picker v-model="currentWarnPack.warnColor" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="显示类型">
          <el-radio-group v-model="currentWarnPack.warnDisplayType">
            <el-radio-button
              v-for="mapping in warnDisplayTypeMapping"
              :key="mapping.value"
              :label="mapping.value"
              >{{ mapping.text }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </el-form>

      <el-divider />

      <!-- 各字段配置 -->
      <div
        class="config-inline"
        v-for="config in currentWarnPack.config"
        :key="config.id"
      >
        <el-row type="flex" justify="space-between" align="center">
          <el-radio
            v-model="currentWarnPack.appliedConfigId"
            :label="config.id"
          >
            <span>{{ columnNameFormatter(config.warnField.data) }}</span>
          </el-radio>

          <!-- 更多（配置条件） -->
          <el-popover
            v-show="currentWarnPack.appliedConfigId === config.id"
            placement="right"
            width="450"
            trigger="click"
          >
            <!-- 预警条件配置 -->
            <div
              v-for="(condition, conditionIndex) in config.conditions"
              :key="conditionIndex"
              class="condition-container config-inline"
            >
              <el-button
                size="mini"
                plain
                icon="el-icon-plus"
                @click="addWarnCondition"
              />

              <el-button
                :disabled="conditionIndex === 0"
                size="mini"
                type="danger"
                plain
                icon="el-icon-close"
                @click="removeWarnCondition(conditionIndex)"
              />

              <el-form @submit.native.prevent :inline="true">
                <el-form-item label="判断符号">
                  <el-select size="mini" v-model="condition.symbol">
                    <el-option
                      v-for="warnSymbolType in warnSymbolTypeMapping"
                      :key="warnSymbolType.value"
                      :label="warnSymbolType.value"
                      :title="warnSymbolType.text"
                      :value="warnSymbolType.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="预警数值">
                  <el-input-number
                    type="text"
                    size="mini"
                    :controls="false"
                    v-model="condition.value"
                  />
                </el-form-item>
              </el-form>
            </div>

            <el-button slot="reference" type="text" icon="el-icon-more" />
          </el-popover>
        </el-row>
      </div>
    </main>

    <footer>
      <el-button type="text" @click="goBack">取 消</el-button>
      <el-button type="primary" @click="doSave">保存并返回</el-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import Dashboard from "@/model/view/dashboard/Dashboard";
import { CommonStore, EditorStore } from "@/store/modules-model";

import {
  WarnDisplayTypeMapping,
  WarnSymbolTypeMapping
} from "@/enums/WarnType";
import ObjectUtil from "@/util/ObjectUtil";
import FieldDTO from "@/model/params/FieldDTO";
import { WarnDatapack, WarnConfig, WarnBuilder } from "@/model/view/Warn";
import UIUtil, { MessageType } from "@/util/UIUtil";

@Component
export default class ConfigView extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @Prop()
  datapack!: WarnDatapack | null;

  @Emit("save")
  doSave() {}

  @Emit("back")
  goBack() {}

  @Emit("set-loading")
  setLoading(isLoading: boolean) {
    return isLoading;
  }

  // 全部度量
  get allMeasures(): Array<FieldDTO> {
    return this.currentDashboard?.analysis.measures || [];
  }

  // 当前应用的配置
  getAppliedConfig(): WarnConfig | null {
    return (
      this.currentWarnPack?.config.filter(
        config => config.id === this.currentWarnPack?.appliedConfigId
      )[0] || null
    );
  }

  // 预警信息显示类型
  warnDisplayTypeMapping = WarnDisplayTypeMapping;

  // 预警判断条件
  warnSymbolTypeMapping = WarnSymbolTypeMapping;

  /**
   * 数据包
   */
  get currentWarnPack(): WarnDatapack | null {
    return this.datapack;
  }
  set currentWarnPack(datapack) {
    this.$emit("update:datapack", datapack);
  }

  /**
   * 操作部分
   */

  // 字段(列名) 格式化
  columnNameFormatter(measure: FieldDTO): string {
    let suffix = measure.alias ? ` - ${measure.alias}` : "";
    return `${measure.columnName}${suffix}`;
  }

  /**
   * 添加一条预警条件
   */
  addWarnCondition(): void {
    if (this.getAppliedConfig()?.conditions.length === 2) {
      UIUtil.showMessage("最多添加两个预警条件", MessageType.warning);
      return;
    }

    this.getAppliedConfig()?.conditions.push(WarnBuilder.buildWarnCondition());
  }

  /**
   * 删除预警条件
   */
  removeWarnCondition(conditionIndex: number): void {
    this.getAppliedConfig()?.conditions.splice(conditionIndex, 1);
  }
}
</script>

<style lang="scss" scoped>
$mainMinWidth: 360px;
$mainMinHeight: 320px;

/**
 * 配置预警条件
 */
.condition-container {
  padding: 10px;
}

/**
 * 配置行内样式
 */
.config-inline {
  height: 28px;
  display: flex;
  align-items: center;

  .el-form--inline {
    display: flex;
    align-items: center;

    .el-form-item {
      margin-bottom: 0;

      &:first-of-type {
        margin-left: 12px;
      }

      ::v-deep {
        .el-form-item__label {
          padding-right: 0;
        }
      }
    }
  }

  .el-row {
    width: 100%;
  }

  .el-button {
    padding: 7px 10px;
  }

  .el-select {
    margin-left: 10px;
    width: 80px;
  }

  .el-input,
  .el-input-number {
    margin-left: 10px;
    width: 100px;
  }

  .el-radio {
    display: flex;
    align-items: center;
  }
}

/**
 * 配置界面
 */
.config-view {
  @include select(none);

  main {
    min-width: $mainMinWidth;
    min-height: $mainMinHeight;

    .color-picker-box {
      height: 32px;
    }
  }

  footer {
    text-align: right;
    padding-top: 10px;

    .el-button--text {
      padding: 9px 6px;
    }
  }
}
</style>
