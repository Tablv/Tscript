<template>
  <div class="custom-treeInput">
    <div class="text-group">
      <span class="span-text">高</span>
      <span class="span-text">中</span>
      <span class="span-text">低</span>
    </div>
    <div class="color-group reset-display">
      <color-picker
        class="color-select-0"
        v-model="specificStyle.axisLabel.color"
      />
      <color-picker
        class="color-select-1"
        v-model="specificStyle.axisLabel.color"
      />
      <color-picker
        class="color-select-2"
        v-model="specificStyle.axisLabel.color"
      />
    </div>
    <div class="input-group reset-display">
      <el-input-number
        v-model="specificStyle.max"
        class="span-split"
        :controls="false"
        :min="inputList[0].minValue"
      ></el-input-number>
      <el-input-number
        v-model="inputList[0].minValue"
        class="span-split"
        :controls="false"
        :min="inputList[1].maxValue"
        :max="inputList[0].maxValue"
      ></el-input-number>
      <el-input-number
        v-model="inputList[1].maxValue"
        class="span-split"
        :controls="false"
        :min="inputList[2].maxValue"
        :max="inputList[0].minValue"
      ></el-input-number>
      <el-input-number
        v-model="inputList[2].minValue"
        :controls="false"
        :max="inputList[1].maxValue"
      ></el-input-number>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop } from "vue-property-decorator";
import ColorPicker from "@/components/color-picker/index.vue";
@Component({
  components: {
    ColorPicker
  }
})
export default class TreeInput extends Vue {
  // 基础样式配置
  @Inject()
  getSpecificStyle!: Function;

  get specificStyle() {
    return this.getSpecificStyle();
  }

  inputList = [
    { text: "高", className: "", minValue: 0, maxValue: 0 },
    { text: "中", className: "", minValue: 0, maxValue: 0 },
    { text: "低", className: "", minValue: 0, maxValue: 0 }
  ];
}
</script>

<style lang="scss" scoped>
.custom-treeInput {
  margin-left: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  .reset-display {
    display: inline-block;
  }
  .text-group {
    display: flex;
    flex-direction: column;
    .span-text {
      margin-right: 20px;
      line-height: 58px;
    }
  }
  .color-group {
    $color0: #d64550;
    $color1: #d9b300;
    $color2: #13ce66;
    display: flex;
    flex-direction: column;
    @mixin commonPseudo() {
      content: "";
      width: 50px;
      display: block;
      height: 12px;
      margin-left: 14px;
    }
    @mixin commonPseudoTop($color) {
      @include commonPseudo;
      border-top: 1px solid $color;
      border-left: 1px solid $color;
    }
    @mixin commonPseudoBottom($color) {
      @include commonPseudo;
      margin-top: -6px;
      margin-bottom: 2px;
      border-bottom: 1px solid $color;
      border-left: 1px solid $color;
    }
    .color-select-0 {
      margin-left: 10px;
      &::before {
        @include commonPseudoTop($color0);
      }
      &::after {
        @include commonPseudoBottom($color0);
      }
    }
    .color-select-1 {
      &::before {
        @include commonPseudoTop($color1);
      }
      &::after {
        @include commonPseudoBottom($color1);
      }
    }
    .color-select-2 {
      &::before {
        @include commonPseudoTop($color2);
      }
      &::after {
        @include commonPseudoBottom($color2);
      }
    }
  }
  .input-group {
    display: flex;
    flex-direction: column;
    .span-split {
      &::after {
        content: "";
        display: block;
        height: 25px;
      }
    }
  }
}
</style>
