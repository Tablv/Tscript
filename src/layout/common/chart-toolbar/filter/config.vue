<template>
  <section class="config-view">
    <main>
      <el-form
        @submit.native.prevent
        label-position="right"
        label-width="100px"
      >
        <el-form-item class="filter-name" label="过滤器名称">
          <el-input v-model="currentFilterPack.name" />
        </el-form-item>
      </el-form>

      <div
        class="config-inline"
        v-for="(filterConfig, configIndex) in currentFilterPack.config"
        :key="filterConfig.id"
      >
        <el-button size="mini" plain icon="el-icon-plus" @click="addFilter" />

        <el-button
          :disabled="configIndex === 0"
          size="mini"
          type="danger"
          plain
          icon="el-icon-close"
          @click="removeFilter(configIndex)"
        />

        <el-select
          class="field-select"
          size="mini"
          v-model="filterConfig.fieldId"
          filterable
          placeholder="请输入或选择筛选字段"
          @change="appendFieldData(filterConfig.fieldId, filterConfig.id)"
        >
          <el-option
            v-for="tableColumn in allColumns"
            :key="tableColumn.id"
            :label="columnNameFormatter(tableColumn)"
            :value="tableColumn.id"
          />
        </el-select>

        <!-- Filter 类型 -->
        <el-select
          class="type-select"
          size="mini"
          v-model="filterConfig.type"
          @change="filterTypeHandler(filterConfig.id)"
        >
          <el-option label="标准" :value="0" />
          <el-option label="范围" :value="1" />
        </el-select>

        <!-- 标准 -->
        <div v-if="filterConfig.type === 0" class="config-inner">
          <!-- 可选的values -->
          <el-select
            class="value-select"
            size="mini"
            v-model="filterConfig.values"
            placeholder="请选择过滤值"
          >
            <el-option
              v-for="(standard, standardIndex) in standards[filterConfig.id]"
              :key="standardIndex"
              :label="standard"
              :value="standard"
            />
          </el-select>
        </div>

        <!-- 范围 -->
        <div v-else class="config-inner">
          <!-- Where 类型 -->
          <el-select
            class="condition-select"
            size="mini"
            v-model="filterConfig.whereType"
            placeholder="请选择过滤条件"
          >
            <el-option
              v-for="type in whereTypeMapping"
              :key="type.value"
              :label="type.text"
              :value="type.value"
            />
          </el-select>

          <el-input
            class="value-input"
            size="mini"
            v-model="filterConfig.values"
            placeholder="条件值以英文逗号隔开"
          />
        </div>
      </div>
    </main>
    <!-- config-inline END -->

    <footer>
      <el-button type="text" @click="goBack">取 消</el-button>
      <el-button type="primary" @click="doSave">保存并返回</el-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Inject } from "vue-property-decorator";
import Dashboard from "@/model/view/dashboard/Dashboard";
import { EditorStore, CommonStore } from "@/store/modules-model";
import { FilterType } from "@/enums/FilterType";
import ObjectUtil from "@/util/ObjectUtil";
import TableInfoVO from "@/model/results/TableInfoVO";
import {
  FilterDatapack,
  FilterConfig,
  FilterBuilder
} from "@/model/view/Filter";
import { WhereType, WhereTypeMapping } from "@/enums/WhereType";
import UIUtil from "@/util/UIUtil";
import { StandardsMap } from "./main.vue";

@Component
export default class ConfigView extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  // 数据模型
  @EditorStore.Getter("allColumns")
  allColumns!: Array<TableInfoVO>;

  @Prop()
  datapack!: FilterDatapack | null;

  @Prop()
  loadValue!: Function;

  @Emit("save")
  doSave() {}

  @Emit("back")
  goBack() {}

  @Emit("set-loading")
  setLoading(isLoading: boolean) {
    return isLoading;
  }

  // 过滤条件
  whereTypeMapping = WhereTypeMapping;

  /**
   * 数据包
   */
  get currentFilterPack(): FilterDatapack | null {
    return this.datapack;
  }
  set currentFilterPack(datapack) {
    this.$emit("update:datapack", datapack);
  }

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
  @Prop()
  fieldValues!: StandardsMap;

  get standards(): StandardsMap {
    return this.fieldValues;
  }
  set standards(val: StandardsMap) {
    this.$emit("update:field-values", val);
  }

  /**
   * 操作部分
   */

  // 字段(列名) 格式化
  columnNameFormatter(tableColumn: TableInfoVO): string {
    let suffix = tableColumn.alias ? ` - ${tableColumn.alias}` : "";
    return `${tableColumn.columnName}${suffix}`;
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
   * 添加一条过滤配置
   */
  addFilter(): void {
    let filterPackId = this.currentFilterPack?.id as string,
      generatedConfig = FilterBuilder.buildFilterConfig(filterPackId);
    this.currentFilterPack?.config.push(generatedConfig);
  }

  /**
   * 删除一条过滤配置
   */
  removeFilter(configIndex: number): void {
    this.currentFilterPack?.config.splice(configIndex, 1);
  }

  /**
   * 选中字段时，追加值
   */
  appendFieldData(tableColumnId: string, configId: string) {
    let currentFilter = this.getCurrentFilterConfig(configId);

    if (!currentFilter) return;

    this.allColumns.forEach((column: TableInfoVO) => {
      if (tableColumnId === column.id) {
        currentFilter.fieldData = ObjectUtil.copy(column);
        return;
      }
    });

    if (currentFilter.type === FilterType.standard) {
      this.setLoading(true);
      this.loadValue(configId)
        .catch((err: Error) => console.error(err))
        .finally(() => this.setLoading(false));
    }
  }

  /**
   * 选择过滤器类型时
   *  - 为标准时，查询待选值，重置where类型为等于
   *  - 为范围时，重置where类型为等于
   */
  filterTypeHandler(configId: string): void {
    let currentFilter = this.getCurrentFilterConfig(configId);

    switch (currentFilter.type) {
      case FilterType.standard:
        this.setLoading(true);
        this.loadValue(configId)
          .catch((err: Error) => console.error(err))
          .finally(() => {
            this.resetFilter(currentFilter);
            this.setLoading(false);
          });
        break;
      case FilterType.boundary:
        this.resetFilter(currentFilter);
        break;
    }
  }

  resetFilter(currentFilter: FilterConfig): void {
    currentFilter.whereType = WhereType.EQ;
    currentFilter.values = "";
  }
}
</script>

<style lang="scss" scoped>
$mainMinHeight: 320px;
$configMinWidth: 650px;

.config-view {
  @include select(none);

  main {
    min-height: $mainMinHeight;

    .filter-name {
      .el-input {
        width: 300px;
      }
    }

    .config-inline {
      min-width: $configMinWidth;

      & + .config-inline {
        margin-top: 14px;
      }

      .el-button {
        padding: 7px 10px;
      }

      .el-select {
        margin-left: 10px;
      }

      .el-input {
        margin-left: 10px;
      }

      .config-inner {
        display: inline-block;
      }

      /**
        * 宽度设置
        */
      .field-select {
        width: 180px;
      }

      .type-select {
        width: 80px;
      }

      .condition-select {
        width: 110px;
      }

      .value-select,
      .value-input {
        width: 150px;
      }
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
