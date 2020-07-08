<template>
  <transition
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutRight"
  >
    <aside class="chart-menu" v-if="menuVisible" v-cloak>
      <!-- 图表菜单 -->
      <floating-menu title="图表" class="chart-menu-box">
        <!-- 菜单Content -->
        <el-tabs v-model="currentTab">
          <el-tab-pane label="数据绑定" name="data">
            <!-- 数据绑定 -->
            <data-menu v-cloak />
          </el-tab-pane>

          <el-tab-pane label="属性设置" name="preference">
            <!-- 属性设置 -->
            <style-menu v-cloak />
          </el-tab-pane>

          <el-tab-pane label="数据交互" name="interactive">
            <!-- 数据交互 -->
            <div style="padding: 10px; background: #fff;">
              <el-alert
                type="info"
                title="待开发"
                description="该模块待开发，暂不可用"
                show-icon
                v-cloak
                :closable="false"
              >
              </el-alert>
            </div>
          </el-tab-pane>

          <el-tab-pane label="高级" name="advanced">
            <!-- 高级 -->
            <advance-menu />
          </el-tab-pane>
        </el-tabs>
      </floating-menu>

      <!-- 数据模型 -->
      <model-menu class="model-menu-box" />
    </aside>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Watch, Provide } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { boxCardBodyStyle } from "@/config/CommonOptions";
import { AxiosRequest } from "@/api/AxiosRequest";

// 左侧菜单
import FloatingMenu from "@/components/FloatingMenu.vue";
import DataMenu from "./sub-menu/DataMenu.vue";
import StyleMenu from "./sub-menu/StyleMenu.vue";
import AdvanceMenu from "./sub-menu/AdvanceMenu.vue";

// 右侧菜单
import ModelMenu from "./sub-menu/ModelMenu.vue";

import UIUtil, { MessageType, ConfirmType } from "@/util/UIUtil";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import DashboardUtil from "@/util/DashboardUtil";
import FieldDTO from "glaway-bi-model/params/FieldDTO";
import UUID from "@/util/UUID";
import WhereDTO, { WhereColumnDTO } from "glaway-bi-model/params/WhereDTO";

@Component({
  components: {
    // 左侧菜单
    FloatingMenu,
    DataMenu,
    StyleMenu,
    AdvanceMenu,

    // 右侧菜单
    ModelMenu
  }
})
export default class ChartMenu extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  // 菜单是否可见
  @EditorStore.State("menuVisible")
  menuVisible!: boolean;

  // 加载图表选项
  @EditorStore.Action("loadOptions")
  loadOptions!: Function;

  // 卡片body样式
  @Provide("boxCardBodyStyle")
  boxCardBodyStyle = boxCardBodyStyle;

  @Provide("boxCardShadow")
  boxCardShadow = "never";

  // 表单标签宽度
  @Provide("elFormLabelWidth")
  elFormLabelWidth = "100px";

  // 当前标签页
  currentTab = "data";

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

<style scoped lang="scss">
@import "@/assets/custom-ui.scss";

$menuTotalWidth: 100%;

$chartsMenuWidth: 58%;
$modelMenuWidth: 42%;

// 颜色定义
$chartsMenuBgc: #e9e9e9;
$backgroundColor: #f9f9f9;
[v-cloak] {
  display: none !important;
}

.chart-menu {
  position: absolute;
  height: 100%;
  right: 0;
  width: $menuTotalWidth;
  display: flex;
  background-color: $backgroundColor;
  overflow: hidden;

  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.3);

  // 动画调速
  animation-duration: 0.3s;

  /**
     * 菜单宽高设置
     */
  .chart-menu-box {
    width: $chartsMenuWidth;

    .el-tabs {
      height: 100%;
    }
    ::v-deep {
      /**
       * 滚动条
       */
      .el-tabs__item {
        padding: 0 10px;
      }
      .el-tabs__content {
        height: calc(100% - 40px);
        overflow: auto;
        .el-card {
          .el-switch__label {
            color: #666666;
          }
        }
      }
      .menu-content {
        overflow: hidden;
      }
      .el-form-item {
        &:last-child {
          margin-bottom: 10px;
        }
      }
    }

    // 背景色
    .el-tab-pane {
      background-color: $chartsMenuBgc;
    }
  }

  .model-menu-box {
    width: $modelMenuWidth;
  }
}
</style>
