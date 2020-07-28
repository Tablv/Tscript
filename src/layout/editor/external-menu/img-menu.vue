<template>
  <transition
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutRight"
  >
    <aside class="text-menu" v-if="menuVisible" v-cloak>
      <!-- 文本框菜单 -->
      <el-container>
        <el-header class="menu-header" height="40px">
          <span>文本框设置</span>
        </el-header>
        <el-main class="tabs-box">
          123
        </el-main>
      </el-container>
    </aside>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Watch, Provide } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { boxCardBodyStyle } from "@/config/CommonOptions";
import { AxiosRequest } from "@/api/AxiosRequest";

import UIUtil, { MessageType, ConfirmType } from "@/util/UIUtil";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import DashboardUtil from "@/util/DashboardUtil";
import FieldDTO from "glaway-bi-model/params/FieldDTO";
import UUID from "@/util/UUID";
import WhereDTO, { WhereColumnDTO } from "glaway-bi-model/params/WhereDTO";

@Component({
  components: {
  }
})
export default class ChartMenu extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  // 菜单是否可见
  @EditorStore.State("menuVisible")
  menuVisible!: boolean;

  // 加载文本框选项
  @EditorStore.Action("loadOptions")
  loadOptions!: Function;

  // 卡片body样式
  @Provide("boxCardBodyStyle")
  boxCardBodyStyle = boxCardBodyStyle;

  @Provide("boxCardShadow")
  boxCardShadow = "never";

  // 表单标签宽度
  @Provide("elFormLabelWidth")
  elFormLabelWidth = "110px";

  /**
   * 监听事件
   */
  @Watch("menuVisible")
  onMenuVisibleChange() {
    if (!this.menuVisible) return;
    // 加载样式配置
    this.loadOptions().catch((err: Error) => {
      UIUtil.showErrorMessage("加载属性设置失败");
    });
  }
}
</script>

<style lang="scss">
@import "@/assets/custom-ui.scss";

// 颜色定义
$chartsMenuBgc: #e9e9e9;
$backgroundColor: #f9f9f9;

[v-cloak] {
  display: none !important;
}

.text-menu {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: $backgroundColor;
  overflow: hidden;

  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.3);

  // 动画调速
  animation-duration: 0.3s;

  .menu-header {
    line-height: 40px;
    text-align: center;
  }
}
</style>
