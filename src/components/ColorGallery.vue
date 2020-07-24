<template>
  <div v-if="colors" class="color-gallery" :class="{ full: isColorObject }">
    <div class="color-gallery__inner">
      <span v-if="isColorObject" class="color-block__title">{{
        colors.name
      }}</span>

      <span
        v-for="(colorVal, colorIdx) in limitedColorsArray"
        :key="colorIdx"
        :style="sizeStyle"
        class="color-gallery__block"
      >
        <div
          class="color-gallery__chunk"
          :style="{ backgroundColor: colorVal }"
        ></div>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";

@Component
export default class ColorGallery extends Vue {
  /**
   * colors数据
   *
   * - 接收参数
   *   1. colors = [ '#fff', '#000' ]
   *   2. colors = { name: 'default', colors: [ '#fff' ] }
   */
  @Prop()
  colors!: Array<string> | ColorsModel;

  // 预览尺寸
  @Prop()
  size!: number;

  // 边框间距
  @Prop()
  padding!: number;

  // 限制数量
  @Prop()
  limit!: number;

  sizeStyle = {
    width: "14px",
    height: "14px",
    padding: "4px",
    borderRadius: "4px"
  };

  /**
   * Getter
   */
  get isColorObject(): boolean {
    return !(this.colors instanceof Array);
  }

  get limitedColorsArray(): ColorsModel | Array<string> {
    // 取出数组
    let colorArr = this.isColorObject
      ? (this.colors as ColorsModel).colors
      : (this.colors as Array<string>);

    // 如果存在限制个数, 返回截取后的数组
    return this.limit ? colorArr.slice(0, this.limit) : colorArr;
  }

  mounted() {
    if (this.size) {
      this.setChunkSize();
    }

    if (this.padding) {
      this.setPadding();
    }
  }

  @Watch("size")
  onSizeUpdate(): void {
    this.setChunkSize();
  }

  @Watch("setPadding")
  onPaddingUpdate(): void {
    this.setPadding();
  }

  setChunkSize(): void {
    this.sizeStyle.width = this.size + "px";
    this.sizeStyle.height = this.size + "px";
  }

  setPadding(): void {
    this.sizeStyle.padding = this.padding + "px";
    this.sizeStyle.borderRadius = this.padding + "px";
  }
}

/**
 * Colors 数据
 */
export interface ColorsModel {
  // 名称描述
  name: string;

  // 颜色数组
  colors: Array<string>;
}
</script>

<style lang="scss" scoped>
.color-gallery {
  // display: inline-block;
  display: inline-flex;

  .color-gallery__inner {
    display: inline-flex;
    align-items: center;

    .color-block__title {
      padding-right: 10px;
    }

    .color-gallery__block {
      box-sizing: content-box;
      border: 1px solid #e6e6e6;

      & + .color-gallery__block {
        margin-left: 4px;
      }

      .color-gallery__chunk {
        width: 100%;
        height: 100%;
      }
    }
  }

  &.full {
    width: 100%;

    .color-gallery__inner {
      width: 100%;
      justify-content: flex-end;
    }
  }
}
</style>
