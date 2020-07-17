<template>
  <div class="resizable-chart">
    <vdr
      @dragstop="onDragStop"
      @dragging="onDrageding"
      @resizestop="onResizeStop"
      :w="widgetData.visualData.width"
      :h="widgetData.visualData.height"
      :x="widgetData.visualData.position.x"
      :y="widgetData.visualData.position.y"
      :z="widgetData.visualData.position.z"
      :grid="widgetData.visualData.grid"
      :draggable="!focusWidgetData.id"
      :resizable="!focusWidgetData.id"
      :style="{
        background: widgetData.visualData.background || '#fff'
      }"
      :class="{
        activeElement: index === activeIndex && !isSavingScreenhot,
        hideElement:
          widgetData.id !== focusWidgetData.id && focusWidgetData.id !== ''
      }"
    >
      <widget :data="widgetData"></widget>
      <div class="toolbar-box" v-show="!isSavingScreenhot">
        <chart-toolbar :data.sync="widgetData" :index="index" />
      </div>
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

import Page from "@/types/EditorPage";
import ChartToolbar from "@/layout/widgetToolBar/CommonToolbar.vue";
import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/config/StoryBuilder";
import { StoryWidget, widgetConfig } from "@/types/StoryWidget";
import { StoryPage } from "@/types/Story";
import Widget from "@/components/Widget.vue";
import { CommonStore } from "@/store/modules-model";

@Component({
  components: {
    vdr,
    Widget,
    ChartToolbar
  }
})
export default class ResizableElement extends Vue {
  /**
   * 每个可调整元素的数据和所在下标
   */
  @Prop()
  item!: StoryWidget<any>;

  @Prop()
  index!: number;

  // 处于聚焦状态
  @CommonStore.State("focusDashboard")
  focusWidgetData!: StoryWidget<any>;

  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 设置选中元素的层级
  @CommonStore.Mutation("setDashboardIndex")
  setActiveIndex!: Function;

  // 正在截图标志
  @CommonStore.State("isSavingScreenhot")
  isSavingScreenhot!: boolean;

  get widgetData(): StoryWidget<any> {
    return this.item;
  }

  set widgetData(widgetData: StoryWidget<any>) {
    this.$emit("update:item", widgetData);
  }

  // 是否显示详细工具栏
  isShowDetail = false;

  /**
   * 获取偏移位置
   * 拖拽结束
   */
  onDragStop(x: number, y: number): void {
    // 防止出现非当前下标的元素被操作的问题
    this.setActiveIndex(this.index);
  }

  /**
   * 拖拽进行时
   */
  onDrageding(x: number, y: number) {
    this.setPosition(x, y);
  }

  /**
   * 切换悬浮工具栏隐藏状态
   */
  hideDetailBar(hide: boolean): void {
    this.isShowDetail = !hide;
  }

  /**
   * 调整大小
   * 调整结束
   */
  onResizeStop(x: number, y: number, width: number, height: number): void {
    if (this.activeIndex === -1) return;
    // 防止出现非当前下标的元素被操作的问题
    this.setActiveIndex(this.index);
    this.setPosition(x, y);
    this.setSize(width, height);
    this.hideDetailBar(true);
  }

  /**
   * 设置数据的坐标
   */
  setPosition(x: number, y: number): void {
    this.widgetData.visualData.position.x = x;
    this.widgetData.visualData.position.y = y;
  }

  /**
   * 设置数据的尺寸
   */
  setSize(width: number, height: number): void {
    this.widgetData.visualData.width = width;
    this.widgetData.visualData.height = height;
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
