<template>
  <el-popover
    class="text-tool-bars"
    placement="right"
    width="260"
    :offset="50"
    trigger="click"
    visible-arrow
  >
    <el-card class="text-tool-card">
      <label for="backgroundColor">背景色</label>
      <el-color-picker
        ref="colorclick"
        v-model="widget.visualData.background"
        :show-alpha="true"
        color-format="hex"
        size="mini"
      />
      <label for="fontColor">字体颜色</label>
      <el-color-picker
        class="font-color-picker"
        v-model="textFont.color"
        :show-alpha="true"
        color-format="hex"
        size="mini"
      ></el-color-picker>
      <label for="fontSize">字号</label>
      <el-select
        class="grid-card-font-size"
        v-model="textFont.size"
        filterable
        allow-create
        default-first-option
        placeholder=""
      >
        <el-option
          v-for="fontSize in fontSizeOptions"
          :key="fontSize"
          :value="fontSize"
        >
        </el-option>
      </el-select>
      <!-- 插入无序列表 -->
      <!-- <el-dropdown
        split-button
        type="default"
        trigger="click"
        @click="insertUL()"
        @command="insertUL"
        style="grid-column-start: 1; grid-column-end: 3;"
      >
        <i class="fa fa-list-ul"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="ulOption in ulOptions"
            :key="ulOption"
            :command="ulOption"
          >
            <ul style="padding-left: 20px" :style="{ listStyle: ulOption }">
              <li><i class="fa fa-font"></i></li>
            </ul>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <!-- 插入无序列表 -->
      <!-- <el-dropdown
        split-button
        type="default"
        trigger="click"
        @click="insertOL()"
        @command="insertUL"
        style="grid-column-start: 3; grid-column-end: 5;"
      >
        <i class="fa fa-list-ol"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="olOption in olOptions"
            :key="olOption"
            :command="olOption"
          >
            <ol style="padding-left: 20px" :style="{ listStyle: olOption }">
              <li><i class="fa fa-font"></i></li>
            </ol>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <!-- 水平对齐 -->
      <el-radio-group
        v-model="textAlignment.horizontal"
        class="grid-card-button-group"
      >
        <!-- 左对齐 -->
        <el-radio-button label="left">
          <i class="fa fa-align-left"></i>
        </el-radio-button>

        <!-- 居中 -->
        <el-radio-button label="center">
          <i class="fa fa-align-center"></i>
        </el-radio-button>

        <!-- 右对齐 -->
        <el-radio-button label="right">
          <i class="fa fa-align-right"></i>
        </el-radio-button>
      </el-radio-group>
      <div class="grid-card-button-group">
        <!-- 加粗 -->
        <el-checkbox-group v-model="textFont.bold">
          <el-checkbox-button>
            <i class="fa fa-bold"></i>
          </el-checkbox-button>
        </el-checkbox-group>

        <!-- 斜体 -->
        <el-checkbox-group v-model="textFont.italic">
          <el-checkbox-button>
            <i class="fa fa-italic"></i>
          </el-checkbox-button>
        </el-checkbox-group>

        <!-- 下划线 -->
        <el-checkbox-group v-model="textFont.underline">
          <el-checkbox-button>
            <i class="fa fa-underline"></i>
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
    </el-card>
    <tool-button slot="reference" icon-class="fa fa-cog" title="样式" />
  </el-popover>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import ToolButton from "@/components/ToolButton.vue";
import BorderStyle from "./common/BorderStyle.vue";
import BackgroundStyle from "./common/BackgroundStyle.vue";

@Component({
  components: {
    BorderStyle,
    ToolButton,
    BackgroundStyle
  }
})
export default class TextToolBar extends Vue {
  @Inject()
  wdata!: StoryWidget<any>;

  fontSizeOptions = [
    8,
    9,
    10,
    10.5,
    11,
    12,
    14,
    16,
    18,
    20,
    24,
    28,
    32,
    36,
    40,
    44,
    48,
    54,
    60,
    66,
    72,
    80,
    88,
    96,
    104,
    112,
    120,
    128,
    136,
    144,
    152,
    160,
    168,
    176,
    184,
    192
  ];

  ulOptions = ["disc", "circle", "square"];

  olOptions = [
    "decimal",
    "decimal-leading-zero",
    "lower-roman",
    "upper-roman",
    "lower-alpha",
    "upper-alpha",
    "cjk-ideographic"
  ];

  get widget(): StoryWidget<widgetConfig.TextArea> {
    return this.wdata as StoryWidget<widgetConfig.TextArea>;
  }

  get textFont(): widgetConfig.TextArea["font"] {
    return this.widget.config.font;
  }

