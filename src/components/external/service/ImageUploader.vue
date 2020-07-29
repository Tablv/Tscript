<template>
  <div class="image-uploader" :class="{ uploading }">
    <div v-show="uploading" class="uploading-tip">
      <slot name="uploading"></slot>
    </div>

    <el-upload
      :action="api"
      :before-upload="handleBeforeUpload"
      :on-remove="handleUploadRemove"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
    >
      <div class="upload-trigger">
        <transition name="el-zoom-in-bottom">
          <div v-if="!uploading">
            <!-- 上传中隐藏 -->
            <slot name="trigger"></slot>
          </div>
        </transition>
      </div>
    </el-upload>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import {
  ElUploadInternalRawFile,
  ElUploadInternalFileDetail
} from "element-ui/types/upload";
import UIUtil, { MessageType } from "@/util/UIUtil";

@Component
export default class ImageUploader extends Vue {
  @Prop()
  api!: string;

  // 图片是否正在上传
  uploading = false;

  handleBeforeUpload(file: ElUploadInternalRawFile) {
    const isImage = file.type.includes("image");

    if (!isImage) {
      UIUtil.showMessage("请选择图片类型", MessageType.warning);
      return false;
    }

    this.uploading = true;
    return true;
  }

  @Emit("success")
  handleUploadSuccess(
    response: any,
    file: ElUploadInternalFileDetail,
    fileList: Array<ElUploadInternalFileDetail>
  ) {
    this.uploading = false;
    fileList.length = 0;
    return response;
  }

  handleUploadError(err: Error) {
    this.uploading = false;
    UIUtil.showErrorMessage("上传失败 请稍后重试");
    console.error(err);
  }

  handleUploadRemove() {
    this.uploading = false;
  }
}
</script>

<style lang="scss">
.image-uploader {
  &.uploading .el-upload--text {
    display: none;
  }

  .upload-trigger {
    height: 32px;

    .el-upload-list__item:first-child {
      margin-top: 0;
    }
  }
}
</style>
