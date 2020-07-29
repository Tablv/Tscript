<template>
  <transition
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutRight"
  >
    <aside class="external-menu" v-if="menuVisible && currentWidget">
      <!-- 文本框菜单 -->
      <el-container>
        <el-header class="menu-header" height="50px">
          <span>文本属性设置</span>
        </el-header>
        <el-main class="cards-box">
          <!-- 外观样式 -->
          <appearance-style />

          <!-- 特定配置 -->
          <specific />
        </el-main>
      </el-container>
    </aside>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Watch, Provide, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { boxCardBodyStyle } from "@/config/CommonOptions";

import { DashWidget, widgetConfig } from "@/types/DashWidget";
import { WidgetBuilder } from "@/config/WidgetBuilder";

import AppearanceStyle from "./menu-card/AppearanceStyle.vue";
import Specific from "./Specific.vue";

@Component({
  components: {
    AppearanceStyle,
    Specific
  }
})
export default class ExternalMenu extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentWidget!: DashWidget<any>;

  // 菜单是否可见
  @EditorStore.State("menuVisible")
  menuVisible!: boolean;

  // 卡片body样式
  @Provide("boxCardBodyStyle")
  boxCardBodyStyle = boxCardBodyStyle;

  @Provide("boxCardShadow")
  boxCardShadow = "never";

  // 表单标签宽度
  @Provide("elFormLabelWidth")
  elFormLabelWidth = "110px";
}
</script>

<style lang="scss">
@import "@/assets/custom-ui.scss";

// 颜色定义
$chartsMenuBgc: #e9e9e9;
$backgroundColor: #f9f9f9;

.external-menu {
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
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid #dcdfe6;
  }

  .cards-box {
    background-color: #e9e9e9;
    padding: 10px;

    .el-card {
      border-radius: 4px;

      .el-card__header {
        padding: 10px 24px;
      }

      &:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }

    .detail-card-wrap {
      .detail-card {
        padding-right: 40px;
      }
    }
  }
}
</style>
