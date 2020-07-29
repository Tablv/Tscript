<template>
  <div class="img-widget">
    <el-image v-if="imgUrl" :src="imgUrl" :fit="imgFit">
      <div slot="placeholder" class="el-image__error">正在加载...</div>
    </el-image>

    <div class="placeholder-tip" v-else>
      <i class="fa fa-file-image tip-icon"></i>
      <span class="tip-text" @mousedown.stop>
        <image-uploader :api="uploadApi" @success="onUploadSuccess">
          <template #trigger>
            <span>点击&nbsp;</span>
            <el-button type="text" size="medium">上传图片</el-button>
          </template>
        </image-uploader>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject, Prop } from "vue-property-decorator";
import { widgetConfig, DashWidget } from "@/types/DashWidget";
import { WidgetType } from "@/config/WidgetType";
import ImageUploader from "@/components/external/service/ImageUploader.vue";
import AxiosUtil from "@/util/AxiosUtil";
import { API } from "@/api/AxiosRequest";

@Component({
  components: {
    ImageUploader
  }
})
export default class ImageWidget extends Vue {
  @Prop()
  data!: DashWidget<widgetConfig.Image>;

  get uploadApi() {
    return AxiosUtil.getBasePath() + API.upload;
  }

  get imgUrl(): widgetConfig.Image["url"] {
    return this.data.config.url;
  }

  set imgUrl(url: widgetConfig.Image["url"]) {
    this.data.config.url = url;
  }

  get imgFit() {
    return this.data.config.fit;
  }

  set imgFit(fit) {
    this.data.config.fit = fit;
  }

  onUploadSuccess(response: any) {
    const path = response.result.path;
    this.imgUrl = path;
  }
}
</script>

<style lang="scss">
.img-widget {
  .el-image {
    width: 100%;
    height: 100%;
    background-color: #fff;

    .placeholder {
      width: 100%;
      height: 100%;
    }
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
