<template>
  <el-dialog
    class="where-dialog"
    append-to-body
    :before-close="onWhereEditorClose"
    :visible.sync="show"
    v-if="show"
  >
    <!-- title -->
    <template #title>
      <div class="el-page-header__content">条件过滤</div>
    </template>

    <el-table v-if="show" :data="currentWhere.w" style="width: 100%">
      <el-table-column label="字段">
        <template>
          <span>{{ currentWhere.columnName }}</span>
          <span v-show="currentWhere.columnAlias">
            - {{ currentWhere.columnAlias }}</span
          >
        </template>
      </el-table-column>

      <el-table-column label="条件">
        <template slot-scope="scope">
          <el-select v-model="currentWhere.w[scope.$index].type" size="mini">
            <el-option label="等于" :value="1"></el-option>
            <el-option label="不等于" :value="2"></el-option>
            <el-option label="大于" :value="3"></el-option>
            <el-option label="大于等于" :value="4"></el-option>
            <el-option label="小于" :value="5"></el-option>
            <el-option label="小于等于" :value="6"></el-option>
            <el-option label="开头包含" :value="7"></el-option>
            <el-option label="结尾包含" :value="8"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="值">
        <template slot-scope="scope">
          <el-input
            v-model="currentWhere.w[scope.$index].value"
            size="mini"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="addWhereCol(scope.$index)"
          >
            <i class="fa fa-plus"></i>
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="delWhereCol(scope.$index, scope.row)"
          >
            <i class="fa fa-trash"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <template #footer class="dialog-footer">
      <el-button size="small" @click="onWhereEditorClose">取 消</el-button>
      <el-button size="small" type="primary" @click="onWhereEditConfirm"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import WhereDTO, { WhereColumnDTO } from "glaway-bi-model/params/WhereDTO";
import UIUtil, { MessageType } from "@/util/UIUtil";
import UUID from "@/util/UUID";

@Component
export default class WhereDialog extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  /**
   * 条件过滤部分
   */
  @Model("show")
  showDialog!: boolean;

  @Prop()
  data!: WhereDTO;

  @Prop()
  isEdit!: boolean;

  @Emit("confirm")
  confirmData(data: WhereDTO) {
    return data;
  }

  get show(): boolean {
    return this.showDialog;
  }

  set show(val: boolean) {
    this.$emit("show", val);
  }

  get currentWhere(): WhereDTO {
    return this.data;
  }

  set currentWhere(val: WhereDTO) {
    this.$emit("update:data", val);
  }

  addWhereCol(scopeIndex: number): void {
    if (this.currentWhere.w.length > 4) {
      UIUtil.showMessage("最多可添加5个条件过滤项", MessageType.warning);
      return;
    }

    let nextIndex = scopeIndex + 1,
      newWhereCol: WhereColumnDTO = {
        type: 1,
        value: ""
      };

    this.currentWhere.w.splice(nextIndex, 0, newWhereCol);
  }

  delWhereCol(scopeIndex: number): void {
    if (this.currentWhere.w.length < 2) {
      UIUtil.showMessage("最少需要保留1个条件过滤项", MessageType.warning);
      return;
    }

    this.currentWhere.w.splice(scopeIndex, 1);
  }

  onWhereEditConfirm(): void {
    this.confirmData(this.currentWhere);

    // 关闭编辑对话框
    this.show = false;
  }

  onWhereEditorClose(): void {
    this.show = false;
  }
}
</script>

<style lang="scss" scoped>
.where-dialog {
  ::v-deep {
    .el-dialog {
      width: 40%;
    }
    .el-dialog__body {
      padding-top: 10px;
    }
  }
}
</style>
