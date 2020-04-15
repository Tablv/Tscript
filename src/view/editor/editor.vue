<template>
  <div class="home">
    <div class="left" @click="activeArea('global')">
      <tool-bar />
    </div>

    <div class="center">
      <resizable-grid />
    </div>

    <div class="right hidden" ref="rightMenu" @click="activeArea('global')">
      <draggable-menu />
    </div>

    <div class="bottom">
      <option-bar />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import ToolBar from "@/layout/editor/ToolBar.vue";
import DraggableMenu from "@/layout/editor/chart-menu/ChartMenu.vue";
import ResizableGrid from "@/layout/editor/ResizableGrid.vue";
import OptionBar from "@/layout/editor/OptionBar.vue";
import { ShortcutType } from "@/enums/ShortcutType";
import UIUtil, { MessageType } from "@/util/UIUtil";
import ObjectUtil from "@/util/ObjectUtil";
import { CommonStore, EditorStore } from "@/store/modules-model";
import RequestUtil from "@/util/RequestUtil";

@Component({
  components: {
    ToolBar,
    DraggableMenu,
    ResizableGrid,
    OptionBar
  }
})
export default class Editor extends Vue {
  /**
   * CommonStore
   */

  // 仪表盘集ID
  @CommonStore.State("dashboardSetId")
  setId!: string;

  // 当前仪表盘集ID
  @CommonStore.Mutation("setDashboardSetId")
  setDashboardSetId!: Function;

  // 删除仪表盘
  @CommonStore.Mutation("deleteDashboard")
  deleteDashboard!: Function;

  // 加载仪表盘集
  @CommonStore.Action("loadDashboardSet")
  loadDashboardSet!: Function;

  // 加载仪表盘
  @CommonStore.Action("loadDashboards")
  loadDashboards!: Function;

  // 当前选中仪表盘下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  /**
   * EditorStore
   */

  // 菜单是否可见
  @EditorStore.State("menuVisible")
  menuVisible!: boolean;

  /**
   * 快捷键相关功能
   */
  @EditorStore.State("activeShortcutType")
  activeShortcutType!: ShortcutType;

  @EditorStore.Mutation("setActiveShortcutType")
  setActiveShortcutType!: Function;

  /**
   * 创建时执行方法
   */
  created(): void {
    // 启动时绑定 Keymap
    this.bindKeymap();

    // 加载数据
    let paramMap = RequestUtil.getRequestParams(),
      setId = paramMap.get("dashboardSetId") || "",
      debuggerMode = paramMap.get("debuggerMode") === "true";

    if (debuggerMode) {
      // 不加载数据
      return;
    }

    if (ObjectUtil.isEmptyString(setId) && !debuggerMode) {
      UIUtil.showLoading({
        text: "仪表盘参数错误",
        spinner: "el-icon-error"
      });
      UIUtil.showMessage(
        "仪表盘参数错误，系统无法正常加载数据",
        MessageType.error,
        false,
        0
      );
      return;
    }

    // 加载数据
    this.loadData(setId);
  }

  @Watch("menuVisible")
  onVisibleUpdate(): void {
    let menu = this.$refs.rightMenu as HTMLDivElement;

    if (this.menuVisible) {
      menu.classList.remove("hidden");
    } else {
      setTimeout(() => {
        if (!this.menuVisible) {
          menu.classList.add("hidden");
        }
      }, 500);
    }
  }

  loadData(setId: string): void {
    let loadingInstance = UIUtil.showLoading();

    this.setDashboardSetId(setId);

    Promise.all([this.loadDashboardSet(), this.loadDashboards()])
      .then(resArr => {
        UIUtil.closeLoading(loadingInstance);
      })
      .catch(errArr => {
        console.error(errArr);
        UIUtil.closeLoading(loadingInstance);
        UIUtil.showLoading({
          text: "加载仪表盘出错",
          spinner: "el-icon-error"
        });
        UIUtil.showMessage(
          "加载仪表盘出错，请稍后重试",
          MessageType.error,
          false,
          0
        );
      });
  }

  // 激活当前区域，用于切换全局、局部快捷键
  activeArea(type: ShortcutType): void {
    this.setActiveShortcutType(type);
  }

  // 删除指定元素
  deleteElement(index: number): void {
    if (index !== -1) {
      this.deleteDashboard(index);
    }
  }

  // 绑定键盘快捷键映射
  bindKeymap(): void {
    // 按键回弹时 执行方法
    document.onkeyup = (e: Event) => {
      this.keymapHandler(e);
    };
  }

  keymapHandler(e: Event): void {
    let win: any = window;

    // 判断是否为 网格局部快捷键
    if (this.activeShortcutType === ShortcutType.grid) {
      // 获取 keyCode
      let key = win.event.keyCode;
      // Delete 键删除图表元素，Backspace (key === 8)
      if (key === 46) {
        this.deleteElement(this.activeIndex);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$toolbarWidth: 60px;
$floatMenuWidth: 560px;
$bottomHeight: 50px;

.hidden {
  visibility: hidden;
}

.home {
  width: 100%;
  height: 100%;
}

.left {
  background-color: #666;
  border-right: 1px solid #aaa;
  width: $toolbarWidth;
  box-sizing: border-box;
  text-align: center;
  float: left;
  z-index: 1000;

  &:after {
    clear: both;
  }
}

.left {
  height: 100%;
}

.center,
.right {
  height: calc(100% - #{$bottomHeight});
}

.center {
  background-color: #f5f5f5;
  display: inline-block;
  position: absolute;
  width: calc(100vw - #{$toolbarWidth});
  overflow: auto;
  @include select(none);
  @include transition(all 0.2s);
}

.right {
  position: absolute;
  right: 0;
  width: $floatMenuWidth;
  overflow: hidden;
  z-index: 6000;

  &:after {
    clear: both;
  }
}

.bottom {
  background-color: #eaeaea;
  border-top: 1px solid #dcdcdc;
  box-sizing: border-box;
  position: absolute;
  left: $toolbarWidth;
  right: 0;
  bottom: 0;
  width: calc(100% - #{$toolbarWidth});
  height: $bottomHeight;
  overflow: hidden;
}
</style>