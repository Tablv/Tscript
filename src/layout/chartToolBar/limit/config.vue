<template>
  <section class="config-view">
    <main>
      <el-form @submit.native.prevent label-position="right" label-width="80px">
        <el-form-item class="sort-name" label="排名名称">
          <el-input v-model="currentLimitPack.name" size="mini" />
        </el-form-item>

        <el-form-item class="sort-name" label="排名范围">
          <el-input v-model="currentLimitPack.config.limit" size="mini" />
        </el-form-item>
      </el-form>

      <el-divider></el-divider>

      <!-- 计算结果 -->
      <div>
        <el-scrollbar>
          <div class="drag-area-box field-drag-area-box">
            <el-radio-group
              v-model="currentLimitPack.config.order.fieldData.id"
              @change="dohandleChange"
            >
              <el-radio
                :label="sortData.fieldData.id"
                v-for="(sortData, sortIndex) in currentLimitPack.config
                  .orderData"
                :key="sortIndex"
                :gutter="10"
                type="flex"
              >
                <div class="radio-title">
                  {{
                    sortData.fieldData.alias || sortData.fieldData.columnName
                  }}
                </div>
                <el-radio-group v-model="sortData.orderType" size="mini">
                  <el-radio-button
                    v-for="type in orderTypeMapping"
                    :key="type.value"
                    :label="type.value"
                    >{{ type.text }}</el-radio-button
                  >
                </el-radio-group>
              </el-radio>
            </el-radio-group>
          </div>
        </el-scrollbar>
        <!-- config-inline END -->
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
  LimitDatapack,
  LimitConfig,
  LimitBuilder
} from "glaway-bi-model/view/Limit";
import { OrderType, OrderTypeMapping } from "glaway-bi-model/enums/OrderType";
import UIUtil from "@/util/UIUtil";

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
  datapack!: LimitDatapack | null;

  @Emit("save")
  doSave() {}

  @Emit("back")
  goBack() {}

  @Emit("set-loading")
  setLoading(isLoading: boolean) {
    return isLoading;
  }

  // 排序类型
  orderTypeMapping = OrderTypeMapping;

  /**
   * 数据包
   */
  get currentLimitPack(): LimitDatapack | null {
    return this.datapack;
  }
  set currentLimitPack(datapack) {
    this.$emit("update:datapack", datapack);
  }

  dohandleChange(label: string) {
    // this.currentLimitPack?.config.orderData.forEach(order => {
    //   if (order.fieldData.id === label && this.currentLimitPack) {
    //     this.currentLimitPack.config.order = order;
    //   }
    // });
  }

  /**
   * 操作部分
   */

  // 字段(列名) 格式化
  columnNameFormatter(tableColumn: TableInfoVO): string {
    let suffix = tableColumn.alias ? ` - ${tableColumn.alias}` : "";
    return `${tableColumn.columnName}${suffix}`;
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
    .el-radio-group {
      display: block;
      .el-radio {
        display: block;
        padding: 10px 0;
        .radio-title {
          // padding-left: 20px;
          width: 230px;
          transform: translateY(2px);
          display: inline-block;
        }
        .el-radio-group {
          display: inline-block;
        }
      }
    }
    .field-drag-area-box {
      padding: 0 20px;
    }

    .drag-area-box {
      height: 160px;
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
