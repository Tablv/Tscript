<template>
  <section class="config-view">
    <main>
      <el-form @submit.native.prevent label-position="right" label-width="80px">
        <el-form-item class="sort-name" label="排序名称">
          <el-input v-model="currentSortPack.name" size="mini" />
        </el-form-item>
        <el-form-item class="sort-name" label="排序方式">
          <el-radio-group
            v-model="currentTabName"
            @change="sortTypeHandler"
            size="mini"
          >
            <el-radio-button label="resultOrder">计算结果</el-radio-button>
            <el-radio-button label="customOrder">自定义顺序</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <el-divider></el-divider>

      <!-- 计算结果 -->
      <div v-if="isResultOrder">
        <el-scrollbar>
          <div class="drag-area-box field-drag-area-box">
            <draggable
              :animation="200"
              class="sort-drag-area"
              v-model="currentSortPack.config.data"
            >
              <el-row
                v-for="(sortData, sortIndex) in currentSortPack.config.data"
                :key="sortIndex"
                :gutter="10"
                type="flex"
                align="middle"
                class="result-line sort-drag-item"
              >
                <el-col :span="2">
                  <i class="el-icon-d-caret"></i>
                </el-col>

                <el-col :span="10">{{ sortData.fieldData.alias }}</el-col>

                <el-col :span="12">
                  <el-radio-group v-model="sortData.orderType" size="mini">
                    <el-radio-button
                      v-for="type in orderTypeMapping"
                      :key="type.value"
                      :label="type.value"
                      >{{ type.text }}</el-radio-button
                    >
                  </el-radio-group>

                </el-col>
              </el-row>
            </draggable>
          </div>
        </el-scrollbar>
        <!-- config-inline END -->
      </div>
      <!-- 自定义顺序 -->
      <div v-if="isCustomOrder">
        <el-form
          @submit.native.prevent
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="筛选字段">
            <el-select
              size="mini"
              v-model="currentSortPack.config.custom.fieldId"
              filterable
              placeholder="请输入或选择筛选字段"
              @change="loadCustomFieldValue"
            >
              <el-option
                v-for="tableColumn in allColumns"
                :key="tableColumn.id"
                :label="columnNameFormatter(tableColumn)"
                :value="tableColumn.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="form-label-balance">
            <!-- 排序框 -->
            <el-scrollbar>
              <div class="drag-area-box">
                <draggable
                  :animation="200"
                  class="sort-drag-area"
                  v-model="currentSortPack.config.custom.refData"
                >
                  <div
                    v-for="data in currentSortPack.config.custom.refData"
                    :key="data"
                    class="sort-drag-item"
                  >
                    <span>{{ data }}</span>
                    <i class="el-icon-d-caret"></i>
                  </div>
                </draggable>
              </div>
            </el-scrollbar>
          </el-form-item>
        </el-form>
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
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { CommonStore, EditorStore } from "@/store/modules-model";

import draggable from "vuedraggable";
import TabPane from "element-ui/types/tab-pane";
import { SortType } from "glaway-bi-model/enums/SortType";
import ObjectUtil from "@/util/ObjectUtil";
import TableInfoVO from "glaway-bi-model/results/TableInfoVO";
import {
  SortDatapack,
  SortConfig,
  ResultOrder,
  CustomField,
  SortBuilder
} from "glaway-bi-model/view/Sort";
import { OrderType, OrderTypeMapping } from "glaway-bi-model/enums/OrderType";
import UIUtil from "@/util/UIUtil";
import { SortTab } from "./main.vue";

