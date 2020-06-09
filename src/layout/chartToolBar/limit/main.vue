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
      <limit-select-view
        v-if="isSelectMode"
        :datapacks="limitDatapacks"
        @create="doCreate"
        @edit="doEdit"
        @apply="doApply"
        @reload="loadAllDatapack"
        @close="close"
      />

      <limit-config-view
        v-if="isConfigMode"
        :datapack.sync="currentSortPack"
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

import LimitSelectView from "./select.vue";
import LimitConfigView from "./config.vue";

import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { generalDataTemplate } from "glaway-bi-component/src/config/DefaultTemplate";
import { SortType } from "glaway-bi-model/enums/SortType";
import ObjectUtil from "@/util/ObjectUtil";
import TableInfoVO from "glaway-bi-model/results/TableInfoVO";
import {
  LIMIT_DEFAULT_VALUE,
  LimitDatapack,
  LimitConfig,
  ResultOrder,
  LimitBuilder
} from "glaway-bi-model/view/Limit";
import { OrderType } from "glaway-bi-model/enums/OrderType";
import { AxiosRequest } from "@/api/AxiosRequest";
import DashboardUtil from "@/util/DashboardUtil";
import UIUtil, { MessageType } from "@/util/UIUtil";
import UUID from "@/util/UUID";
import OrderDTO from "glaway-bi-model/params/OrderDTO";
import AnalysisData from "glaway-bi-model/view/dashboard/AnalysisData";
import LimitDTO from "glaway-bi-model/params/LimitDTO";

@Component({
  components: {
    DialogButton,

    LimitSelectView,
    LimitConfigView
  }
})
export default class SortIndexView extends Vue {
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
    return this.isSelectMode ? "300px" : "600px";
  }

  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  // 正在保存分析数据
  @CommonStore.Mutation("setSavingAnalysis")
  setSavingAnalysis!: Function;

  // 字段数据
  @EditorStore.Getter("allColumns")
  allColumns!: Array<TableInfoVO>;

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
  emptySortOption() {
    this.currentSortPack = null;
  }

  /**
   * 排名数据包
   */
  // 当前图表的排名数据包
  limitDatapacks: Array<LimitDatapack> = [];

  // 应用的数据包记录
  get appliedDatapackId() {
    return this.currentDashboard?.analysis.limit.id;
  }
  set appliedDatapackId(id: string) {
    if (this.currentDashboard) {
      this.setSavingAnalysis(true);
      this.currentDashboard.analysis.limit.id = id;
    }
  }

  // 新增数据包
  currentSortPack: LimitDatapack | null = null;

  /**
   * 返回到选择页
   */
  goBack() {
    // 返回
    this.setSelectMode();

    // 清空选项
    this.emptySortOption();
  }

  /**
   * 创建排名数据包
   */
  doCreate() {
    this.initDatapack();

    // 切换到配置页面
    this.setConfigMode();
  }

  /**
   * 编辑排名数据包
   */
  doEdit(datapackIndex: number) {
    this.getDatapack(datapackIndex)
      .then((datapack: LimitDatapack) => {
        this.currentSortPack = datapack;

        // 切换到配置页面
        this.setConfigMode();
      })
      .catch(() => {
        UIUtil.showErrorMessage("无法编辑排名配置");
      });
  }

  /**
   * 加载当前仪表盘的所有数据包
   */
  loadAllDatapack(): void {
    let dashboardId = this.currentDashboard.id;

    AxiosRequest.limitConfig
      .find(dashboardId)
      .then((datapacks: Array<LimitDatapack>) => {
        this.limitDatapacks = datapacks;
      })
      .catch(err => {
        UIUtil.showErrorMessage("加载排名配置失败");
        console.error(err);
      });
  }

  /**
   * 获取指定排名数据包
   */
  getDatapack(datapackIndex: number): Promise<LimitDatapack> {
    let datapack = this.limitDatapacks[datapackIndex];
    return datapack
      ? Promise.resolve(ObjectUtil.copy(datapack))
      : Promise.reject();
  }

  /**
   * 初始化排名数据包
   */
  initDatapack() {
    const dimensions = this.currentDashboard.analysis.dimensions,
      measures = this.currentDashboard.analysis.measures,
      allFields = dimensions.concat(measures);

    this.currentSortPack = LimitBuilder.buildSortPack(
      this.currentDashboard.id,
      this.limitDatapacks.length,
      allFields,
      ""
    );
  }

  /**
   * 应用
   */
  doApply() {
    const datapackId = this.currentDashboard?.analysis.limit.id;

    this.getAppliedConfig(datapackId)
      .then(config => {
        debugger;
        // 赋值给分析对象
        this.currentDashboard.analysis.limit = config;
        // 关闭对话框
        this.close();
      })
      .catch(errorMessage => {
        UIUtil.showMessage(errorMessage, MessageType.warning);
      });
  }

  /**
   * 生成分析对象的配置
   */
  getAppliedConfig(datapackId: string): Promise<AnalysisData["limit"]> {
    if (!datapackId) return Promise.reject("应用排名配置出错");

    // 应用默认，置为默认排名数据
    if (datapackId === LIMIT_DEFAULT_VALUE) {
      return Promise.resolve(
        ObjectUtil.copy(generalDataTemplate.analysis.limit)
      );
    }

    // 获取表字段信息
    const datapack = this.limitDatapacks.filter(
      (datapack: LimitDatapack) => datapack.id === datapackId
    )[0];

    if (!datapack) {
      return Promise.reject("请选择排名配置");
    }
    // 赋值计算结果
    const resultOrderDTO = LimitBuilder.buildLimitByResult(
      datapack.config.order,
      datapack.config.limit
    ) as LimitDTO;
    // 返回的配置
    let retConfig = {
      id: datapackId,
      data: [resultOrderDTO]
    };

    return Promise.resolve(retConfig);
  }

  doSave() {
    if (this.currentSortPack) {
      const order = this.currentSortPack.config.order;
      this.currentSortPack.config.order = this.currentSortPack.config.orderData.filter(
        item => item.fieldData.id === order.fieldData.id
      )[0];
      AxiosRequest.limitConfig
        .save(this.currentSortPack)
        .then(() => {
          // 刷新
          this.loadAllDatapack();

          // 返回
          this.goBack();
        })
        .catch(err => {
          console.error(err);
          UIUtil.showErrorMessage("保存排名配置出错 请稍后重试");
        });
    } else {
      this.goBack();
    }
  }
}
</script>

<style lang="scss" scoped>
$mainMinHeight: 320px;

.dialog-main-box {
  min-height: $mainMinHeight;
  overflow-x: hidden;
}
</style>
