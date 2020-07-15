<template>
  <div class="resizable-chart">
    <vdr
      @dragstop="onDragStop"
      @dragging="onDrageding"
      @resizestop="onResizeStop"
      :w="thisDashboard.visualData.width"
      :h="thisDashboard.visualData.height"
      :x="thisDashboard.visualData.position.x"
      :y="thisDashboard.visualData.position.y"
      :z="thisDashboard.visualData.position.z"
      :grid="thisDashboard.visualData.grid"
      :draggable="!focusDashboard.id"
      :resizable="!focusDashboard.id"
      :class="{
        activeElement: index === activeIndex && !isSavingScreenhot,
        hideElement:
          thisDashboard.id !== focusDashboard.id && focusDashboard.id !== ''
      }"
    >
      <!-- <widget @dblclick.native="enableWidgetEditable" :data="thisDashboard"></widget> -->
    </vdr>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Inject,
  Prop,
  Emit,
  Watch
} from "vue-property-decorator";
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";

import debounce from "@/util/debounce";
import Page from "@/types/EditorPage";
import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/config/StoryBuilder";
import { StoryWidget, widgetConfig } from "@/types/StoryWidget";
import { StoryPage } from "@/types/Story";
// import Widget, { WidgetPageConfig } from "@/components/Widget.vue";
import { scaledStyle } from "@/util/scale-util";
import { CommonStore, EditorStore } from "@/store/modules-model";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { AnalysisResults } from "glaway-bi-model/types/AnalysisResults";

export interface RefLineParam {
  /**
   * 是否显示
   */
  display: boolean;

  /**
   * 左侧位移
   */
  origin: string;

  /**
   * 顶部位移
   */
  position: string;

  /**
   * 宽度
   */
  lineLength: string;
}

@Component({
  components: {
    vdr
    // Widget
  }
})
export default class ResizableElement extends Vue {
  // @Inject()
  // state!: Page.State;

  // @Inject()
  // getter!: Page.Getter;

  // @Prop()
  // widgetData!: StoryWidget<any>;

  // @Emit("activated")
  // onActivated() {
  //   return this.widgetData;
  // }

  // @Provide()
  // widgetConfig: WidgetPageConfig = {
  //   pageEditMode: this.pageLockedByMe,
  //   widgetEditMode: false,
  //   scale: this.screenScale
  // };
  // 处于聚焦状态
  @CommonStore.State("focusDashboard")
  focusDashboard!: string;

  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // get widgetClassName() {
  //   return {
  //     bordered: this.shouldBordered,
  //     "is-current": this.isCurrentWidget,
  //     "editable-widget": this.widgetConfig.pageEditMode
  //   };
  // }

  // get pageLockedByMe() {
  //   return this.getter.pageLockedByMe;
  // }

  // get snapshotMoment() {
  //   return this.state.snapshotMoment;
  // }

  // get isCurrentWidget() {
  //   return this.widgetData.id === this.currentWidget?.id;
  // }

  // @Watch("pageLockedByMe")
  // @Watch("snapshotMoment")
  // onPageLockUpdate() {
  //   this.widgetConfig.pageEditMode =
  //     this.getter.pageLockedByMe && !this.snapshotMoment;
  // }

  // get screenScale() {
  //   return this.state.screenScale;
  // }

  // @Watch("screenScale")
  // syncScale() {
  //   // 预览模式不同步缩放比例
  //   if (this.state.previewMode) return;

  //   this.widgetConfig.scale = this.screenScale;
  // }

  // /**
  //  * 是否可拖拽
  //  */
  // get isDraggable() {
  //   const editMode = this.widgetConfig.pageEditMode;
  //   const widgetNotEditing = !this.widgetConfig.widgetEditMode;
  //   return editMode && widgetNotEditing;
  // }

  // get shouldBordered() {
  //   const noBorder = !this.widgetData.config.border.enable;
  //   const editMode = this.widgetConfig.pageEditMode;
  //   return noBorder && editMode;
  // }

  // get scaledConfig() {
  //   return scaledStyle.getWidgetSize(
  //     this.widget.config,
  //     this.state.screenScale
  //   );
  // }

  /**
   * 启用编辑
   */
  enableWidgetEditable() {
    // if (!this.getter.pageLockedByMe) return;
    // this.widgetConfig.widgetEditMode = true;
    // window.addEventListener("click", debounce(300, this.clickOnEditing));
  }

  /**
   * 编辑中的点击回调
   */
  clickOnEditing(evt: MouseEvent) {
    // const $toolbar = document.querySelector(".tool-bar") as HTMLDivElement;
    // const toolbarClicked = $toolbar.contains(evt.target as Node);
    // if (toolbarClicked) return;
    // this.widgetConfig.widgetEditMode = false;
    // window.removeEventListener("click", this.clickOnEditing);
  }

  get widget(): StoryWidget<widgetConfig.Base> {
    // return this.widgetData;
    return {} as any;
  }

  set widget(widget: StoryWidget<widgetConfig.Base>) {
    // this.$emit("update:data", widget);
  }

  // get currentWidget() {
  //   // return this.state.currentWidget;
  // }

  // isActiveWidget(): boolean {
  //   return this.widget.id === this.currentWidget?.id;
  // }

  /**
   * 拖拽结束 回调
   */
  // onDragStop(x: number, y: number) {
  //   const scale = this.state.screenScale;
  //   this.widget.config.position.x = x / scale;
  //   this.widget.config.position.y = y / scale;
  // }

