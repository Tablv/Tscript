<template>
  <!-- 图片属性 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>图片属性</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="上传图片">
        <image-uploader :api="uploadApi" @success="onUploadSuccess">
          <template #trigger>
            <el-button type="default" v-if="imgUrl">重新上传</el-button>
            <el-button type="primary" v-else>点击上传</el-button>
          </template>

          <template #uploading>
            <span>上传中...</span>
          </template>
        </image-uploader>
      </el-form-item>

      <el-form-item label="图片适应">
        <el-select v-model="imgFit">
          <el-option
            v-for="fitOption in imageFitOptions"
            :key="fitOption.value"
            v-bind="fitOption"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject, Model } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import DetailCard from "@/components/DetailCard.vue";
import { DashWidget, widgetConfig } from "@/types/DashWidget";
import { WidgetBuilder } from "@/config/WidgetBuilder";
import ImageUploader from "@/components/external/service/ImageUploader.vue";
import AxiosUtil from "@/util/AxiosUtil";
import { API } from "@/api/AxiosRequest";

@Component({
  components: {
    DetailCard,
    ImageUploader
  }
})
export default class TextStyle extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentWidget!: DashWidget<any>;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  boxCardShadow!: string;

  imageFitOptions = [
    {
      label: "自动",
      value: "scale-down"
    },
    {
      label: "拉伸",
      value: "fill"
    },
    {
      label: "缩放",
      value: "contain"
    },
    {
      label: "填充",
      value: "cover"
    },
    {
      label: "居中",
      value: "none"
    }
  ];

  get uploadApi() {
    return AxiosUtil.getBasePath() + API.upload;
  }

  get widget(): DashWidget<widgetConfig.Image> {
    return this.currentWidget as DashWidget<widgetConfig.Image>;
  }

  get imgUrl() {
    return this.widget.config.url;
  }

  set imgUrl(url) {
    this.widget.config.url = url;
  }

  get imgFit() {
    return this.widget.config.fit;
  }

  set imgFit(fit) {
    this.widget.config.fit = fit;
  }

  /**
   * 图片上传
   */
  onUploadSuccess(response: any) {
    const path = response.result.path;
    this.imgUrl = path;
  }
}
</script>
