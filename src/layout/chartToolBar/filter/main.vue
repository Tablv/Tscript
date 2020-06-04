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
      <filter-select-view
        v-if="isSelectMode"
        :datapacks="filterDatapacks"
        @create="doCreate"
        @edit="doEdit"
        @apply="doApply"
        @reload="loadAllDatapack"
        @close="close"
      />

      <filter-config-view
        v-if="isConfigMode"
        :datapack.sync="currentFilterPack"
        :field-values.sync="standards"
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
import { EditorStore, CommonStore } from "@/store/modules-model";

import DialogButton from "../toolkit/DialogButton.vue";

import FilterSelectView from "./select.vue";
import FilterConfigView from "./config.vue";

import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { generalDataTemplate } from "glaway-bi-component/src/config/DefaultTemplate";
import {
  FILTER_DEFAULT_VALUE,
  FilterDatapack,
  FilterConfig,
  FilterBuilder
} from "glaway-bi-model/view/Filter";
import { FilterType } from "glaway-bi-model/enums/FilterType";
import ObjectUtil from "@/util/ObjectUtil";
import TableVO from "glaway-bi-model/results/TableVO";
import TableInfoVO from "glaway-bi-model/results/TableInfoVO";
import { AxiosRequest } from "@/api/AxiosRequest";
import DashboardUtil from "@/util/DashboardUtil";
import UIUtil, { MessageType } from "@/util/UIUtil";
import WhereDTO from "glaway-bi-model/params/WhereDTO";
import UUID from "@/util/UUID";
import { WhereType } from "glaway-bi-model/enums/WhereType";
import AnalysisData from "glaway-bi-model/view/dashboard/AnalysisData";

/**
 * 定义 过滤器 标准类型的 Map
 */
export type StandardsMap = { [key: string]: Array<string> };

@Component({
  components: {
    DialogButton,

    FilterSelectView,
    FilterConfigView
  }
})
export default class FilterViewIndex extends Vue {
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
    // configMode: 660px
    return this.isSelectMode ? "300px" : "700px";
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
  emptyFilterOption() {
    this.currentFilterPack = null;
    this.standards = {};
  }

  /**
   * Getter
   */
  getCurrentFilterConfig(configId: string): FilterConfig {
    return this.currentFilterPack?.config.filter(
      config => config.id === configId
    )[0] as FilterConfig;
  }

  /**
   * 过滤器数据包
   */
  // 当前图表的过滤器数据包
  filterDatapacks: Array<FilterDatapack> = [];

  // 应用的数据包记录
  get appliedDatapackId() {
    return this.currentDashboard?.analysis.filter.id;
  }
  set appliedDatapackId(filterId: string) {
    if (this.currentDashboard) {
      this.setSavingAnalysis(true);
      this.currentDashboard.analysis.filter.id = filterId;
    }
  }

  // 新增数据包
  currentFilterPack: FilterDatapack | null = null;

  /**
   * 过滤标准部分
   *
   *
   * 可选标准
   *
   *  结构:
   *  {
   *    UUID: [ 'option1', 'option2' ]
   *  }
   *
   */
  standards: StandardsMap = {};

  /**
   * 返回到选择页
   */
  goBack() {
    // 返回
    this.setSelectMode();

    // 清空选项
    this.emptyFilterOption();
  }

  /**
   * 创建过滤器数据包
   */
  doCreate() {
    this.initDatapack();
    this.setConfigMode();
  }

  /**
   * 编辑过滤器数据包
   */
  doEdit(datapackIndex: number) {
    this.getDatapack(datapackIndex)
      .then(async (datapack: FilterDatapack) => {
        this.currentFilterPack = datapack;

        let allLoadPromise = new Array();

        // 过滤出需要加载字段的过滤器配置
        let allStandardConfig = this.currentFilterPack.config.filter(
          (filterConfig: FilterConfig) =>
            filterConfig.type === FilterType.standard
        );

        this.isLoading = true;

        for (let i = 0; i < allStandardConfig.length; i++) {
          const configId = allStandardConfig[i].id;
          let loadPromise = await this.loadValue(configId);
          allLoadPromise.push(loadPromise);
        }

        Promise.all(allLoadPromise)
          .then(() => {
            // 完成时，切换到配置页面
            this.setConfigMode();
          })
          .catch(err => console.error(err))
          .finally(() => (this.isLoading = false));
      })
      .catch(() => {
        UIUtil.showErrorMessage("无法编辑过滤器配置");
      });
  }

  /**
   * 加载当前仪表盘的所有数据包
   */
  loadAllDatapack(): void {
    let dashboardId = this.currentDashboard.id;
    AxiosRequest.filterConfig
      .find(dashboardId)
      .then((datapacks: Array<FilterDatapack>) => {
        this.filterDatapacks = datapacks;
      })
      .catch(err => {
        UIUtil.showErrorMessage("加载过滤器配置失败");
        console.error(err);
      });
  }

  /**
   * 获取指定过滤器数据包
   */
  getDatapack(datapackIndex: number): Promise<FilterDatapack> {
    let datapack = this.filterDatapacks[datapackIndex];
    return datapack
      ? Promise.resolve(ObjectUtil.copy(datapack))
      : Promise.reject();
  }

  /**
   * 初始化过滤器数据包
   */
  initDatapack() {
    this.currentFilterPack = FilterBuilder.buildFilterPack(
      this.currentDashboard.id,
      this.filterDatapacks.length
    );
  }

  /**
   * 加载字段所有的值
   */
  async loadValue(configId: string): Promise<void> {
    let currentFilter = this.getCurrentFilterConfig(configId),
      fieldData: TableInfoVO | null = currentFilter?.fieldData;
    if (!fieldData) return Promise.reject("字段数据为空");

    return await DashboardUtil.fetchFieldValues(
      this.currentDashboard,
      fieldData
    )
      .then(standardValues => {
        this.$set(this.standards, currentFilter.id, standardValues);
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
    const datapackId = this.currentDashboard?.analysis.filter.id;

    this.getAppliedConfig(datapackId)
      .then(config => {
        // 赋值给分析对象
        this.currentDashboard.analysis.filter = config;
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
  getAppliedConfig(datapackId: string): Promise<AnalysisData["filter"]> {
    if (!datapackId) return Promise.reject("应用过滤配置出错");

    // 应用默认，置为默认过滤数据
    if (datapackId === FILTER_DEFAULT_VALUE) {
      return Promise.resolve(
        ObjectUtil.copy(generalDataTemplate.analysis.filter)
      );
    }

    // 获取表字段信息
    const datapack = this.filterDatapacks.filter(
      (datapack: FilterDatapack) => datapack.id === datapackId
    )[0];
    const config = datapack?.config;

    // 数据包不存在
    if (!datapack) {
      return Promise.reject("请选择过滤配置");
    }

    // 应用的配置不存在
    if (!config) {
      return Promise.reject("过滤配置有误 请检查配置");
    }

    const whereArray = datapack.config
      .map((config: FilterConfig) => FilterBuilder.buildWhere(config))
      .filter(where => where !== null) as Array<WhereDTO>;

    return Promise.resolve({
      id: datapackId,
      data: ObjectUtil.copy(whereArray)
    });
  }

  doSave() {
    if (this.currentFilterPack) {
      AxiosRequest.filterConfig
        .save(this.currentFilterPack)
        .then(() => {
          // 刷新
          this.loadAllDatapack();

          // 返回
          this.goBack();
        })
        .catch(err => {
          console.error(err);
          UIUtil.showErrorMessage("保存过滤器配置出错 请稍后重试");
        });
    } else {
      this.goBack();
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