  /**
   * 调整大小结束 回调
  //  */
  // onResizeStop(x: number, y: number, width: number, height: number) {
  //   const scale = this.state.screenScale;
  //   this.widget.config.size.width = width / scale;
  //   this.widget.config.size.height = height / scale;
  // }

  /**
   * 每个可调整元素的数据和所在下标
   */
  @Prop()
  item!: Dashboard;

  @Prop()
  index!: number;

  // 是否正在加载数据
  isFetching = false;

  // 是否分析成功
  analysisSuccess = true;

  // 是否显示详细工具栏
  isShowDetail = false;

  analysisResult: AnalysisResults = [];

  get thisDashboard(): Dashboard {
    return this.item;
  }

  set thisDashboard(dashboard: Dashboard) {
    this.$emit("update:item", dashboard);
  }

  /**
   * 获取偏移位置
   * 拖拽结束
   */
  onDragStop(x: number, y: number): void {
    // 防止出现非当前下标的元素被操作的问题
    // this.setActiveIndex(this.index);
  }

  /**
   * 拖拽进行时
   */
  onDrageding(x: number, y: number) {
    // this.setPosition(x, y);
    // this.$nextTick(() => {
    //   this.chartComponent?.resizeChart();
    // });
  }

  /**
   * 调整大小
   * 调整结束
   */
  onResizeStop(x: number, y: number, width: number, height: number): void {
    // if (this.activeIndex === -1) return;
    // // 防止出现非当前下标的元素被操作的问题
    // this.setActiveIndex(this.index);
    // this.setPosition(x, y);
    // this.setSize(width, height);
    // // 如果类型为 Echarts 图表，则调用 resize 方法
    // this.$nextTick(() => {
    //   this.chartComponent?.resizeChart();
    // });
    // this.hideDetailBar(true);
  }

  /**
   * 设置数据的坐标
   */
  setPosition(x: number, y: number): void {
    // this.thisDashboard.visualData.position.x = x;
    // this.thisDashboard.visualData.position.y = y;
  }

  /**
   * 设置数据的尺寸
   */
  setSize(width: number, height: number): void {
    // this.thisDashboard.visualData.width = width;
    // this.thisDashboard.visualData.height = height;
  }
}
</script>

<style lang="scss" scoped>
$bgColor: #fff;
$handleColor: #09f;
$borderColor: #00a2ff;
$shadowColor: #58bee9;
$shadow: 0 0 6px $shadowColor;
@mixin topAndLeft($top, $left) {
  margin-top: $top;
  margin-left: $left;
}
$borderColor: #00a2ff;

.widget-box {
  .widget-item {
    width: 100%;
    height: 100%;
    overflow: hidden;
    user-select: none;
    box-sizing: border-box;
  }
}

.editable-widget {
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &.bordered,
  &.is-current {
    border: 1px solid $borderColor;
  }

  // 当前激活的元素
  &.is-current {
    box-shadow: 0 0 6px #58bee9;
  }
}

.vdr {
  background-color: $bgColor;
  // cursor: default;

  // 悬停效果
  &:hover {
    box-shadow: $shadow;
  }

  // 当前激活的元素
  &.activeElement {
    border: 1px solid $borderColor;
  }

  // 当前激活的元素
  &.hideElement {
    z-index: -1 !important;
  }

  .no-chart-text {
    padding: 16px 0;
    text-align: center;
  }

  .no-chart-img {
    background: url("#{$basePath}img/no-chart.svg") no-repeat center;
    background-size: contain;
    position: absolute;
    top: 40px;
    left: 20px;
    right: 20px;
    bottom: 0;
  }
  .chart-component {
    width: 100%;
    height: 100%;
  }

  .draggable-content {
    position: relative;
    width: 100%;
    height: 100%;

    .toolbar-box {
      width: 100%;

      .chart-toolbar {
        position: absolute;
        z-index: 1000;
      }

      .common-toolbar {
        right: 0;
      }
    }
  }

  /**
   * 手柄部分自定义样式
   */
  ::v-deep {
    .handle {
      width: 10px;
      height: 10px;
      box-shadow: 0 0 0;
      border: 3px solid $handleColor;
      background-color: transparent;
      z-index: 999;
    }

    // top
    .handle-tl,
    .handle-tm,
    .handle-tr {
      top: 0;
      border-bottom: none;
    }

    // right
    .handle-tr,
    .handle-mr,
    .handle-br {
      left: 100%;
      border-left: none;
    }

    // bottom
    .handle-bl,
    .handle-bm,
    .handle-br {
      top: 100%;
      border-top: none;
    }

    // left
    .handle-tl,
    .handle-ml,
    .handle-bl {
      left: 0;
      border-right: none;
    }

    // center
    .handle-tm,
    .handle-bm {
      border-left: none;
      border-right: none;
      border-width: 5px;
    }

    // middle
    .handle-ml,
    .handle-mr {
      border-top: none;
      border-bottom: none;
      border-width: 5px;
    }

    // topLeft
    .handle-tl {
      @include topAndLeft(3px, 3px);
    }

    // topMiddle
    .handle-tm {
      @include topAndLeft(2px, -5px);
    }

    // topRight
    .handle-tr {
      @include topAndLeft(3px, -6px);
    }

    // middleLeft
    .handle-ml {
      @include topAndLeft(-5px, 2px);
    }

    // middleRight
    .handle-mr {
      @include topAndLeft(-5px, -5px);
    }

    // bottomLeft
    .handle-bl {
      @include topAndLeft(-6px, 3px);
    }

    // bottomMiddle
    .handle-bm {
      @include topAndLeft(-5px, -5px);
    }

    // bottomRight
    .handle-br {
      @include topAndLeft(-6px, -6px);
    }
  }
}
</style>
