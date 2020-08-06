<template>
  <div class="option-bar">
    <!-- 主体button -->
    <!-- 菜单 -->
    <el-popover
      popper-class="option-bar-popover"
      placement="top"
      width="260"
      :offset="50"
      trigger="click"
      visible-arrow
    >
      <el-card shadow="never">
        <div slot="header">
          <span>终端</span>
        </div>
        <el-select v-model="dashboardSet.terminalType">
          <el-option
            v-for="(sel, idx) in dashboardSetOptions.terminalType.selection"
            :key="idx"
            :label="sel.text"
            :value="sel.value"
          />
        </el-select>
      </el-card>
      <el-card shadow="never">
        <div slot="header">
          <span>宽高比</span>
        </div>
        <el-input-number
          class="ratio-input"
          v-model="dashboardSet.widthRatio"
          :controls="false"
          :min="1"
        />
        <span class="ratio-seperator">:</span>
        <el-input-number
          class="ratio-input"
          v-model="dashboardSet.heightRatio"
          :controls="false"
          :min="1"
        />
      </el-card>
      <el-card shadow="never">
        <div slot="header">
          <span>背景类型</span>
        </div>
        <el-radio-group v-model="dashboardSet.canvasSetting.background.type">
          <el-radio :label="0">背景色</el-radio>
          <el-radio :label="1">背景图片</el-radio>
        </el-radio-group>
        <div
          v-if="dashboardSet.canvasSetting.background.type === 0"
          class="select-color"
        >
          <span class="label-text">拾取背景色</span>
          <color-picker
            v-model="dashboardSet.canvasSetting.background.color"
            :show-alpha="true"
            color-format="hex"
          />
          <span class="label-grid-text">步进线</span>
          <el-switch
            v-model="dashboardSet.canvasSetting.background.show"
            active-color="#13ce66"
          />
        </div>
        <div v-if="dashboardSet.canvasSetting.background.type === 1">
          <el-upload
            action="/admin/dashboard/container/updateBackground"
            class="bg-uploader"
            :show-file-list="false"
            :on-success="uploadBgSuccess"
            :on-error="uploadBgError"
            :before-upload="bgValidate"
            :data="{
              containerId: dashboardSetId
            }"
          >
            <img
              v-if="dashboardSet.canvasSetting.background.url"
              :src="dashboardSet.canvasSetting.background.url"
              class="background-img"
            />
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </div>
      </el-card>
      <el-card shadow="never">
        <div slot="header">
          <span>缩放</span>
        </div>
        <el-slider
          show-input
          input-size="mini"
          v-model="screenZoom"
          :min="50"
          :max="200"
          :step="10"
        />
      </el-card>
      <el-button slot="reference" icon="fa fa-cog" class="option-button" />
    </el-popover>

    <!-- 分享 Dialog -->
    <el-dialog
      class="share-dialog"
      title="分享"
      v-if="shareVisible"
      :visible.sync="shareVisible"
      width="30%"
      append-to-body
    >
      <!-- 已分享标题 -->
      <div v-if="isShared" class="title">
        <i class="el-icon-success" style="color: #67C23A;"></i>
        <span>已创建分享链接</span>
      </div>

      <!-- 未分享标题 -->
      <div v-else class="title">
        <i class="el-icon-question" style="color: #E6A23C;"></i>
        <span>是否确定分享链接？</span>
      </div>

      <el-form :model="shareObj" label-width="80px">
        <el-form-item label="分享链接">
          <el-input readonly v-model="shareObj.shareURL" />
        </el-form-item>
        <el-form-item label="分享码">
          <el-input readonly v-model="shareObj.sharePwd" />
        </el-form-item>
        <el-form-item v-if="isShared">
          <el-button type="primary" @click="copyShareLink"
            >复制链接及分享码</el-button
          >
        </el-form-item>
      </el-form>

      <template #footer class="dialog-footer">
        <el-button type="primary" v-if="!isShared" @click="confirmShare">
          <span>分 享</span>
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ChartType } from "glaway-bi-model/enums/ChartType";
import { DatasetType } from "glaway-bi-model/enums/DatasetType";
import { EditorStore, CommonStore } from "@/store/modules-model";
import DashboardSet from "glaway-bi-model/view/DashboardSet";
import { dashboardSetOptions } from "@/config/EditorOptions";
import { ShareType } from "glaway-bi-model/enums/ShareType";
import ShareVO from "glaway-bi-model/results/ShareVO";
import UIUtil from "@/util/UIUtil";
import ColorPicker from "@/components/color-picker/index.vue";
import { AxiosRequest } from "@/api/AxiosRequest";
import {
  ElUploadInternalRawFile,
  ElUploadInternalFileDetail
} from "element-ui/types/upload";

@Component({
  components: {
    ColorPicker
  }
})
export default class OptionBar extends Vue {
  @CommonStore.State("dashboardSetId")
  dashboardSetId!: string;

  // 仪表盘集配置
  @CommonStore.State("dashboardSet")
  dashboardSet!: DashboardSet;

  // 配置项
  dashboardSetOptions = dashboardSetOptions;

  /**
   * 画布设置
   */
  // 是否显示画布设置
  canvasSettingVisible = false;

  // 打开画布设置
  openCanvasSetting() {
    this.canvasSettingVisible = true;
  }

