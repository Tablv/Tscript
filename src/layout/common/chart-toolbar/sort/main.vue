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
      <sort-select-view
        v-if="isSelectMode"
        :datapacks="sortDatapacks"
        @create="doCreate"
        @edit="doEdit"
        @apply="doApply"
        @reload="loadAllDatapack"
        @close="close"
      />

      <sort-config-view
        v-if="isConfigMode"
        :tab-name.sync="currentTabName"
        :datapack.sync="currentSortPack"
        :field-values.sync="customValueMap"
        :load-value="loadValue"
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

import SortSelectView from "./select.vue";
import SortConfigView from "./config.vue";

import Dashboard from "@/model/view/dashboard/Dashboard";
import { generalDataTemplate } from "@/config/DefaultTemplate";
import { SortType } from "@/enums/SortType";
import ObjectUtil from "@/util/ObjectUtil";
import TableInfoVO from "@/model/results/TableInfoVO";
import {
  SORT_DEFAULT_VALUE,
  SortDatapack,
  SortConfig,
  ResultOrder,
  CustomOrder,
  SortBuilder,
  CustomField
} from "@/model/view/Sort";
import { OrderType } from "@/enums/OrderType";
import { AxiosRequest } from "@/config/AxiosRequest";
import DashboardUtil from "@/util/DashboardUtil";
import UIUtil, { MessageType } from "@/util/UIUtil";
import UUID from "@/util/UUID";
import OrderDTO from "@/model/params/OrderDTO";
import AnalysisData from "@/model/view/dashboard/AnalysisData";

/**
 * 排序 标签页
 */
export enum SortTab {
  /**
   * 计算结果
   */
  result = "resultOrder",

  /**
   * 自定义字段
   */
  customField = "customField",

  /**
   * 自定义顺序
   */
  customOrder = "customOrder"
}

/**
 * 定义 排序 自定义值的 Map
 */
type CustomValueMap = { [key: string]: Array<string> };

