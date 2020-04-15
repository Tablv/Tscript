<template>
  <div class="canvas-box">
    <preview-canvas />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PreviewCanvas from "@/layout/preview/PreviewCanvas.vue";
import UIUtil, { MessageType } from "@/util/UIUtil";
import ObjectUtil from "@/util/ObjectUtil";
import { CommonStore } from "@/store/modules-model";
import RequestUtil from "@/util/RequestUtil";
import { AxiosRequest } from "@/config/AxiosRequest";

@Component({
  components: {
    PreviewCanvas
  }
})
export default class Preview extends Vue {
  // 仪表盘集ID
  @CommonStore.Mutation("setDashboardSet")
  setDashboardSet!: Function;

  @CommonStore.Mutation("setDashboards")
  setDashboards!: Function;

  /**
   * 创建时执行方法
   */
  created(): void {
    // 加载数据
    const { shareId } = RequestUtil.getRequestParams();

    if (ObjectUtil.isEmptyString(shareId)) {
      UIUtil.showLoading({
        text: "分享链接错误",
        spinner: "el-icon-error"
      });
      UIUtil.showMessage(
        "分享链接错误，请检查链接是否完整",
        MessageType.error,
        false,
        0
      );
      return;
    }

    let loadingInstance = UIUtil.showLoading();

    AxiosRequest.publicAPI.share
      .find(shareId)
      .then(resultMap => {
        this.setDashboardSet(resultMap.boardSet);
        this.setDashboards(resultMap.boards);

        UIUtil.closeLoading(loadingInstance);
      })
      .catch(err => {
        UIUtil.closeLoading(loadingInstance);
        UIUtil.showLoading({
          text: "加载分享图表出错",
          spinner: "el-icon-error"
        });
        UIUtil.showMessage(
          "加载分享图表出错，请稍后重试",
          MessageType.error,
          false,
          0
        );
      });
  }
}
</script>

<style lang="scss" scoped>
.canvas-box {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