  get textAlignment(): widgetConfig.TextArea["alignment"] {
    return this.widget.config.alignment;
  }

  /**
   * 插入无序列表
   */
  insertUL(listType: string) {
    listType = listType || this.ulOptions[0];
    const template = `<ul style="list-style: ${listType};display:inline-block;text-decoration: inherit;"><li></li></ul>`;
    this.insertHtml(template);
  }

  /**
   * 插入有序列表
   */
  insertOL(listType: string) {
    listType = listType || this.ulOptions[0];
    const template = `<ol style="list-style: ${listType};display:inline-block;text-decoration: inherit;"><li></li></ol>`;
    this.insertHtml(template);
  }

  /**
   * 插入HTML
   */
  insertHtml(html: string) {
    /**
     * 光标移至最后
     */
    const widgetId = this.wdata?.id;
    const editBox = document.querySelector(
      `#widget-${widgetId} [contenteditable]`
    ) as HTMLSpanElement;
    if (!editBox) return;

    editBox.focus();

    // 创建range
    const selection = window.getSelection();

    // range 选择editBox下所有子内容
    selection?.selectAllChildren(editBox);

    // 光标移至最后
    selection?.collapseToEnd();

    /**
     * Selection 对象，表示用户选择的文本范围或光标的当前位置。
     * 在非IE浏览器（Firefox、Safari、Chrome、Opera）下可以使用window.getSelection()获得selection对象
     * anchor 选中区域的“起点”。
     * focus 选中区域的“结束点”。
     * range 是一种fragment(HTML片断)，它包含了节点或文本节点的一部分。一般情况下，同一时刻页面中只可能有一个range，也有可能是多个range（使用Ctrl健进行多选，不过有的浏览器不允许，例如Chrome）。可以从selection中获得range对象，也可以使用document.createRange()方法获得。
     */
    let range =
      selection && selection.getRangeAt && selection.rangeCount
        ? selection.getRangeAt(0)
        : null; // getRangeAt(index) 从当前selection对象中获得一个range对象。

    if (!selection || !range) return;

    // deleteContents()方法,range内容会被删除
    range.deleteContents();

    // 将输入的内容写入并加载到 dom 中
    let el = document.createElement("div");
    el.innerHTML = html;
    let frag = document.createDocumentFragment(),
      node,
      lastNode;

    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    // insertNode,在range的开始位置插入一 个节点
    range.insertNode(frag);

    // 收尾
    if (lastNode) {
      range = range.cloneRange();
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // 非编辑状态时，需要模糊 DOM，以触发 DOM 的 blur 事件，同步数据到 Vue 中
    const isBlured = !document.querySelector(
      `#widget-${widgetId} [contenteditable=true]`
    );
    isBlured && editBox.blur();
  }
}
</script>

<style lang="scss">
.text-tool-bars.tool-bar-inner > * + * {
  margin-left: 2px !important;
}
.switch-btn-group {
  .el-checkbox-group {
    float: left;
  }
  &::after {
    content: "";
    clear: both;
  }
}
.text-tool-card {
  .el-card__body {
    display: grid;
    grid-row-gap: 10px;
    grid-template-rows: 40px 40px auto;
    grid-template-columns: 60px 50px 66px auto;
    grid-template-areas: none;
    grid-auto-flow: initial;
    grid-auto-rows: initial;
    grid-auto-columns: initial;
    .grid-card-font-size {
      width: 125px;
      grid-column-start: 2;
      grid-column-end: 5;
    }
    .grid-card-button-group {
      display: grid;
      grid-column-start: 1;
      grid-column-end: 5;
      grid-auto-flow: column dense;
      .is-active {
        .el-radio-button__inner {
          padding: 9px 14px;
          box-shadow: none;
          border-radius: 5%;
        }
      }
      .el-radio-button__inner {
        border: none !important;
      }
      .is-checked {
        .el-checkbox-button__inner {
          box-shadow: none;
          border-radius: 5%;
        }
      }
      .el-checkbox-button__inner {
        border: none !important;
      }
    }
  }
}
.text-tool-bar {
  /**
   * 字体颜色选择
   */
  .font-color-picker {
    &:hover .el-color-picker__trigger:before {
      color: #409eff;
    }

    .el-color-picker__trigger {
      padding: 0;
      margin-top: 24px;
      height: 6px;

      &:before {
        content: "A";
        position: absolute;
        bottom: 6px;
        text-align: center;
        width: 100%;
        font-size: 16px;
        color: #606266;
        transition: color 0.2s;
      }

      .el-color-picker__color.is-alpha {
        background-image: none;
      }

      .el-color-picker__icon {
        display: none;
      }
    }
  }
}
</style>