@Component({
  components: {
    DialogButton,

    SortSelectView,
    SortConfigView
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
    // selectMode: 300px,
    // configMode: 600px
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

  // 当前标签页
  currentTabName = SortTab.result;

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
    this.customValueMap = {};
  }

  /**
   * 排序数据包
   */
  // 当前图表的排序数据包
  sortDatapacks: Array<SortDatapack> = [];

  // 应用的数据包记录
  get appliedDatapackId() {
    return this.currentDashboard?.analysis.sort.id;
  }
  set appliedDatapackId(id: string) {
    if (this.currentDashboard) {
      this.setSavingAnalysis(true);
      this.currentDashboard.analysis.sort.id = id;
    }
  }

  // 新增数据包
  currentSortPack: SortDatapack | null = null;

  /**
   * 自定义字段排序部分
   *
   *
   * 字段可排序数值
   *
   *  结构:
   *  {
   *    UUID: [ 'option1', 'option2' ]
   *  }
   *
   */
  customValueMap: CustomValueMap = {};

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
   * 创建排序数据包
   */
  doCreate() {
    this.initDatapack();

    // 设置标签页
    this.syncTabName();

    // 切换到配置页面
    this.setConfigMode();
  }

  /**
   * 编辑排序数据包
   */
  doEdit(datapackIndex: number) {
    this.getDatapack(datapackIndex)
      .then((datapack: SortDatapack) => {
        this.currentSortPack = datapack;

        // 设置标签页
        this.syncTabName();

        // 切换到配置页面
        this.setConfigMode();
      })
      .catch(() => {
        UIUtil.showErrorMessage("无法编辑排序配置");
      });
  }

  /**
   * 根据当前数据包，同步显示对应标签页
   */
  syncTabName(): void {
    switch (this.currentSortPack?.config.type) {
      case SortType.result:
        this.currentTabName = SortTab.result;
        break;
      case SortType.customField:
        this.currentTabName = SortTab.customField;
        break;
      case SortType.customOrder:
        this.currentTabName = SortTab.customOrder;
        break;
    }
  }

  /**
   * 加载当前仪表盘的所有数据包
   */
  loadAllDatapack(): void {
    let dashboardId = this.currentDashboard.id;

    AxiosRequest.sortConfig
      .find(dashboardId)
      .then((datapacks: Array<SortDatapack>) => {
        this.sortDatapacks = datapacks;
      })
      .catch(err => {
        UIUtil.showErrorMessage("加载排序配置失败");
        console.error(err);
      });
  }

  /**
   * 获取指定排序数据包
   */
  getDatapack(datapackIndex: number): Promise<SortDatapack> {
    let datapack = this.sortDatapacks[datapackIndex];
    return datapack
      ? Promise.resolve(ObjectUtil.copy(datapack))
      : Promise.reject();
  }

  /**
   * 初始化排序数据包
   */
  initDatapack() {
    const dimensions = this.currentDashboard.analysis.dimensions,
      measures = this.currentDashboard.analysis.measures,
      allFields = dimensions.concat(measures);

    this.currentSortPack = SortBuilder.buildSortPack(
      this.currentDashboard.id,
      this.sortDatapacks.length,
      allFields
    );
  }

  async loadValue(config: SortConfig): Promise<void> {
    let fieldData: TableInfoVO | null =
      config.type === SortType.customOrder
        ? (config.custom as CustomOrder).fieldData
        : null;

    if (!fieldData) return Promise.reject("字段数据为空");

    return await DashboardUtil.fetchFieldValues(
      this.currentDashboard,
      fieldData
    )
      .then(customValues => {
        const customOrder = this.currentSortPack?.config.custom;

        if (customOrder) {
          customOrder.refData = customValues;
        }
        return Promise.resolve();
      })
      .catch(err => {
        UIUtil.showErrorMessage("字段值加载失败");
        console.error(err);
        return Promise.reject(err);
      });
  }

  /**
   * 应用
   */
  doApply() {
    const datapackId = this.currentDashboard?.analysis.sort.id;

    this.getAppliedConfig(datapackId)
      .then(config => {
        // 赋值给分析对象
        this.currentDashboard.analysis.sort = config;
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
  getAppliedConfig(datapackId: string): Promise<AnalysisData["sort"]> {
    if (!datapackId) return Promise.reject("应用排序配置出错");

    // 应用默认，置为默认排序数据
    if (datapackId === SORT_DEFAULT_VALUE) {
      return Promise.resolve(
        ObjectUtil.copy(generalDataTemplate.analysis.sort)
      );
    }

    // 获取表字段信息
    const datapack = this.sortDatapacks.filter(
      (datapack: SortDatapack) => datapack.id === datapackId
    )[0];

    if (!datapack) {
      return Promise.reject("请选择排序配置");
    }

    // 返回的配置
    let retConfig;
    switch (datapack.config.type) {
      case SortType.result: {
        // 赋值计算结果
        const resultOrderDTO = (datapack.config.data as Array<ResultOrder>)
          .map((order: ResultOrder) => SortBuilder.buildOrderByResult(order))
          .filter(order => order !== null) as Array<OrderDTO>;

        retConfig = {
          id: datapackId,
          type: SortType.result,
          data: resultOrderDTO,
          custom: []
        };
        break;
      }
      case SortType.customField: {
        // 赋值计算结果
        let resultOrderDTO = (datapack.config.data as Array<CustomField>)
          .map((order: CustomField) =>
            SortBuilder.buildOrderByCustomField(order)
          )
          .filter(order => order !== null) as Array<OrderDTO>;

        retConfig = {
          id: datapackId,
          type: SortType.result,
          data: resultOrderDTO,
          custom: []
        };
        break;
      }
      case SortType.customOrder: {
        // 赋值自定义顺序
        let custom = datapack.config.custom as CustomOrder,
          customOrders = ObjectUtil.copy(custom.refData);

        retConfig = {
          id: datapackId,
          type: SortType.customOrder,
          data: [],
          custom: customOrders
        };
        break;
      }
    }

    return Promise.resolve(retConfig);
  }

  doSave() {
    if (this.currentSortPack) {
      AxiosRequest.sortConfig
        .save(this.currentSortPack)
        .then(() => {
          // 刷新
          this.loadAllDatapack();

          // 返回
          this.goBack();
        })
        .catch(err => {
          console.error(err);
          UIUtil.showErrorMessage("保存排序配置出错 请稍后重试");
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