@Component({
  components: {
    draggable
  }
})
export default class ConfigView extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  // 数据模型
  @EditorStore.Getter("allColumns")
  allColumns!: Array<TableInfoVO>;

  @Prop()
  datapack!: SortDatapack | null;

  @Prop()
  loadValue!: Function;

  @Prop()
  tabName!: SortTab;

  @Emit("save")
  doSave() {}

  @Emit("back")
  goBack() {}

  @Emit("set-loading")
  setLoading(isLoading: boolean) {
    return isLoading;
  }

  /**
   * Getter
   */
  get isResultOrder(): boolean {
    return this.currentSortPack?.config.type === SortType.result;
  }

  get isCustomField(): boolean {
    return this.currentSortPack?.config.type === SortType.customField;
  }

  get isCustomOrder(): boolean {
    return this.currentSortPack?.config.type === SortType.customOrder;
  }

  // 排序类型
  orderTypeMapping = OrderTypeMapping;

  // 当前标签页
  get currentTabName() {
    return this.tabName;
  }
  set currentTabName(tabName: SortTab) {
    this.$emit("update:tab-name", tabName);
  }

  /**
   * 数据包
   */
  get currentSortPack(): SortDatapack | null {
    return this.datapack;
  }
  set currentSortPack(datapack) {
    this.$emit("update:datapack", datapack);
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
   * 自定义字段
   *  - 添加一条排序配置
   */
  addSort(): void {
    let sortPackId = this.currentSortPack?.id as string,
      generatedConfig = SortBuilder.buildCustomField();
    (this.currentSortPack?.config.data as Array<CustomField>).push(
      generatedConfig
    );
  }

  /**
   * 自定义字段
   *  - 删除一条排序配置
   */
  removeSort(sortIndex: number): void {
    this.currentSortPack?.config.data.splice(sortIndex, 1);
  }

  /**
   * 自定义字段
   *  - 选中字段时，追加值
   */
  appendFieldData(sortIndex: number) {
    let currentOrder = this.currentSortPack?.config.data[
        sortIndex
      ] as CustomField,
      tableInfo = null;

    this.setLoading(true);

    if (currentOrder) {
      this.allColumns.forEach((column: TableInfoVO) => {
        if ((currentOrder as CustomField).fieldId === column.id) {
          tableInfo = ObjectUtil.copy(column);
          return;
        }
      });
    }

    if (currentOrder && tableInfo) {
      currentOrder.fieldData = tableInfo;
    } else {
      UIUtil.showErrorMessage("字段选择失败 请稍后重试");
      if (currentOrder) {
        currentOrder.fieldId = "";
      }
    }

    this.setLoading(false);
  }

  /**
   * 自定义排序
   *  - 选中字段时，加载字段值
   */
  loadCustomFieldValue() {
    let currentSort = this.currentSortPack?.config;

    if (!currentSort) return;

    this.allColumns.forEach((column: TableInfoVO) => {
      if (currentSort?.custom && currentSort?.custom.fieldId === column.id) {
        currentSort.custom.fieldData = ObjectUtil.copy(column);
        return;
      }
    });

    if (currentSort.type === SortType.customOrder) {
      this.setLoading(true);
      this.loadValue(currentSort)
        .catch((err: Error) => console.error(err))
        .finally(() => this.setLoading(false));
    }
  }

  /**
   * 选择排序类型时
   *  - 为计算结果时，排序类型置为计算结果，重置数据
   *  - 为自定义顺序时，排序类型置为自定义顺序，查询结果，重置数据
   */
  sortTypeHandler(): void {
    if (!this.currentSortPack) return;

    const currentSort = this.currentSortPack.config;

    switch (this.currentTabName) {
      case SortTab.result: {
        currentSort.type = SortType.result;
        this.initResult(currentSort);
        this.resetCustomOrder(currentSort);
        break;
      }
      // case SortTab.customField: {
      //   this.currentSortPack.config.type = SortType.customField;
      //   this.resetSort(currentSort);
      //   currentSort.type = SortType.customField;
      //   break;
      // }
      case SortTab.customOrder: {
        if (currentSort.custom?.fieldData) {
          this.setLoading(true);
          this.loadValue(currentSort)
            .catch((err: Error) => console.error(err))
            .finally(() => {
              this.setLoading(false);
            });
        } else {
          this.initCustomOrder(currentSort);
        }

        currentSort.type = SortType.customOrder;
        this.resetResult(currentSort);
        break;
      }
    }
  }

  // resetSort(currentSort: SortConfig): void {
  //   const dimensions = this.currentDashboard.analysis.dimensions,
  //     measures = this.currentDashboard.analysis.measures,
  //     allFields = dimensions.concat(measures);

  //   currentSort.data = SortBuilder.buildResultOrders(allFields);
  //   currentSort.custom = SortBuilder.buildCustomOrder();
  // }

  /**
   * 计算结果
   */
  // 初始化
  initResult(currentSort: SortConfig): void {
    const dimensions = this.currentDashboard.analysis.dimensions,
      measures = this.currentDashboard.analysis.measures,
      allFields = dimensions.concat(measures);

    currentSort.data = SortBuilder.buildResultOrders(allFields);
  }

  // 重置
  resetResult(currentSort: SortConfig): void {
    currentSort.data = [];
  }

  /**
   * 自定义顺序
   */
  // 初始化
  initCustomOrder(currentSort: SortConfig): void {
    currentSort.custom = SortBuilder.buildCustomOrder();
  }

  // 重置
  resetCustomOrder(currentSort: SortConfig): void {
    currentSort.custom = SortBuilder.buildCustomOrder();
  }
}
</script>

<style lang="scss" scoped>
@import "../toolkit/config-view";
$mainMinHeight: 320px;
$configMinWidth: 530px;

@include defaultConfigView($mainMinHeight);

.config-view {
  @include select(none);

  main {
    min-height: $mainMinHeight;

    .result-line {
      > div {
        text-align: center;
      }

      & + .result-line {
        margin-top: 8px;
      }
    }

    .field-drag-area-box {
      padding: 0 20px;
    }

    .drag-area-box {
      height: 160px;

      .sort-drag-area {
        margin-top: 10px;

        .sort-drag-item {
          padding: 6px 10px;
          line-height: 18px;
          background: rgba(0, 0, 0, 0.03);
          border-radius: 4px;
          margin-bottom: 8px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          cursor: move;
          cursor: -webkit-grab;
          cursor: -moz-grab;
          cursor: -ms-grab;
          cursor: -o-grab;

          &:hover {
            background: rgba(0, 0, 0, 0.08);
          }
        }
      }
    }

    // 用于平衡 带标签留白时，左右不对称
    .form-label-balance {
      ::v-deep {
        .el-form-item__content {
          margin-right: 80px;
        }
      }
    }
  }
}
</style>
