<template>
  <div class="canvas-box" :style="canvasStyle">
    <preview-canvas />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import PreviewCanvas from "@/layout/preview/PreviewCanvas.vue";
import UIUtil, { MessageType } from "@/util/UIUtil";
import ObjectUtil from "@/util/ObjectUtil";
import { CommonStore } from "@/store/modules-model";
import RequestUtil from "@/util/RequestUtil";
import DashboardSet from "@/model/view/DashboardSet";
import DashboardUtil from "@/util/DashboardUtil";
import { Properties } from "csstype";

@Component({
  components: {
    PreviewCanvas
  }
})
export default class Preview extends Vue {
  // 仪表盘集ID
  @CommonStore.State("dashboardSetId")
  setId!: string;

  @CommonStore.State("dashboardSet")
  dashboardSet!: DashboardSet;

  @CommonStore.Mutation("setDashboardSetId")
  setDashboardSetId!: Function;

  @CommonStore.Action("loadDashboardSet")
  loadDashboardSet!: Function;

  canvasStyle: Properties = {};

  /**
   * 创建时执行方法
   */
  created(): void {
    // 加载数据
    const { dashboardSetId } = RequestUtil.getRequestParams();

    if (ObjectUtil.isEmptyString(dashboardSetId)) {
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

    let loadingInstance = UIUtil.showLoading();

    this.setDashboardSetId(dashboardSetId);

    this.loadData()
      .then(() => {
        UIUtil.closeLoading(loadingInstance);
        this.setCanvasStyle();
      })
      .catch(err => {
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
  }

  /**
   * 加载数据
   */
  async loadData(): Promise<void> {
    return this.loadDashboardSet();
  }

  @Watch("dashboardSet")
  setCanvasStyle(): void {
    this.canvasStyle = DashboardUtil.getDashboardSetStyle(this.dashboardSet);
  }
}
</script>

<style lang="scss" scoped>
$canvasContentPadding: 20px;

.canvas-box {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
