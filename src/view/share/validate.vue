<template>
  <div class="validate-box">
    <div class="verify-form">
      <div class="verify-title">
        <span class="title-text">分享图表验证</span>
      </div>

      <el-form @submit.native.prevent class="verify-input" label-position="top">
        <el-form-item label="请输入分享码：">
          <el-row :gutter="10">
            <el-col :span="18">
              <el-input
                autofocus
                @keyup.enter.native="viewChart"
                v-model="sharePassword"
              />
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="viewChart">查看图表</el-button>
            </el-col>
          </el-row>
          <el-row class="invalid-msg">
            <el-col>{{ invalidMsg }}</el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UIUtil, { MessageType } from "@/util/UIUtil";
import ObjectUtil from "@/util/ObjectUtil";
import { CommonStore } from "@/store/modules-model";
import RequestUtil from "@/util/RequestUtil";
import { AxiosRequest } from "@/config/AxiosRequest";

@Component
export default class Preview extends Vue {
  shareId = "";

  sharePassword = "";

  invalidMsg = "";

  /**
   * 创建时执行方法
   */
  created(): void {
    // 加载数据
    let shareId = RequestUtil.getRequestParams().get("shareId") || "";

    if (ObjectUtil.isEmptyString(shareId) || shareId === "null") {
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

    this.shareId = shareId;
  }

  /**
   * 查看图表
   */
  viewChart(): void {
    if (ObjectUtil.isEmptyString(this.sharePassword)) {
      this.invalidMsg = "分享码不能为空";
      return;
    }

    AxiosRequest.publicAPI.share
      .validate(this.shareId, this.sharePassword)
      .then(url => (window.location.href = url))
      .catch(err => {
        if (typeof err === "boolean") {
          this.invalidMsg = "分享链接或分享码错误";
        } else {
          UIUtil.showErrorMessage("系统繁忙，请稍后重试");
          console.error(err);
        }
      });
  }
}
</script>

<style lang="scss" scoped>
.validate-box {
  width: 100%;
  height: 100%;
  background-color: rgb(237, 241, 245);
  display: flex;
  justify-content: center;
  align-items: center;

  .verify-form {
    @include select(none);
    width: 430px;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(171, 198, 235, 0.3);

    .verify-title {
      height: 80px;
      background: linear-gradient(90deg, rgb(50, 203, 255), rgb(32, 180, 253));
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;

      .title-text {
        font-size: 16px;
      }
    }

    .verify-input {
      padding: 40px 30px;

      .el-button {
        margin-bottom: 1px;
      }
    }

    .invalid-msg {
      position: absolute;
      color: #ff5858;
      font-size: 12px;
    }
  }
}
</style>
