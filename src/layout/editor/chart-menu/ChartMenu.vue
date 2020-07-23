<template>
  <transition
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutRight"
  >
    <aside class="chart-menu" v-if="menuVisible" v-cloak>
      <!-- 图表菜单 -->
      <el-container>
        <el-header class="menu-header" height="40px">
          <span>图表设置</span>
        </el-header>
        <el-main class="tabs-box" style="padding: 0">
          <!-- 菜单标签页 -->
          <el-tabs v-model="currentTab">
            <el-tab-pane class="data-binding-pane" label="数据绑定" name="data">
              <el-container class="data-binding-container">
                <el-main>
                  <!-- 数据绑定 -->
                  <data-menu class="chart-menu-box" v-cloak />

                  <el-button
                    class="toggle-model-button"
                    type="text"
                    :icon="hideModel ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"
                    @click="hideModel = !hideModel"
                  />
                </el-main>

                <el-aside :width="hideModel ? '0' : '160px'">
                  <!-- 数据模型 -->
                  <model-menu class="model-menu-box" />
                </el-aside>
              </el-container>
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
    FloatingMenu,
    DataMenu,
    ModelMenu,
    StyleMenu,
    AdvanceMenu
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
  elFormLabelWidth = "110px";

  // 当前标签页
  currentTab = "data";

  // 是否隐藏
  hideModel = false;

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

.chart-menu {
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

  /**
   * 菜单宽高设置
   */
  .tabs-box {
    user-select: none;

    .el-tabs {
      height: 100%;

      .el-tabs__header {
        margin-bottom: 0;

        .el-tabs__item {
          padding: 0 10px;
        }
      }

      .el-tabs__content {
        height: calc(100% - 40px);
        overflow: auto;
        
        // 背景色
        .el-tab-pane {
          background-color: $chartsMenuBgc;
        }
      }

      .data-binding-pane {
        display: flex;
        height: 100%;

        .data-binding-container {
          // 数据绑定
          .el-form.el-form--label-top {
            .el-form-item__label {
              padding-left: 20px;
              padding-bottom: 4px;
            }
          }
          
          .chart-menu-box,
          .model-menu-box {
            height: 100%;
            overflow: auto;
          }

          > .el-main {
            padding: 0;
            position: relative;
            overflow: hidden;
            
            .toggle-model-button {
              position: absolute;
            }
          }

          > .el-aside {
            transition: width .3s;
            overflow: hidden;

            > * {
              min-width: 160px;
            }
          }
        }
      }
    }

    .el-form {
      * {
        outline: none;
      }

      .el-form-item__label {
        font-size: 13px;
      }

      .el-form-item {
        &:last-child {
          margin-bottom: 10px;
        }
      }
    }

    .model-menu-box {
      height: 100%;
      
      .el-form-item__label {
        padding-left: 20px;
      }
      
      .el-form-item {
        margin-bottom: 0;

        .el-form-item__content {
          float: right;
          margin-right: 10px;
        }
      }
    }


    .el-card {
      background-color: $backgroundColor;

      .el-card__header {
        padding: 10px 16px;
        font-size: 14px;
      }

      .el-switch__label {
        color: #666666;
      }
    }
  }
}
</style>
