<template>
  <span :class="colorPickerClassNames">
    <el-popover
      v-model="pickerVisible"
      placement="bottom"
      :width="popperWidth"
      trigger="click"
      class="picker-popover"
      popper-class="color-picker-popover-layer"
    >
      <!-- 颜色展示 -->
      <div slot="reference" class="color-picker__trigger">
        <span class="color-picker__color">
          <span class="color-picker__color-inner" :style="bgColorStyle"></span>
        </span>

        <span class="color-picker__icon el-icon-arrow-down"></span>
      </div>

      <!-- 颜色拾取 -->
      <el-tabs v-model="pickerStatus">
        <el-tab-pane label="标准" name="basic">
          <section class="basic-wrap">
            <swatches :value="color" @input="updateColor" />
          </section>
        </el-tab-pane>
        <el-tab-pane label="自定义" name="advanced">
          <section class="advanced-wrap">
            <sketch :value="color" @input="updateColor" />
          </section>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </span>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch, Model } from "vue-property-decorator";
import { Swatches, Sketch } from "vue-color";
import style from "./index.scss";

export type ColorType = "hex" | "hex8";

/**
 * Color Picker Tab
 */
const __PICKER_STATUS = {
  BASIC: "basic",
  ADVANCED: "advanced"
};

@Component({
  components: {
    Swatches,
    Sketch
  }
})
export default class ColorGallery extends Vue {
  // 限制数量
  @Model("color")
  color!: string;

  @Prop({ default: "hex8" })
  type!: "hex" | "hex8";

  // 组件状态
  pickerStatus = __PICKER_STATUS.BASIC;

  // 是否显示
  pickerVisible = false;

  get colorPickerClassNames() {
    const classNames = ["color-picker", `color-picker-${this.pickerStatus}`];
    return classNames.join(" ");
  }

  get bgColorStyle() {
    return { backgroundColor: this.color || "#000" };
  }

  get popperWidth() {
    return parseInt(style.popperWidth);
  }

  get colorValue() {
    return this.color;
  }

  set colorValue(color) {
    this.$emit("color", color);
  }

  updateColor(color: { hex: string; hex8: string }) {
    this.colorValue = color[this.type];
  }
}
</script>

<style lang="scss">
@import "./index";
</style>
