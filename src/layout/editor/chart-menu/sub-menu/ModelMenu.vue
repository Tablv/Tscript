<template>
  <floating-menu title="数据模型">
    <template #tool>
      <!-- 选择数据集 -->
      <dataset-chooser />
    </template>

    <ul class="fields-box">
      <li class="field" v-for="table in tables" :key="table.id">
        <div class="table-title">
          <i class="fa fa-database"></i>
          <span>{{ table.name }} 表</span>
        </div>

        <draggable
          class="drag-area"
          v-model="table.columns"
          :animation="200"
          :sort="false"
          :group="{ put: false, pull: 'clone' }"
          :clone="cloneField"
          :move="onDragField"
        >
          <transition-group>
            <div
              class="fields-item"
              v-for="tableColumn in table.columns"
              :key="tableColumn.id"
              :title="tableColumn.alias"
            >
              <i class="fa fa-file-o"></i>
              <div class="field-content">
                <span>{{ tableColumn.alias || tableColumn.columnName }}</span>
                <!-- <span>{{ tableColumn.columnName }}</span>
                <span
                  v-if="tableColumn.alias !== null && tableColumn.alias !== ''"
                >
                  - {{ tableColumn.alias }}</span
                > -->
              </div>
            </div>
          </transition-group>
        </draggable>
      </li>
    </ul>
  </floating-menu>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { Component, Vue, Inject, Watch } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import Dashboard from "@/model/view/dashboard/Dashboard";
import FloatingMenu from "@/components/FloatingMenu.vue";
import TableVO from "@/model/results/TableVO";
import FieldDTO, { FieldDTOBuilder } from "@/model/params/FieldDTO";
import DashboardUtil from "@/util/DashboardUtil";
import TableInfoVO from "@/model/results/TableInfoVO";
import DatasetChooser from "./functional/dialog/DatasetChooser.vue";

@Component({
  components: {
    FloatingMenu,
    draggable,
    DatasetChooser
  }
})
export default class ModelMenu extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  /**
   * 数据集部分
   */

  // 数据模型
  @EditorStore.State("tables")
  tables!: Array<TableVO>;

  /**
   * 数组拖拽事件
   */
  // 数据模型部分
  onDragField(evt: any): boolean {
    // 判断与list内元素是否相同，相同则无法拖拽
    const draggedContext = evt.draggedContext,
      draggedId = draggedContext.element.id,
      relatedList = evt.relatedContext.list as Array<FieldDTO>;

    for (const index in relatedList) {
      const relatedElement = relatedList[index];
      let relatedId = relatedElement.id;

      if (relatedId === draggedId) {
        return false;
      }
    }

    return true;
  }

  cloneField(tableInfo: TableInfoVO) {
    const fieldDTO = FieldDTOBuilder.buildFieldDTO(tableInfo);
    return fieldDTO;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/common.scss";

// 颜色定义
$fieldColor: #409eff;

.table-title {
  padding: 10px;
  font-size: 14px;

  i {
    color: #3685f2;
  }
}

.fields-box {
  list-style: none;
  margin: 0;
  padding: 0;
  @include select(none);

  i {
    margin-right: 6px;
  }
}

// 字段选项
.fields-item {
  font-size: 13px;
  padding: 1px 0 1px 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: grab;

  display: flex;
  align-items: baseline;

  & + .fields-item {
    margin-top: 4px;
  }

  &:hover {
    color: #fff;
    background-color: $fieldColor;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  i {
    color: #faaa39;
  }

  .field-content {
    width: 100%;
  }
}
</style>
