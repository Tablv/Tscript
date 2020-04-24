<template>
  <div class="chart-toolbar common-toolbar">
    <tool-button
      icon-class="fa fa-cogs"
      title="菜单"
      placement="top"
      @click="showMenu"
    />

    <tool-button
      icon-class="fa fa-arrows-alt"
      title="聚焦"
      placement="top"
      @click="showMenu"
    />

    <tool-button icon-class="fa fa-camera" title="快照" placement="top" />

    <el-popover
      v-model="isShowDetail"
      placement="right-start"
      width="32"
      trigger="click"
      @show="handleShow"
      @hide="handleHide"
      popper-class="detail-toolbar-popper"
      :close-delay="0"
    >
      <detail-toolbar :dashboard.sync="thisDashboard" />

      <tool-button
        icon-class="fa fa-ellipsis-v"
        title="更多"
        placement="top"
        slot="reference"
      />
    </el-popover>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Watch, Prop } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ToolButton from "@/components/ToolButton.vue";
import DetailToolbar from "./DetailToolbar.vue";

@Component({
  components: {
    ToolButton,
    DetailToolbar
  }
})
export default class CommonToolbar extends Vue {
  /**
   * 更多菜单
   */
  isShowDetail: boolean = false;

  // 菜单打开window添加click监听
  handleShow() {
    window.addEventListener("click", this.handlePopver, true);
  }
  // 菜单关闭window移除click监听
  handleHide() {
    window.removeEventListener("click", this.handlePopver, true);
  }

  // 更多菜单的开关关闭
  handlePopver(event: any) {
    event.stopPropagation();
    this.isShowDetail = !this.isShowDetail;
  }

  /**
   * 仪表盘数据
   */
  @Prop()
  dashboard!: Dashboard;

  get thisDashboard() {
    return this.dashboard;
  }

  set thisDashboard(dashboard: Dashboard) {
    this.$emit("update:dashboard", dashboard);
  }

  /**
   * 配置菜单部分
   */
  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 菜单是否可见
  @EditorStore.State("menuVisible")
  menuVisible!: boolean;

  // 设置菜单是否可见
  @EditorStore.Mutation("setMenuVisible")
  setMenuVisible!: Function;

  // 显示菜单
  showMenu() {
    const visible = this.activeIndex !== -1 && !this.menuVisible;
    this.setMenuVisible(visible);
  }
}
</script>

<style lang="scss">
.el-popper {
  padding: 0 !important;
  min-width: auto !important;
}

.detail-toolbar-popper {
  z-index: 2000 !important;
}
</style>

<style lang="scss">
.common-toolbar {
  display: flex;
  flex-flow: row nowrap;

  // .tool-btn {
  //   margin: 0 2px;
  //   padding: 4px;
  //   background: transparent;
  //   border: 0;
  //   cursor: pointer;

  //   background: #fff;
  //   border-radius: 50%;

  //   width: 28px;
  //   height: 28px;

  //   &:hover {
  //     background: rgba(0, 0, 0, 0.06);
  //   }

  //   &:active {
  //     background: rgba(0, 0, 0, 0.1);
  //   }

  //   .fa {
  //     color: map-get($colors, "chart");
  //   }
  // }
}
</style>
