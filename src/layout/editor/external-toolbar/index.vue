<template>
  <div
    class="external-toolbar detail-toolbar"
    v-show="index === activeIndex && !isSavingScreenhot"
  >
    <tool-button
      :icon-class="
        focusItem.id ? 'fa fa-compress-arrows-alt' : 'fa fa-expand-arrows-alt'
      "
      :title="focusItem.id ? '取消' : '聚焦'"
      placement="right"
      @click="handleFocus"
    />

    <tool-button icon-class="fa fa-cog" title="设置" @click="doShowMenu" />

    <tool-button icon-class="fa fa-trash" title="删除" @click="handleDelete" />
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Model,
  Watch,
  Prop,
  Provide
} from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import ToolButton from "@/components/ToolButton.vue";
import ObjectUtil from "@/util/ObjectUtil";
import { DashWidget } from "@/types/DashWidget";

@Component({
  components: {
    ToolButton
  }
})
export default class CommonToolbar extends Vue {
  /**
   * 仪表盘数据
   */
  @Prop()
  data!: DashWidget<any>;

  @Prop()
  index!: number;

  @Provide()
  wdata = this.data;

  /**
   * 配置菜单部分
   */
  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 菜单是否可见
  @EditorStore.State("menuVisible")
  menuVisible!: boolean;

  // 设置菜单是否可见
  @EditorStore.Mutation("setMenuVisible")
  setMenuVisible!: Function;

  // 聚焦图表信息
  @CommonStore.State("focusDashboard")
  focusItem!: DashWidget<any>;

  // 设置聚焦状态
  @CommonStore.Mutation("setFocusDashboard")
  setFocusItem!: Function;

  // 正在截图标志
  @CommonStore.State("isSavingScreenhot")
  isSavingScreenhot!: boolean;

  // 删除仪表盘
  @CommonStore.Mutation("deleteDashboard")
  deleteWidget!: Function;

  get widgetData() {
    return this.data;
  }

  set widgetData(widgetData: DashWidget<any>) {
    this.$emit("update:data", widgetData);
  }

  /**
   * 删除
   */
  handleDelete() {
    this.deleteWidget(this.activeIndex);
  }

  // 显示菜单
  doShowMenu() {
    const isShowMenu = this.activeIndex !== -1 && !this.menuVisible;
    this.setMenuVisible(isShowMenu);
  }

  /**
   * 聚焦按钮
   */
  handleFocus() {
    // 是否存在放大的图表
    const focusId = this.focusItem.id ? "" : this.data.id;
    this.setFocusItem({ id: focusId });
  }
}
</script>

<style lang="scss">
.external-toolbar {
  display: flex;
  flex-flow: column nowrap;
  position: absolute;
  right: -40px;
  top: 0;
  background: #fff;
  border-radius: 4px;
}
</style>
