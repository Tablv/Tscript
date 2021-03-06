<template>
  <div class="chart-toolbar detail-toolbar">
    <!-- 过滤器配置 -->
    <filter-dialog
      icon-class="fa fa-filter"
      title="过滤"
      v-model="visibles.filter"
      @close="closeFilterDialog"
    />

    <!-- 排序配置 -->
    <sort-dialog
      icon-class="fa fa-sort-alpha-down"
      title="排序"
      v-model="visibles.sort"
      @close="closeSortDialog"
    />

    <!-- 排名配置 -->
    <limit-dialog
      icon-class="fa fa-sort-alpha-down"
      title="排名"
      v-model="visibles.limit"
      @close="closeLimitDialog"
    />

    <tool-button
      icon-class="fa fa-tasks"
      title="参与联动"
      :switch-value.sync="isReact"
    />

    <warn-dialog
      v-if="isWarnable"
      icon-class="fa fa-exclamation-triangle"
      title="预警设置"
      v-model="visibles.warn"
      @close="closeWarnDialog"
    />

    <type-change-view
      title="图表切换"
      :currentDashboard="currentDashboard"
      icon-class="fa fa-exchange-alt"
      v-model="visibles.typeChange"
      @close="closeTypeChangeView"
    >
    </type-change-view>

    <tool-button
      v-show="!focusDashboard.id"
      icon-class="fa fa-copy"
      title="复制"
      @click="handleCopy"
    />

    <tool-button icon-class="fa fa-trash" title="删除" @click="handleDelete" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { CommonStore } from "@/store/modules-model";
import ToolButton from "@/components/ToolButton.vue";
import FilterDialog from "./filter/main.vue";
import SortDialog from "./sort/main.vue";
import WarnDialog from "./warn/main.vue";
import LimitDialog from "./limit/main.vue";
import TypeChangeView from "./type-change/main.vue";
import MenuOptions from "@/config/MenuOptions";

/**
 * 组件是否可见的 Map
 */
type VisibleMap = { [key: string]: boolean };

@Component({
  components: {
    FilterDialog,
    SortDialog,
    WarnDialog,
    ToolButton,
    TypeChangeView,
    LimitDialog
  }
})
export default class DetailToolbar extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  // 当前元素所在下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 处于聚焦状态
  @CommonStore.State("focusDashboard")
  focusDashboard!: string;

  // 复制仪表盘
  @CommonStore.Mutation("copyDashboard")
  copyDashboard!: Function;

  // 删除仪表盘
  @CommonStore.Mutation("deleteDashboard")
  deleteDashboard!: Function;

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

  // 各功能弹窗的开关
  visibles: VisibleMap = {
    filter: false,
    sort: false,
    warn: false,
    limit: false,
    typeChange: false
  };

  /**
   * 关闭所有弹窗
   */
  closeAllPopper() {
    for (let key in this.visibles) {
      this.visibles[key] = false;
    }
  }

  get isReact() {
    return this.thisDashboard.analysis.isReact;
  }

  set isReact(val: boolean) {
    this.thisDashboard.analysis.isReact = val;
  }

  /**
   * 是否可预警
   */
  get isWarnable() {
    return MenuOptions.getChartFunctionalOptions(
      this.thisDashboard.visualData.type
    )?.warnable;
  }

  /**
   * 关闭过滤配置
   */
  closeFilterDialog() {
    this.visibles.filter = false;
  }

  /**
   * 关闭排序配置
   */
  closeSortDialog() {
    this.visibles.sort = false;
  }

  /**
   * 关闭排序配置
   */
  closeLimitDialog() {
    this.visibles.limit = false;
  }

  /**
   * 关闭预警配置
   */
  closeWarnDialog() {
    this.visibles.warn = false;
  }

  closeTypeChangeView() {
    this.visibles.typeChange = false;
  }

  /**
   * 复制
   */
  handleCopy() {
    this.copyDashboard(this.activeIndex);
  }

  /**
   * 删除
   */
  handleDelete() {
    this.deleteDashboard(this.activeIndex);
  }
}
</script>

<style lang="scss">
$toolbarWidth: 32px;

.detail-toolbar-popper {
  // 防止圆角超出
  overflow: hidden;
}

.detail-popper {
  margin-left: #{-$toolbarWidth} !important;
}
</style>

<style lang="scss" scoped>
.detail-toolbar {
  display: flex;
  flex-flow: column nowrap;
}
</style>
