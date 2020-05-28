<template>
  <!-- 拖拽区域 -->
  <draggable
    class="drag-area"
    v-model="axisDroppedData"
    :animation="200"
    :group="{ put: true, pull: false }"
    @change="axisDropHandler"
  >
    <transition-group>
      <div
        class="drag-item"
        v-for="(column, index) in axisDroppedData"
        :key="column.id"
        :title="column.alias"
      >
        <span>
          <span>{{ columnNameFormatter(column) }}</span>
          <el-tag
            v-for="(func, funcIndex) in column.func"
            :key="funcIndex"
            size="mini"
          >
            <span>{{ func }}</span>
          </el-tag>
        </span>
        <el-dropdown trigger="click" @command="axisDropdownHandler">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- 设置函数 -->
            <div v-if="functionEnable">
              <el-dropdown-item
                v-for="command in getDropdownCommands(index)"
                :key="command.text"
                :command="command"
              >
                <span>{{ command.text }}</span>
              </el-dropdown-item>
            </div>

            <!-- 其他操作 -->
            <el-dropdown-item
              :divided="functionEnable"
              :command="{
                otherHandle: 'delete',
                index: index
              }"
            >
              <span>移除</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </transition-group>
    <template #footer>
      <div class="tips" v-if="!axisData.length">拖入字段</div>
    </template>
  </draggable>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import draggable from "vuedraggable";
import "@/assets/draggable.scss";
import FieldDTO, { FieldDTOBuilder } from "glaway-bi-model/params/FieldDTO";
import ObjectUtil from "@/util/ObjectUtil";
import TableInfoVO from "glaway-bi-model/results/TableInfoVO";
import { FieldType } from "glaway-bi-model/enums/FieldType";

/**
 * 维度、度量 下拉菜单类
 */
interface AxisWidgetCommandEntity {
  /**
   * 操作下标
   */
  index: number;

  /**
   * 下拉配置函数
   */
  func?: Array<string>;

  /**
   * 除配置函数外，指定其他处理方法
   */
  otherHandle?: string;

  /**
   * 显示文本
   */
  text?: string;
}

@Component({
  components: {
    draggable
  }
})
export default class Dimensions extends Vue {
  // @CommonStore.Getter("currentDashboard")
  // currentDashboard!: Dashboard;

  @Model("data")
  data!: Array<FieldDTO>;

  @Prop()
  axisType!: FieldType;

  /**
   * 开启下拉菜单函数配置
   */
  @Prop({ default: false })
  functionEnable!: boolean;

  /**
   * 开启 Emit 提交事件模式
   *  - 防止出现get/set方式传入新数组，导致无法修改值的问题
   */
  @Prop({ default: false })
  emitMode!: boolean;

  /**
   * Emit 事件
   */
  @Emit()
  change(axisData: Array<FieldDTO>) {
    return axisData;
  }

  /**
   * 用于 Draggable 取值、赋值
   *
   *  - 取值时，获取最新值
   */
  get axisDroppedData(): Array<FieldDTO> {
    return this.axisData;
  }

  /**
   * 丢弃 Draggable 修改的 Where 数据
   *
   *  - 无需赋值，监听 Draggable 的拖入事件可获取修改的值和下标
   */
  set axisDroppedData(val) {}

  /**
   * Widget 内可直接操作的数据
   */
  get axisData(): Array<FieldDTO> {
    return this.data;
  }

  set axisData(data: Array<FieldDTO>) {
    if (this.emitMode) {
      this.change(data);
    } else {
      this.$emit("data", data);
    }
  }

  /**
   * axisData.splice 的增强方法
   *  - Emit模式下，Emit 改变后的数组
   */
  axisDataSplice(start: number, deleteCount: number, ...items: FieldDTO[]) {
    // 复制一份数据
    let axisData = ObjectUtil.copy(this.axisData);

    // 调用 Array 的 splice 方法
    const args = (arguments as unknown) as [number, number, ...any[]];
    Array.prototype.splice.apply(axisData, args);

    // 赋值
    this.axisData = axisData;
  }

  // 字段(列名) 格式化
  columnNameFormatter(column: FieldDTO): string {
    // let suffix = column.alias ? ` - ${column.alias}` : "";
    // return `${column.columnName}${suffix}`;
    return column.alias || column.columnName;
  }

  /**
   * 将字段 拖入 Axis 时的处理方法
   */
  axisDropHandler(evt: any): void {
    // 添加事件处理
    if (evt.added) {
      // 取拖拽进的元素数据
      const axisInsertIndex = evt.added.newIndex;

      // 获取 TableInfoVO
      const tableInfo = evt.added.element as TableInfoVO,
        fieldDTO = FieldDTOBuilder.buildFieldDTO(tableInfo, this.axisType);

      // 赋值
      this.axisDataSplice(axisInsertIndex, 0, fieldDTO);
    }
  }

  /**
   * 获取下拉命令 (Axis 方法)
   */
  getDropdownCommands(index: number): Array<AxisWidgetCommandEntity> {
    return [
      {
        func: [],
        text: "无",
        index
      },
      {
        func: ["count"],
        text: "计数",
        index
      },
      {
        func: ["count", "distinct"],
        text: "计数 (去重)",
        index
      },
      {
        func: ["sum"],
        text: "求和",
        index
      },
      {
        func: ["avg"],
        text: "平均数",
        index
      },
      {
        func: ["max"],
        text: "最大值",
        index
      },
      {
        func: ["min"],
        text: "最小值",
        index
      }
    ];
  }

  /**
   * 下拉框处理方法
   */
  axisDropdownHandler({
    func,
    index,
    otherHandle
  }: AxisWidgetCommandEntity): void {
    // 配置函数
    if (func && func instanceof Array) {
      // 赋值为数据的 func 属性
      this.axisData[index].func = ObjectUtil.copy(func);
    } else if (otherHandle) {
      // 其他操作处理
      switch (otherHandle) {
        case "delete": {
          // 删除数据
          this.axisDataSplice(index, 1);
          break;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
