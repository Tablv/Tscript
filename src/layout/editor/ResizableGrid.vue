<template>
  <div
    class="grid-container clearfix"
    id="gridContainer"
    @dragover="dodragover"
    @drop="drop"
  >
    <div class="bg-box" :style="canvasStyle" id="bgBox" ref="bgBox">
      <div
        :class="{
          'grid-box': true,
          'grid-box-backgroud': !isSavingScreenhot && setting.background.show
        }"
        id="gridBox"
        :setId="dashboardSetId"
      >
        <transition-group name="fade-in-linear">
          <template v-for="(item, index) in dashboards">
            <resizable-chart
              v-if="item.echarts"
              :key="item.id"
              :item.sync="item"
              :index="index"
              @click.native.stop="innerClick(index)"
              @mousedown.native.stop="setChartZIndex(index)"
            />
            <resizable-text
              v-if="!item.echarts"
              :item.sync="item"
              :key="item.id"
              :index="index"
              @click.native.stop="innerClick(index)"
              @mousedown.native.stop="setChartZIndex(index)"
            />
          </template>
        </transition-group>
        <vdr
          v-show="isShowshadow"
          v-bind="bgStyle"
          class="bg-model-style"
        ></vdr>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";

import vdr from "vue-draggable-resizable-gorkys";
import ResizableChart from "@/layout/editor/ResizableChart.vue";
import ResizableText from "@/layout/editor/ResizableText.vue";
import { ShortcutType } from "glaway-bi-model/enums/ShortcutType";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { CommonStore, EditorStore } from "@/store/modules-model";
import DashboardSet from "glaway-bi-model/view/DashboardSet";
import Draggable from "glaway-bi-model/view/Draggable";
import DashboardUtil from "@/util/DashboardUtil";
import { generalDataTemplate } from "glaway-bi-component/src/config/DefaultTemplate";
import ObjectUtil from "@/util/ObjectUtil";

@Component({
  components: {
    ResizableChart,
    ResizableText,
    vdr
  }
})
export default class ResizableGrid extends Vue {
  /**
   * CommonStore
   */
  // 创建仪表盘
  @CommonStore.Mutation("createDashboard")
  createDashboard!: Function;

  // 图表数据数组
  @CommonStore.State("dashboards")
  dashboards!: Array<Dashboard>;

  @CommonStore.State("dashboardSet")
  dashboardSet!: DashboardSet;

  @CommonStore.State("dashboardSetId")
  dashboardSetId!: string;

  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 正在保存截图
  @CommonStore.State("isSavingScreenhot")
  isSavingScreenhot!: number;

  // 当前的下标的层级
  @CommonStore.Mutation("setDashboardChartZIndex")
  setChartZIndex!: Function;

  // 当前下标的 Setter
  @CommonStore.Mutation("setDashboardIndex")
  setActiveIndex!: Function;

  // 仪表阴影标志
  @CommonStore.State("isShowshadow")
  isShowshadow!: boolean;

  // 仪表阴影风格
  @CommonStore.State("shadowStyle")
  shadowStyle!: Draggable;

  // 仪表阴影风格
  @CommonStore.Mutation("setShadowStyle")
  setShadowStyle!: Function;

  @CommonStore.State("scrollStyle")
  scrollStyle!: {
    scrollLeft: number;
    scrollTop: number;
  };

  // 控制阴影
  @CommonStore.Mutation("setShowshadow")
  setShowshadow!: Function;

  /**
   * EditorStore
   */

  // 设置菜单是否可见
  @EditorStore.Mutation("setMenuVisible")
  setMenuVisible!: Function;

  // 设置当前快捷键
  @EditorStore.Mutation("setActiveShortcutType")
  setActiveShortcutType!: Function;

  get setting(): any {
    return this.dashboardSet.canvasSetting;
  }

  /**
   * Grid 样式
   */
  canvasStyle = {};

  bgStyle: Draggable = {};

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

  dodragover(event: any) {
    event.preventDefault();
    event.stopPropagation();
    let bgBox = this.$refs.bgBox as HTMLDivElement;
    const bgBoxLeft = parseInt(bgBox.style.left) || 0,
      bgBoxTop = parseInt(bgBox.style.top) || 0;
    this.bgStyle.x =
      event.pageX - 84 - 250 - bgBoxLeft + this.scrollStyle.scrollLeft;
    this.bgStyle.y =
      event.pageY - 60 - 200 - bgBoxTop + this.scrollStyle.scrollTop;
  }

  drop(event: any) {
    event.preventDefault();
    const chartType = event.dataTransfer.getData("chartType");
    if (!chartType) {
      this.setShowshadow(false);
      return;
    }
  }

  @Watch("isShowshadow")
  changeShowShadow() {
    if (!this.isShowshadow) {
      this.setShadowStyle(this.bgStyle);
    }
  }

  @Watch("shadowStyle", {
    deep: true
  })
  changeShadowStyle() {
    if (!this.isShowshadow) return;
    const template = ObjectUtil.copy(generalDataTemplate);
    this.bgStyle = this.shadowStyle;
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
}
.grid-box-backgroud {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 10px 10px, 10px 10px;
}

.bg-box {
  position: relative;
}
.bg-model-style {
  background: #7e7a7a7a;
  position: absolute;
  z-index: 1000;
}
</style>
