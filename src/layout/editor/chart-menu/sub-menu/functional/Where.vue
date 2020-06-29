<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header class="clearfix">
      <span>条件过滤</span>
      <div class="pull-right">
        <el-switch
          v-model="currentDashboard.analysis.isReact"
          active-text="参与联动"
          inactive-text=""
        />
      </div>
    </template>

    <draggable
      class="drag-area"
      v-model="whereDroppedData"
      :group="{ put: true, pull: false }"
      :animation="200"
      @change="whereDropHandler"
    >
      <transition-group>
        <div
          class="drag-item"
          v-for="(ele, index) in currentDashboard.analysis.where"
          :key="ele.id"
          :title="ele.columnName"
        >
          <span>
            <span>{{ ele.columnName }}</span>
            <span v-show="ele.columnAlias"> - {{ ele.columnAlias }}</span>
          </span>
          <el-dropdown trigger="click" @command="whereDropdownHandler">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="{
                  handle: 'edit:where',
                  index: index
                }"
                >编辑
              </el-dropdown-item>
              <el-dropdown-item
                divided
                :command="{
                  handle: 'delete',
                  index: index
                }"
                >移除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </transition-group>
      <div slot="footer" class="tips">拖入字段</div>
    </draggable>

    <!-- 条件过滤对话框 -->
    <where-dialog
      v-model="showWhereDialog"
      :data.sync="whereDialogData"
      :is-edit="dialogEditMode"
      @confirm="onDialogConfirm"
    />
  </el-card>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import "@/assets/draggable.scss";
import { Properties } from "csstype";

import { Vue, Component, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import ObjectUtil from "@/util/ObjectUtil";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import WhereDTO, { WhereColumnDTO } from "glaway-bi-model/params/WhereDTO";
import WhereDialog from "./dialog/WhereDialog.vue";
import TableInfoVO from "glaway-bi-model/results/TableInfoVO";

@Component({
  components: {
    draggable,
    WhereDialog
  }
})
export default class Where extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;

  /**
   * 条件过滤对话框部分
   */
  showWhereDialog = false;

  whereDialogData: WhereDTO | null = null;

  whereInsertIndex = -1;

  dialogEditMode = false;

  /**
   * 仪表盘分析 Where 数据
   */
  get whereData(): Array<WhereDTO> {
    return this.currentDashboard.analysis.where;
  }

  set whereData(val) {
    this.currentDashboard.analysis.where = val;
  }

  /**
   * 用于 Draggable 取值、赋值
   *
   *  - 赋值时，保存到临时变量，等待用户确认后保存到仪表盘
   */
  get whereDroppedData(): Array<WhereDTO> {
    return this.whereData;
  }

  /**
   * 丢弃 Draggable 修改的 Where 数据
   *
   *  - 监听 Draggable 的拖入事件可获取修改的值和下标
   */
  set whereDroppedData(val) {}

  /**
   * 条件过滤 下拉菜单处理方法
   */
  whereDropdownHandler({ handle, index }: WhereDropdownEntity): void {
    switch (handle) {
      case "delete":
        // 删除数据
        this.currentDashboard?.analysis.where.splice(index, 1);
        break;
      case "edit:where":
        // 开启正在编辑标志位
        this.whereDialogData = ObjectUtil.copy(this.whereData[index]);
        // 打开编辑 Where 对话框
        this.openWhereDialog(true);
        break;
    }
  }

  /**
   * 将字段 拖入条件过滤时的处理方法
   */
  whereDropHandler(evt: any): void {
    // 添加事件处理
    if (evt.added) {
      // 取拖拽进的元素数据
      this.whereInsertIndex = evt.added.newIndex;

      // 获取 TableInfoVO
      const element = evt.added.element as TableInfoVO;

      // 赋值给 whereDialogData 临时变量
      this.whereDialogData = {
        id: element.id,
        tableAlias: element.tableAlias,
        columnName: element.columnName,
        columnAlias: element.alias,
        w: [
          {
            type: 1,
            value: ""
          }
        ]
      };

      // 打开创建 Where 对话框
      this.openWhereDialog(false);
    }
  }

  /**
   * 打开条件对话框
   * @param isEditMode 是否为编辑模式
   */
  openWhereDialog(isEditMode: boolean) {
    this.dialogEditMode = isEditMode;
    this.showWhereDialog = true;
  }

  /**
   * 条件对话框确定
   */
  onDialogConfirm(data: WhereDTO) {
    if (this.whereInsertIndex === -1) return;

    // 保存数据
    this.whereData.splice(this.whereInsertIndex, 0, data);
  }
}

/**
 * 条件过滤 下拉菜单类
 */
interface WhereDropdownEntity {
  /**
   * 下拉操作方法
   */
  handle: string;

  /**
   * 操作下标
   */
  index: number;
}
</script>

<style lang="scss" scoped></style>
