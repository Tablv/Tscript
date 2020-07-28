<template>
  <div class="home">
    <div class="header el-header">
      <span class="title-text">仪表盘{{ editorTitle }}</span>
      <div class="button-group">
        <el-button
          type="text"
          :icon="
            isFullScreen
              ? 'fa fa-compress-arrows-alt'
              : 'fa fa-expand-arrows-alt'
          "
          :title="isFullScreen ? '退出全屏' : '进入全屏'"
          @click="toggleFullScreen"
        ></el-button>
        <!-- 
        <el-button type="text" icon="fa fa-share-square" /> -->
      </div>
    </div>
    <div class="left" @click="activeArea('global')">
      <aside-toolbar />
    </div>

    <div class="center">
      <grid-canvas />
    </div>

    <div class="right hidden" ref="rightMenu" @click="activeArea('global')">
      <aside-menu />
    </div>

    <div class="bottom">
      <option-bar />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Emit } from "vue-property-decorator";
import screenfull from "screenfull";
import AsideToolbar from "@/layout/editor/AsideToolbar.vue";
import AsideMenu from "@/layout/editor/AsideMenu.vue";
import GridCanvas from "@/layout/editor/GridCanvas.vue";
import OptionBar from "@/layout/editor/OptionBar.vue";
import { ShortcutType } from "glaway-bi-model/enums/ShortcutType";
import UIUtil, { MessageType } from "@/util/UIUtil";
import ObjectUtil from "@/util/ObjectUtil";
import { CommonStore, EditorStore } from "@/store/modules-model";
import RequestUtil from "@/util/RequestUtil";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import DashboardSet from "glaway-bi-model/view/DashboardSet";

@Component({
  components: {
    AsideToolbar,
    AsideMenu,
    OptionBar,
    GridCanvas
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
  @CommonStore.Action("loadDashboards")
  loadDashboards!: Function;

  // 加载仪表盘集设置
  @CommonStore.Action("loadDashboardSet")
  loadDashboardSet!: Function;

  // 当前选中仪表盘下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

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

  isFullScreen: boolean = false;

  editorTitle: string = "";

  destroyed() {
    this.removeKeymap();
  }

  /**
   * 创建时执行方法
   */
  created(): void {
    // 启动时绑定 Keymap
    this.bindKeymap();

    // 加载数据
    const { dashboardSetId, debuggerMode } = RequestUtil.getRequestParams();
    // 加载数据
    this.loadData(dashboardSetId);

    const dashboardFile = sessionStorage.getItem(dashboardSetId);
    if (dashboardFile) {
      const dashboardName = JSON.parse(dashboardFile).name;
      this.editorTitle = ": " + dashboardName;
      document.title = "仪表盘-" + dashboardName;
    }

    if (screenfull.isEnabled) {
      screenfull.on("change", () => {
        this.isFullScreen = (screenfull as any).isFullscreen;
      });
    }
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

  /**
   * 加载数据
   * 并对加载失败的结果进行处理
   */
  loadData(setId: string): void {
    let loadingInstance = UIUtil.showLoading();
    this.setDashboardSetId(setId);

    this.loadDashboards()
      .then(() => {
        // 关闭loading
        UIUtil.closeLoading(loadingInstance);
      })
      .catch((err: Error) => {
        console.error(err);
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
    // this.loadDashboardSet();
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
    addEventListener("keyup", this.doHandleKeyEvent);
  }

  removeKeymap(): void {
    removeEventListener("keyup", this.doHandleKeyEvent);
  }

  doHandleKeyEvent(event: KeyboardEvent): void {
    // 绑定删除
    const key = event.keyCode;
    if (event.keyCode === 46) {
      this.keymapHandler();
    }
    // 绑定其他事件
  }

  keymapHandler(): void {
    let win: any = window;

    // 判断是否为 网格局部快捷键
    if (this.activeShortcutType === ShortcutType.grid) {
      this.deleteElement(this.activeIndex);
    }
  }

  toggleFullScreen() {
    //不支持screenfull全屏，则打印错误
    if (!screenfull.isEnabled) {
      console.error("unEnabled");
      return;
    }
    screenfull.toggle();
  }
}
</script>

<style lang="scss">
body {
  ::-webkit-scrollbar {
    width: 6px;
    margin-left: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #afafaf;
  }
}
</style>

<style lang="scss" scoped>
$toolbarWidth: 84px;
$floatMenuWidth: 400px;
$bottomHeight: 50px;
$backgroundColor: #f1f3f6;
$borderColor: #e6e6e6;

.hidden {
  visibility: hidden;
}

.home {
  width: 100%;
  height: 100%;
}

.left {
  background-color: $backgroundColor;
  border-right: 1px solid $borderColor;
  width: $toolbarWidth;
  box-sizing: border-box;
  text-align: center;
  float: left;
  z-index: 1000;

  &:after {
    clear: both;
  }
}

.left,
.center {
  height: 100%;
}

.right {
  height: calc(100% - 60px);
}

.center {
  display: inline-block;
  position: absolute;
  background-color: $backgroundColor;
  width: calc(100vw - #{$toolbarWidth});
  overflow: auto;
  @include select(none);
  @include transition(all 0.2s);
}

.right {
  position: absolute;
  right: 0;
  width: $floatMenuWidth;
  z-index: 6000;

  &:after {
    clear: both;
  }
}

.bottom {
  position: absolute;
  left: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 7000;
}
.header {
  position: relative;
  height: 60px;
  line-height: 60px;
  z-index: 7000;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  .title-text {
    color: #666;
  }
  .button-group {
    position: absolute;
    right: 20px;
    top: 0;
    .el-button {
      font-size: 16px;
      width: 32px;
      margin-left: 8px;
      // color: #666;
    }
  }
}
</style>
