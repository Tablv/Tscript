<template>
  <el-card
    class="box-card"
    body-style="padding: 8px 8px 0 0"
    :shadow="boxCardShadow"
  >
    <el-form label-position="right">
      <el-form-item label="数据模型">
        <!-- 选择数据集 -->
        <dataset-chooser />
      </el-form-item>

      <!-- 表数据 -->
      <ul class="fields-box">
        <li class="field" v-for="table in tableList" :key="table.id">
          <div class="table-title">
            <i class="fa fa-database"></i>
            <span>{{ table.showName || table.name }} 表</span>
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
                <i :class="getTableColumnIcon(tableColumn.dataType)"></i>
                <div class="field-content">
                  <span>{{ tableColumn.alias }}</span>
                </div>
              </div>
            </transition-group>
          </draggable>
        </li>
      </ul>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { Component, Vue, Inject, Watch } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import TableVO from "glaway-bi-model/results/TableVO";
import FieldDTO, { FieldDTOBuilder } from "glaway-bi-model/params/FieldDTO";
import DashboardUtil from "@/util/DashboardUtil";
import TableInfoVO from "glaway-bi-model/results/TableInfoVO";
import DatasetChooser from "./functional/dialog/DatasetChooser.vue";
import { Properties } from 'csstype';

const tableColumnIcons: { [dataType: string]: string } = {
  NUMBER: "fa fa-hashtag",
  VARCHAR: "fa fa-file",
  DATE: "fa fa-calendar-alt",
  default: "fa fa-question"
};

@Component({
  components: {
    draggable,
    DatasetChooser
  }
})
export default class ModelMenu extends Vue {
  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  /**
   * 数据集部分
   */

  // 数据模型
  @EditorStore.State("tableList")
  tableList!: Array<TableVO>;

  // 字段图标
  getTableColumnIcon(dataType: string) {
    return tableColumnIcons[dataType] || tableColumnIcons.default;
  }

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
    (fieldDTO as any).dataType = tableInfo.dataType;
    return fieldDTO;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/common.scss";

// 颜色定义
$fieldColor: #409eff;

.table-title {
  padding: 10px 0;
  font-size: 13px;

  i {
    color: #3685f2;
  }
}

.fields-box {
  list-style: none;
  margin: 0;
  padding: 0;
  padding-bottom: 40px;
  @include select(none);

  i {
    margin-right: 6px;
  }
}

// 字段选项
.fields-item {
  font-size: 12px;
  padding: 4px 0 4px 16px;
  border: 1px solid transparent;
  border-radius: 6px;
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
