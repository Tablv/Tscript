<template>
  <dialog-button
    :title="title"
    :icon-class="iconClass"
    :visible.sync="dialogVisible"
    :enable-footer="false"
    :width="dialogWidth"
    @open="open"
    @closed="close"
  >
    <template #dialog-content v-loading="isLoading" class="dialog-main-box">
      <warn-select-view
        v-if="isSelectMode"
        :datapacks="warnDatapacks"
        @create="doCreate"
        @edit="doEdit"
        @apply="doApply"
        @reload="loadAllDatapack"
        @close="close"
      />

      <warn-config-view
        v-if="isConfigMode"
        :datapack.sync="currentWarnPack"
        @set-loading="setLoading"
        @save="doSave"
        @back="goBack"
      />
    </template>
  </dialog-button>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";

import DialogButton from "../toolkit/DialogButton.vue";

import WarnSelectView from "./select.vue";
import WarnConfigView from "./config.vue";

import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { generalDataTemplate } from "glaway-bi-component/src/config/DefaultTemplate";
import {
  WarnDisplayType,
  WarnSymbolType
} from "glaway-bi-model/enums/WarnType";
import ObjectUtil from "@/util/ObjectUtil";
import {
  WARN_DEFAULT_VALUE,
  WarnDatapack,
  WarnConfig,
  WarnBuilder
} from "glaway-bi-model/view/Warn";
import { AxiosRequest } from "@/api/AxiosRequest";
import DashboardUtil from "@/util/DashboardUtil";
import UIUtil, { MessageType } from "@/util/UIUtil";
import UUID from "@/util/UUID";
import AnalysisData from "glaway-bi-model/view/dashboard/AnalysisData";

@Component({
  components: {
    DialogButton,

    WarnSelectView,
    WarnConfigView
  }
})
export default class WarnIndexView extends Vue {
  @Model("visible")
  visible!: boolean;

  @Prop()
  title!: string;

  @Prop()
  iconClass!: string;

  get dialogVisible() {
    return this.visible;
  }

  set dialogVisible(val: boolean) {
    this.$emit("visible", val);
  }

  get dialogWidth() {
    // selectMode: 300px,
    // configMode: 400px
    return this.isSelectMode ? "300px" : "400px";
  }

  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  // 正在加载数据标志位
  isLoading = false;

  open() {
    this.loadAllDatapack();
  }

  @Emit("close")
  close() {
    if (this.isConfigMode) {
      this.goBack();
    }
  }

  /**
   * 操作部分
   */
  partNum = 0;

  get isSelectMode() {
    return this.partNum === 0;
  }
  setSelectMode() {
    this.partNum = 0;
  }