  // 背景图片 校验
  bgValidate(file: ElUploadInternalRawFile): boolean {
    const isJPG = file.type === "image/jpeg",
      isLt10M = file.size / 1024 / 1024 < 10;

    if (!isJPG) {
      UIUtil.showErrorMessage("上传头像图片只能是 JPG 格式!");
    }
    if (!isLt10M) {
      UIUtil.showErrorMessage("上传头像图片大小不能超过 10MB!");
    }
    return isJPG && isLt10M;
  }

  // 背景图片 上传成功
  uploadBgSuccess(res: any, file: ElUploadInternalFileDetail): void {
    this.dashboardSet.canvasSetting.background.url = res.result.raw;
  }

  // 背景图片 上传失败
  uploadBgError(err: ErrorEvent): void {
    console.error(err);
    this.dashboardSet.canvasSetting.background.url = "";
    UIUtil.showErrorMessage("上传背景图片失败 请稍后重试");
  }

  /**
   * 分享部分
   */
  // 是否显示分享窗口
  shareVisible = false;

  // 是否为已分享状态
  isShared = false;

  // 分享对象
  shareObj: ShareVO | null = null;

  get screenZoom(): number {
    let zoomPercent = parseInt(
      (this.dashboardSet.tempParams.zoom * 100).toString()
    );
    return zoomPercent;
  }

  set screenZoom(value: number) {
    let zoomVal = parseFloat((value / 100).toFixed(1));

    this.dashboardSet.tempParams.zoom = zoomVal;

    this.setPopperZoom(zoomVal);
  }

  /**
   * 设置 Popper 缩放
   *  - 修复因屏幕缩放导致位置偏移的bug
   */
  setPopperZoom(zoomVal: number) {
    let $poppers = document.querySelectorAll(
      ".detail-toolbar-popper"
    ) as NodeListOf<HTMLDivElement>;
    $poppers.forEach(($el: HTMLDivElement) => {
      $el.style.zoom = zoomVal.toString();
    });
  }

  /**
   * 打开分享页面
   */
  openShare(): void {
    if (!this.dashboardSetId) return;

    AxiosRequest.share
      .find(this.dashboardSetId, ShareType.dashboard)
      .then(shareData => {
        this.shareObj = shareData as ShareVO;

        // ID 不为空，设置为已分享状态
        this.isShared = this.shareObj.status === 1;

        // 显示对话框
        this.shareVisible = true;
      })
      .catch(err => {
        UIUtil.showErrorMessage("无法打开分享，请稍后重试");
        console.error(err);
      });
  }

  /**
   * 复制分享链接
   */
  copyShareLink(): void {
    if (this.shareObj) {
      let text = `链接：${this.shareObj.shareURL}\n分享码：${this.shareObj.sharePwd}\n复制这段内容后打开浏览器，快速查看图表`;
      this.$copyText(text).catch(err => console.error(err));
    }
  }

  /**
   * 确定分享
   */
  confirmShare(): void {
    if (!this.shareObj) return;

    AxiosRequest.share
      .save(this.shareObj)
      .then(() => {
        // 拷贝链接
        this.copyShareLink();

        // 已共享
        this.isShared = true;
      })
      .catch(err => {
        UIUtil.showErrorMessage("分享失败，请稍后重试");
        console.error(err);
      });
  }
}
</script>

<style lang="scss" scoped>
.option-bar {
  @include select(none);
  display: flex;
  justify-content: space-around;

  .option-button {
    border: 0;
    height: 84px;
    width: 83px;
    color: #666;
    font-size: 22px;
    background: #f1f3f6;
    border-radius: 0;
    cursor: pointer;
    @include select(none);

    &:hover {
      background-color: #e6e9ec;
    }

    &:active {
      background-color: #e6e9ec;
    }

    &:focus {
      outline: none;
    }
  }
}
.share-dialog {
  .title {
    padding: 10px 0 20px;
    text-align: center;

    i {
      padding-right: 10px;
      font-size: 24px;
      vertical-align: middle;
    }
  }
  ::v-deep {
    .el-dialog__body {
      padding: 0 40px;
    }
  }
}
</style>
<style lang="scss">
.option-bar-popover {
  left: 30px !important;
  box-shadow: 0 0px 10px 3px rgba(0, 0, 0, 0.1);
  .el-card {
    border: none;
    border-radius: 0;
    background: #f1f2f6;
    .el-card__header {
      border-bottom: none;
      padding-top: 10px;
    }
    .el-card__body {
      padding: 10px;
      padding-top: 0;
      .select-color {
        padding-top: 8px;
        .label-text {
          font-size: 12px;
          color: #666;
        }
        .label-grid-text {
          font-size: 12px;
          color: #666;
          margin-left: 20px;
          margin-right: 12px;
        }
        .color-picker--small {
          margin-left: 20px;
          transform: translateY(7px);
          .color-picker__trigger {
            height: 20px;
            width: 20px;
          }
        }
      }
      .el-slider__input {
        width: 100px;
      }
      .el-slider__runway.show-input {
        margin-right: 120px;
      }
    }
  }
  .ratio-input {
    width: 100px;
  }
  .ratio-seperator {
    padding: 0 6px;
  }
  .bg-uploader .el-upload {
    margin-top: 8px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409eff;
    }

    // 上传图标
    i {
      font-size: 28px;
      color: #8c939d;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }

    // 背景图片
    .background-img {
      width: 30px;
      height: 30px;
      display: block;
    }
  }
}
</style>
