<template>
  <div
    class="chart-toolbar text-common-toolbar"
    v-show="index === activeIndex && !isSavingScreenhot"
  >
    <tool-button
      :icon-class="
        focusWidgetData.id
          ? 'fa fa-compress-arrows-alt'
          : 'fa fa-expand-arrows-alt'
      "
      :title="focusWidgetData.id ? '取消' : '聚焦'"
      placement="top"
      @click="handleFocus"
    />
    <tool-button icon-class="fa fa-trash" title="删除" @click="handleDelete" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Watch, Prop } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import ToolButton from "@/components/ToolButton.vue";
import ObjectUtil from "@/util/ObjectUtil";
import { StoryWidget } from "@/types/StoryWidget";

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
  data!: StoryWidget<any>;

  @Prop()
  index!: number;

  /**
   * 配置菜单部分
   */
  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 聚焦图表信息
  @CommonStore.State("focusDashboard")
  focusWidgetData!: StoryWidget<any>;

  // 设置聚焦状态
  @CommonStore.Mutation("setFocusDashboard")
  setFocusWidgetData!: Function;

  // 正在截图标志
  @CommonStore.State("isSavingScreenhot")
  isSavingScreenhot!: boolean;

  // 删除仪表盘
  @CommonStore.Mutation("deleteDashboard")
  deleteWidget!: Function;

  get widgetData() {
    return this.data;
  }

  set widgetData(widgetData: StoryWidget<any>) {
    this.$emit("update:data", widgetData);
  }

  /**
   * 删除
   */
  handleDelete() {
    this.deleteWidget(this.activeIndex);
  }

  /**
   * 聚焦按钮
   */
  handleFocus() {
    // 是否存在放大的图表
    const id = this.focusWidgetData.id ? "" : this.widgetData.id;
    // 放大图表配置
    const nowWidgetData = { id } as StoryWidget<any>;
    if (!id) {
      // 存在放大图表，再次点击toggle
      this.widgetData.visualData = ObjectUtil.copy(
        this.focusWidgetData.visualData
      );
    } else {
      const box = document.querySelector("#gridBox") as HTMLElement;
      ObjectUtil.merge(nowWidgetData as any, {
        visualData: ObjectUtil.copy(this.widgetData.visualData)
      });
      ObjectUtil.merge(this.widgetData.visualData as any, {
        width: box.offsetWidth,
        height: box.offsetHeight,
        position: {
          x: 0,
          y: 0
        }
      });
    }
    this.setFocusWidgetData(Object.assign(this.focusWidgetData, nowWidgetData));
  }
}
</script>

<style lang="scss">
.el-popper {
  padding: 0 !important;
  min-width: auto !important;
}

.detail-toolbar-popper {
  z-index: 2000 !important;
}
</style>

<style lang="scss">
.text-common-toolbar {
  display: flex;
  flex-flow: column nowrap;
  position: absolute;
  right: -36px;
  top: 0;
  background: #fff;
  margin-left: 2px;
  border-radius: 2px;
}
</style>