  get isConfigMode() {
    return this.partNum === 1;
  }
  setConfigMode() {
    this.partNum = 1;
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  /**
   * 清空选项
   */
  emptyWarnOption() {
    this.currentWarnPack = null;
  }

  /**
   * 预警数据包
   */
  // 当前图表的预警数据包
  warnDatapacks: Array<WarnDatapack> = [];

  // 新增数据包
  currentWarnPack: WarnDatapack | null = null;

  /**
   * 返回到选择页
   */
  goBack() {
    // 返回
    this.setSelectMode();

    // 清空选项
    this.emptyWarnOption();
  }

  /**
   * 创建预警数据包
   */
  doCreate() {
    this.initDatapack();

    // 切换到配置页面
    this.setConfigMode();
  }

  /**
   * 编辑预警数据包
   */
  doEdit(datapackIndex: number) {
    const datapack = this.getDatapack(datapackIndex);
    if (datapack) {
      this.currentWarnPack = datapack;
      this.setConfigMode();
    } else {
      UIUtil.showErrorMessage("无法编辑预警配置");
    }
  }

  /**
   * 加载当前仪表盘的所有数据包
   */
  loadAllDatapack(): void {
    let dashboardId = this.currentDashboard.id;

    AxiosRequest.warnConfig
      .find(dashboardId)
      .then((datapacks: Array<WarnDatapack>) => {
        this.warnDatapacks = datapacks;
      })
      .catch(err => {
        UIUtil.showErrorMessage("加载预警配置失败");
        console.error(err);
      });
  }

  /**
   * 获取指定预警数据包
   */
  getDatapack(datapackIndex: number): WarnDatapack | null {
    let datapack = this.warnDatapacks[datapackIndex];
    return datapack ? ObjectUtil.copy(datapack) : null;
  }

  /**
   * 初始化预警数据包
   */
  initDatapack() {
    this.currentWarnPack = WarnBuilder.buildWarnPack(
      this.currentDashboard.id,
      this.warnDatapacks.length,
      this.currentDashboard.analysis.measures
    );
  }

  /**
   * 应用
   */
  doApply(warner: { warnId: string; closeFlag: boolean }) {
    // const datapackId = this.currentDashboard?.analysis.warn.id;

    const { warnId, closeFlag } = warner;
    this.getAppliedConfig(warnId)
      .then(config => {
        // 赋值给分析对象
        this.currentDashboard.analysis.warn.id = warnId;
        this.currentDashboard.analysis.warn = config;
        // 关闭对话框
        if (closeFlag) {
          this.close();
        }
      })
      .catch(errorMessage => {
        UIUtil.showMessage(errorMessage, MessageType.warning);
      });
  }

  /**
   * 生成分析对象的配置
   */
  getAppliedConfig(datapackId: string): Promise<AnalysisData["warn"]> {
    if (!datapackId) return Promise.reject("应用预警配置出错");

    // 应用无，删除预警数据
    if (datapackId === WARN_DEFAULT_VALUE) {
      return Promise.resolve(
        ObjectUtil.copy(generalDataTemplate.analysis.warn)
      );
    }

    // 获取表字段信息
    const datapack = this.warnDatapacks.filter(
      (datapack: WarnDatapack) => datapack.id === datapackId
    )[0];
    const appliedConfig = datapack.config.warnConfigList.filter(
      config => config.id === datapack.config.appliedConfigId
    )[0];

    // 数据包不存在
    if (!datapack) {
      return Promise.reject("请选择预警配置");
    }

    // 应用的配置不存在
    if (!appliedConfig) {
      return Promise.reject("预警配置有误 请检查配置");
    }

    return Promise.resolve({
      id: datapack.id,
      color: datapack.config.warnColor,
      displayType: datapack.config.warnDisplayType,
      value: appliedConfig.conditions.map(condition => {
        return {
          seriesName: appliedConfig.warnField.data.alias,
          symbol: condition.symbol,
          value: condition.value
        };
      })
    });
  }

  /**
   * 检查过滤配置
   */
  checkSaveConfig(currentWarnPack: WarnDatapack): boolean {
    if (!currentWarnPack.name) {
      UIUtil.showMessage("请输入预警名称", MessageType.warning);
      return false;
    }
    if (!currentWarnPack.config.warnColor) {
      UIUtil.showMessage("请选择或输入预警颜色", MessageType.warning);
      return false;
    }
    if (!currentWarnPack.config.appliedConfigId) {
      UIUtil.showMessage("请选择预警字段", MessageType.warning);
      return false;
    }
    return true;
  }

  doSave() {
    if (this.currentWarnPack && this.checkSaveConfig(this.currentWarnPack)) {
      AxiosRequest.warnConfig
        .save(this.currentWarnPack)
        .then(() => {
          // 刷新
          this.loadAllDatapack();
          // 返回
          this.goBack();
        })
        .catch(err => {
          console.error(err);
          UIUtil.showErrorMessage("保存预警配置出错 请稍后重试");
        });
    }
  }
}
</script>

<style lang="scss" scoped>
$mainMinHeight: 320px;

.dialog-header-box {
  .fa {
    margin-right: 10px;
  }
}

.dialog-main-box {
  min-height: $mainMinHeight;
  overflow-x: hidden;
}
</style>
