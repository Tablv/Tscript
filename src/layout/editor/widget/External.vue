<template>
  <div v-on="autoListenres">
    <external-widget :data="item" />
    <div class="toolbar-box" v-show="!isSavingScreenhot">
      <external-toolbar :data.sync="item" :index="index" />
    </div>
  </div>
</template>

<script lang="tsx">
import {
  Vue,
  Component,
  Provide,
  Inject,
  Prop,
  Emit,
  Watch
} from "vue-property-decorator";

import ExternalToolbar from "@/layout/editor/external-toolbar/index.vue";
import { WidgetType } from "@/config/WidgetType";
import { DashWidget, widgetConfig } from "@/types/DashWidget";
import ExternalWidget from "@/components/external/Widget.vue";
import { CommonStore } from "@/store/modules-model";
import DashboardSet from "glaway-bi-model/view/DashboardSet";

@Component({
  components: {
    ExternalWidget,
    ExternalToolbar
  }
})
export default class External extends Vue {
  /**
   * 每个可调整元素的数据和所在下标
   */
  @Prop()
  item!: DashWidget<any>;

  @Prop()
  index!: number;

  // 处于聚焦状态
  @CommonStore.State("focusDashboard")
  focusWidgetData!: DashWidget<any>;

  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 设置当前选中仪表盘
  @CommonStore.Mutation("setDashboardIndex")
  setActiveIndex!: Function;

  // 正在截图标志
  @CommonStore.State("isSavingScreenhot")
  isSavingScreenhot!: boolean;

  // 仪表盘集配置
  @CommonStore.State("dashboardSet")
  dashboardSet!: DashboardSet;

  get autoListenres(): any {
    return Object.assign(this.$listeners, {});
  }

  get setting(): any {
    return this.dashboardSet.canvasSetting;
  }

  get widgetData(): DashWidget<any> {
    return this.item;
  }

  set widgetData(widgetData: DashWidget<any>) {
    this.$emit("update:item", widgetData);
  }
}
</script>
