<template>
  <div class="iframe-widget">
    <iframe
      ref="iframe"
      v-show="isShowIframe"
      :src="iframeUrl"
      :frameName="data.id"
      frameborder="0"
      height="100%"
      width="100%"
      seamless
    >
    </iframe>
    <div class="placeholder-tip" v-show="!isShowIframe">
      <i class="fa fa-globe-asia tip-icon"></i>
      <span class="tip-text" @mousedown.stop>
        <span style="width: 50px;">链接:</span>
        <el-input
          type="text"
          v-model="templinkUrl"
          @change="handInputChange"
        ></el-input>
      </span>
    </div>

    <div v-show="isShowModal" class="iframe-modal"></div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Inject,
  Prop,
  Watch
} from "vue-property-decorator";
import { widgetConfig, DashWidget } from "@/types/DashWidget";
import ImageUploader from "@/components/external/service/ImageUploader.vue";
import { CommonStore } from "@/store/modules-model";
import AxiosUtil from "@/util/AxiosUtil";
import { API } from "@/api/AxiosRequest";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

@Component({
  components: {
    ImageUploader
  }
})
export default class Iframe extends Vue {
  @Prop()
  data!: DashWidget<widgetConfig.TIframe>;

  // 处于聚焦状态
  @CommonStore.State("focusDashboard")
  focusItem!: Dashboard | DashWidget<any>;

  templinkUrl: string = "";

  isDraging: boolean = true;

  get isShowIframe() {
    return this.data.config.url;
  }

  get isShowModal() {
    return this.isShowIframe && !this.focusItem.id;
  }

  handInputChange() {
    this.data.config.url = this.templinkUrl;
  }

  @Watch("isShowIframe")
  handleUrlChange() {
    this.templinkUrl = this.data.config.url || "";
  }

  get iframeUrl() {
    const api = /http:|https:/;
    const pre = api.test(this.templinkUrl) ? "" : "//";
    return pre + this.templinkUrl;
  }
}
</script>

<style lang="scss">
.iframe-widget {
  .iframe-modal {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .placeholder-tip {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
    height: 100%;
    color: #797979;

    .tip-icon {
      font-size: 80px;
      margin: 20px 10px 14px;
      color: #28a9ff;
    }

    .tip-text {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;

      .el-upload-list {
        position: absolute;
        left: 20%;
        right: 20%;
      }
    }
  }
}
</style>
