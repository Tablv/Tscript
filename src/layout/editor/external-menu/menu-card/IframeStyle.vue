<template>
  <!-- 图片属性 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>Iframe 属性</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="链接地址">
        <el-input
          type="text"
          v-model="templinkUrl"
          @change="handInputChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="链接地址" style="display: none">
        <el-input type="text"></el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject, Watch } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import { DashWidget, widgetConfig } from "@/types/DashWidget";
import { Properties } from "csstype";

@Component({})
export default class IframeStyle extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentWidget!: DashWidget<any>;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  boxCardBodyStyle!: Properties;

  templinkUrl: string = "";

  get isShowIframe() {
    return this.currentWidget.config.url;
  }

  handInputChange() {
    this.currentWidget.config.url = this.templinkUrl;
  }

  @Watch("isShowIframe")
  handleUrlChange() {
    this.templinkUrl = this.currentWidget.config.url || "";
  }
}
</script>
