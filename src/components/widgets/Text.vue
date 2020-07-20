<template>
  <div class="text-widget" @dblclick="doHandleDBclik">
    <span v-show="showPlaceholder" class="placeholder-tip">
      <span>双击输入文本</span>
    </span>

    <div
      class="text-box"
      :class="{ 'edit-box': widgetEditable, 'no-edit-box': !widgetEditable }"
      :style="[textStyle, previewAlignment]"
    >
      <span
        ref="innerText"
        :contenteditable="widgetEditable"
        class="inner-text"
        v-html="textValue"
        @click.stop
        @paste.prevent="onPaste"
        @blur="changeText"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Inject,
  Prop,
  Watch
} from "vue-property-decorator";

import Page from "@/types/EditorPage";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";

@Component({})
export default class TextWidget extends Vue {
  @Prop()
  data!: StoryWidget<widgetConfig.TextArea>;

  widgetEditable: boolean = false;

  get editBox(): HTMLSpanElement {
    return this.$refs.innerText as HTMLSpanElement;
  }

  get showPlaceholder() {
    return this.textValue === "" && !this.widgetEditable;
  }

  @Watch("widgetEditable")
  onEditableChange() {
    // 启用编辑模式时，设置文本编辑光标至末尾
    if (this.widgetEditable)
      this.$nextTick(() => {
        this.setLastIndex();
      });
  }

  doHandleDBclik() {
    this.widgetEditable = true;
    this.setLastIndex();
  }

  /**
   * 设置文本编辑光标至末尾
   */
  setLastIndex() {
    // 解决ff不获取焦点无法定位问题
    this.editBox.focus();

    // 创建range
    const range = window.getSelection();

    // range 选择editBox下所有子内容
    range?.selectAllChildren(this.editBox);

    // 光标移至最后
    range?.collapseToEnd();
  }

  onPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData("text/plain");
    if (!text) return;

    document.execCommand("insertText", false, text);
  }

  /**
   * 文本值
   */
  get textValue(): widgetConfig.TextArea["value"] {
    return this.data.config.value;
  }

  set textValue(value: string) {
    this.data.config.value = value;
  }

  changeText() {
    this.textValue = this.editBox.innerHTML;
    this.widgetEditable = false;
  }

  /**
   * 字体配置
   */
  get textFont(): widgetConfig.TextArea["font"] {
    return this.data.config.font;
  }

  /**
   * 对齐配置
   */
  get textAlignment(): widgetConfig.TextArea["alignment"] {
    return this.data.config.alignment;
  }

  /**
   * 边框配置
   */
  get borderConfig(): widgetConfig.Border {
    return this.data.config.border;
  }

  get scaledFontSize() {
    return this.textFont.size;
  }

  get textStyle() {
    return {
      color: this.textFont.color,
      "font-size": this.scaledFontSize + "px",
      "font-weight": this.textFont.bold ? "bold" : "normal",
      "font-style": this.textFont.italic ? "italic" : "normal",
      "text-decoration": this.textFont.underline ? "underline" : "none",
      "text-align": this.textAlignment.horizontal
    };
  }

  alignmentMapping = {
    horizontal: {
      left: "flex-start",
      center: "center",
      right: "flex-end"
    },
    vertical: {
      top: "flex-start",
      middle: "center",
      bottom: "flex-end"
    }
  };

  get previewAlignment() {
    return {
      "justify-content": this.alignmentMapping.horizontal[
        this.textAlignment.horizontal
      ],
      "align-items": this.alignmentMapping.vertical[this.textAlignment.vertical]
    };
  }
}
</script>

<style lang="scss">
.text-widget {
  font-family: auto;
  position: relative;
  cursor: grab;
  overflow: visible !important;
  &:active {
    cursor: grabbing;
  }

  [contenteditable] {
    outline: none;
  }

  .placeholder-tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 20px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: #858585;
  }

  .text-box {
    display: flex;
    width: 100%;
    height: 100%;

    &.edit-box {
      cursor: text;
    }
    &.no-edit-box {
      cursor: grab;
      &:active {
        cursor: grabbing;
      }
    }

    .inner-text {
      width: 100%;
      text-decoration: inherit;
    }
  }
}
</style>
