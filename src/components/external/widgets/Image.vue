<template>
  <div class="img-widget">
    <el-image v-if="imgUrl" :src="imgUrl" fit="contain">
      <div slot="placeholder" class="el-image__error">正在加载...</div>
    </el-image>

    <div class="placeholder-tip" v-else>
      <i class="fa fa-image tip-icon"></i>
      <span class="tip-text">请先选择图片</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject, Prop } from "vue-property-decorator";
import { widgetConfig, DashWidget } from "@/types/DashWidget";
import { WidgetType } from "@/config/WidgetType";

@Component({})
export default class ImageWidget extends Vue {
  @Prop()
  data!: DashWidget<widgetConfig.Image>;

  get imgUrl(): widgetConfig.Image["url"] {
    return this.data.config.url;
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
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
    height: 100%;
    color: #797979;

    .tip-icon {
      font-size: 34px;
      margin-bottom: 6px;
    }
  }
}
</style>
