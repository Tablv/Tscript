<template>
  <div class="grid-container clearfix" id="gridContainer">
    <div class="bg-box" :style="canvasStyle" id="bgBox" ref="bgBox">
      <div class="grid-box" id="gridBox">
        <transition-group name="fade-in-linear">
          <resizable-chart
            v-for="(item, index) in dashboards"
            :key="item.id"
            :item.sync="item"
            :index="index"
            @click.native.stop="innerClick(index)"
            @mousedown.native.stop="setChartZIndex(index)"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";

import ResizableChart from "@/layout/editor/ResizableChart.vue";
import { ShortcutType } from "glaway-bi-model/enums/ShortcutType";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { CommonStore, EditorStore } from "@/store/modules-model";
import DashboardSet from "glaway-bi-model/view/DashboardSet";
import DashboardUtil from "@/util/DashboardUtil";

@Component({
  components: {
    ResizableChart
  }
})
export default class ResizableGrid extends Vue {
  /**
   * CommonStore
   */
  // 图表数据数组
  @CommonStore.State("dashboards")
  dashboards!: Array<Dashboard>;

  @CommonStore.State("dashboardSet")
  dashboardSet!: DashboardSet;

  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 当前的下标的层级
  @CommonStore.Mutation("setDashboardChartZIndex")
  setChartZIndex!: Function;

  // 当前下标的 Setter
  @CommonStore.Mutation("setDashboardIndex")
  setActiveIndex!: Function;

  /**
   * EditorStore
   */

  // 设置菜单是否可见
  @EditorStore.Mutation("setMenuVisible")
  setMenuVisible!: Function;

  // 设置当前快捷键
  @EditorStore.Mutation("setActiveShortcutType")
  setActiveShortcutType!: Function;

  /**
   * Grid 样式
   */
  canvasStyle = {};

  mounted() {
    let gridContainer = document.querySelector(
        "#gridContainer"
      ) as HTMLDivElement,
      canvasDOM = document.querySelector("#bgBox") as HTMLDivElement,
      domIdwhiteList = ["gridContainer", "bgBox", "gridBox"];

    // 调整画布尺寸
    this.resizeCanvas(canvasDOM, this.dashboardSet);

    // 绑定DOM拖拽
    this.bindDragCanvas(gridContainer, canvasDOM, 50, domIdwhiteList);
  }

  // 下标改变，隐藏右侧菜单
  @Watch("activeIndex")
  changeMenuVisible(): void {
    // 隐藏菜单
    this.setMenuVisible(false);
  }

  @Watch("dashboardSet", {
    deep: true
  })
  onDashboardSetUpdate(): void {
    let bgBox = this.$refs.bgBox as HTMLDivElement,
      screenZoom = this.dashboardSet.tempParams.zoom as number;

    bgBox.style.zoom = screenZoom.toString();

    // 调整画布尺寸
    this.resizeCanvas(bgBox, this.dashboardSet);

    // 设置画布样式
    this.setCanvasStyle(this.dashboardSet);
  }

  // 调整画布尺寸
  resizeCanvas(canvasDOM: HTMLDivElement, dashboardSet: DashboardSet): void {
    canvasDOM.style.width = `${dashboardSet.widthRatio *
      dashboardSet.tempParams.ratio}px`;
    canvasDOM.style.height = `${dashboardSet.heightRatio *
      dashboardSet.tempParams.ratio}px`;
  }

  // 设置画布样式
  setCanvasStyle(dashboardSet: DashboardSet): void {
    this.canvasStyle = DashboardUtil.getDashboardSetStyle(dashboardSet);
  }

  // 绑定拖动画布方法
  bindDragCanvas(
    gridContainer: HTMLDivElement,
    canvasDOM: HTMLDivElement,
    offset: number,
    domIdwhiteList: Array<string>
  ): void {
    gridContainer.onmousedown = e => {
      let target = e.target as HTMLDivElement;

      // 点击非允许拖拽的元素
      if (domIdwhiteList.indexOf(target.id) === -1) {
        // 点击元素, 跳过
        return;
      }

      // 设置拖拽的盒子为画布
      target = canvasDOM;
      this.outerClick();

      // 初始化位置
      canvasDOM.style.left =
        canvasDOM.style.left === "" ? "0px" : canvasDOM.style.left;
      canvasDOM.style.top =
        canvasDOM.style.top === "" ? "0px" : canvasDOM.style.top;

      let disX = e.clientX - target.offsetLeft + offset,
        disY = e.clientY - target.offsetTop + offset;

      // 鼠标移动, 监听设置拖拽位置
      document.onmousemove = e1 => {
        let left = e1.clientX - disX,
          top = e1.clientY - disY;

        target.style.left = left + "px";
        target.style.top = top + "px";
      };

      // 鼠标抬起, 清空监听
      document.onmouseup = e => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  // 激活当前区域，用于切换全局、局部快捷键
  activeArea(type: ShortcutType): void {
    // 设置快捷键
    this.setActiveShortcutType(type);
  }

  // 拖拽画布的时
  outerClick(): void {
    this.activeArea(ShortcutType.global);
    this.setActiveIndex(-1);
  }

  // 点击事件监听函数
  innerClick(index: number): void {
    this.activeArea(ShortcutType.grid);
    // 设置当前激活的图表下标
    // this.setActiveIndex(index);
  }
}
</script>

<style lang="scss" scoped>
.grid-container {
  padding: 50px;
  cursor: grab;
}

.grid-box {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 10px 10px, 10px 10px;
}

.bg-box {
  position: relative;
}
</style>
