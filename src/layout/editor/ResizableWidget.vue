<template>
  <div class="resizable-widget">
    <vdr
      @dragstop="onDragStop"
      @dragging="onDragging"
      @resizestop="onResizeStop"
      :w="widgetSize.width"
      :h="widgetSize.height"
      :x="widgetSize.x"
      :y="widgetSize.y"
      :z="widgetSize.z"
      :grid="resizeGrid"
      :draggable="isDraggable"
      :resizable="isResizable"
      :class="resizableClassName"
      :style="widgetStyle"
    >
      <widget
        class="draggable-content"
        ref="widgetProxy"
        @doContextMenu="doContextMenu"
        v-bind="widgetBinding"
      />
    </vdr>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue, Provide } from "vue-property-decorator";

import widget from "./widget/index.vue";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { DashWidget } from "@/types/DashWidget";
// Vue-Draggable-Resizable
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
import { CommonStore } from "@/store/modules-model";
import DashboardSet from "glaway-bi-model/view/DashboardSet";
import { Properties } from "csstype";
import WidgetProxy from "./widget/index.vue";

@Component({
  components: {
    vdr,
    widget
  }
})
export default class ResizableElement extends Vue {
  /**
   * 每个可调整元素的数据和所在下标
   */
  @Prop()
  item!: Dashboard | DashWidget<any>;

  @Prop()
  index!: number;

  // 处于聚焦状态
  @CommonStore.State("focusDashboard")
  focusItem!: Dashboard | DashWidget<any>;

  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 正在截图标志
  @CommonStore.State("isSavingScreenhot")
  isSavingScreenhot!: number;

  // 仪表盘集配置
  @CommonStore.State("dashboardSet")
  dashboardSet!: DashboardSet;

  // 设置选中元素的层级
  @CommonStore.Mutation("setDashboardIndex")
  setActiveIndex!: Function;

  get resizeGrid(): Array<number> {
    const showBackground = this.dashboardSet.canvasSetting.background.show;
    return showBackground ? this.dashboardSet.grid : [1, 1];
  }

  get widgetSize() {
    // 聚焦模式 全屏展示
    if (this.focusItem.id === this.item.id) {
      const gridBox = document.querySelector("#gridBox") as HTMLElement;

      return {
        x: 0,
        y: 0,
        width: gridBox.offsetWidth,
        height: gridBox.offsetHeight
      };
    }
    // 普通模式
    return {
      z: this.item.visualData.position.z,
      x: this.item.visualData.position.x,
      y: this.item.visualData.position.y,
      width: this.item.visualData.width,
      height: this.item.visualData.height
    };
  }

  get resizableClassName() {
    // 聚焦时 其他组件隐藏
    const focusHidden =
      this.focusItem.id !== "" && this.item.id !== this.focusItem.id;
    // 当前组件是否活动
    const isActive = this.index === this.activeIndex && !this.isSavingScreenhot;

    return {
      active: isActive,
      hidden: focusHidden
    };
  }

  get widgetStyle() {
    let domStyle: Properties = {};
    const visualData = this.item.visualData;
    const { background, border, shadow } = visualData;

    /**
     * 背景
     */
    if (background && background.enable && background.props) {
      const { color, url, type } = background.props;
      if (type) {
        domStyle.background = `url(${url}) 0% 0% / 100% no-repeat`;
      } else {
        domStyle.background = `${color}`;
      }
    }

    /**
     * 边框
     */
    if (border && border.enable && border.props) {
      const { width, style, color, radius } = border.props;
      domStyle.border = `${width}px ${style} ${color}`;
      domStyle.borderRadius = `${radius}px`;
    }

    /**
     * 阴影
     */
    if (shadow && shadow.enable && shadow.props) {
      const { h, v, blur, spread, color } = shadow.props;
      domStyle.boxShadow = `${h}px ${v}px ${blur}px ${spread}px ${color}`;
    }

    return domStyle;
  }
  // get rightClick(): boolean {
  //   return this.rightClickMap.get(this.index) || false;
  // }

  get widgetProxy(): WidgetProxy {
    return this.$refs.widgetProxy as WidgetProxy;
  }

  get widgetBinding() {
    return {
      item: this.item,
      index: this.index
    };
  }

  get isDraggable(): boolean {
    return !this.focusItem.id;
  }

  get isResizable(): boolean {
    return !this.focusItem.id;
  }

  mounted() {
    // 恢复未选中状态
    this.setActiveIndex(-1);
  }

  /**
   * 获取偏移位置
   * 拖拽结束
   */
  onDragStop(x: number, y: number): void {
    // 防止出现非当前下标的元素被操作的问题
    this.setActiveIndex(this.index);

    this.widgetProxy.onDragStop(x, y);
  }

  /**
   * 拖拽进行时
   */
  onDragging(x: number, y: number) {
    this.setPosition(x, y);

    this.widgetProxy.onDragging(x, y);
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

    this.widgetProxy.onResizeStop(x, y, width, height);
  }

  /**
   * 设置数据的坐标
   */
  setPosition(x: number, y: number): void {
    this.item.visualData.position.x = x;
    this.item.visualData.position.y = y;
  }

  /**
   * 设置数据的尺寸
   */
  setSize(width: number, height: number): void {
    this.item.visualData.width = width;
    this.item.visualData.height = height;
  }

  doContextMenu(event: MouseEvent) {
    this.$emit("doContextMenu", event);
  }
}
</script>

<style lang="scss">
$handleColor: #09f;
$borderColor: #00a2ff;
$shadow: 0 0 6px #58bee9;
@mixin topAndLeft($top, $left) {
  margin-top: $top;
  margin-left: $left;
}
.resizable-widget {
  outline: none;

  .vdr {
    border: none;
    border: 1px solid transparent;
    transition: border 0.3s, box-shadow 0.3s, background-color 0.3s;

    // 悬停效果
    &:hover {
      box-shadow: $shadow;
    }

    // 当前激活的元素
    &.active {
      border: 1px solid $borderColor;
    }

    // 当前激活的元素
    &.hidden {
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
.gw-context-menu {
  background-color: rgba(236, 236, 236, 0.6);
  user-select: none;
  padding: 6px;
  border: 1px solid #e4e4e4;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  list-style: none;
  z-index: 3000;
  margin: 0;

  .menu-item {
    list-style: none;
    margin: 0;
    line-height: 27px;
    font-size: 13px;
    color: #4a4b50;
    border-radius: 4px;

    &:hover {
      background-color: #0d76fd;
      color: #fff;
    }
  }

  .menu-item-divider {
    height: 1px;
    background: rgba(219, 219, 219, 0.6);
    margin: 4px 6px 2px;
    backdrop-filter: blur(10px);
  }
}
</style>
