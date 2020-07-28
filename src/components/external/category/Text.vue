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
      <!-- 背景色 -->
      <!-- <label for="backgroundColor">背景色</label>
      <el-color-picker
        ref="colorclick"
        v-model="widget.visualData.background.color"
        :show-alpha="true"
        color-format="hex"
        size="mini"
      /> -->

      <!-- 字体颜色 -->
      <label for="fontColor">字体颜色</label>
      <el-color-picker
        class="font-color-picker"
        v-model="textFont.color"
        :show-alpha="true"
        color-format="hex"
        size="mini"
      ></el-color-picker>

      <!-- 边框 -->
      <label for="border">边框</label>
      <el-switch
        v-model="widget.visualData.border.enable"
        active-color="#13ce66"
        class="grid-card-font-size"
        @change="borderToggle"
      />
      <div v-if="widget.visualData.border.enable" class="border-group">
        <label for="border">颜色</label>
        <el-color-picker
          class="grid-card-font-size"
          v-model="widget.visualData.border.props.color"
          :show-alpha="true"
          color-format="hex"
          size="mini"
        />

        <label for="border">样式</label>
        <el-select
          v-model="widget.visualData.border.props.style"
          class="grid-card-font-size"
        >
          <el-option key="dotted" label="点状" value="dotted" />
          <el-option key="solid" label="实线" value="solid" />
          <el-option key="double" label="双线" value="double" />
          <el-option key="dashed" label="虚线" value="dashed" />
        </el-select>

        <label for="border">宽度</label>
        <el-select
          v-model="widget.visualData.border.props.width"
          class="grid-card-font-size"
        >
          <el-option
            v-for="(sel, idx) in fontSizeOptions"
            :key="idx"
            :label="sel"
            :value="sel"
          />
        </el-select>

        <label for="border">圆角</label>
        <el-slider
          class="grid-card-font-size"
          v-model="widget.visualData.border.props.radius"
          :max="50"
          :min="0"
        />
      </div>

      <!-- 字号 -->
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
          v-for="(sel, idx) in fontSizeOptions"
          :key="idx"
          :label="sel"
          :value="sel"
        />
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

      <!-- 排列方式 -->
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

      <!-- 字体样式 -->
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
import { widgetConfig, DashWidget } from "@/types/DashWidget";
import ToolButton from "@/components/ToolButton.vue";
import { WidgetBuilder } from "../../../config/WidgetBuilder";

@Component({
  components: {
    ToolButton
  }
})
export default class TextToolBar extends Vue {
  @Inject()
  wdata!: DashWidget<any>;

  fontSizeOptions = ((): Array<number> => {
    const result = [];
    for (let index = 1; index < 101; index++) {
      result.push(index);
    }
    return result;
  })();

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

  borderToggle(enable: boolean) {
    this.wdata.visualData.border = WidgetBuilder.buildBorder(enable);
  }

  get widget(): DashWidget<widgetConfig.TextArea> {
    return this.wdata as DashWidget<widgetConfig.TextArea>;
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
    grid-row-gap: 20px;
    grid-template-rows: auto auto auto;
    grid-template-columns: 42px 50px 66px auto;
    grid-template-areas: none;
    grid-auto-flow: initial;
    grid-auto-rows: initial;
    grid-auto-columns: initial;
    justify-items: right;
    align-items: center;
    .grid-card-font-size {
      width: 155px;
      grid-column: 2 / 5;
    }
    .border-group {
      grid-column: 1 / 5;
      display: grid;
      width: 100%;
      justify-items: inherit;
      align-items: inherit;
      grid-template-columns: inherit;
      grid-row-gap: 9px;
      color: #000000af;
      font-size: 12px;
    }
    .grid-card-button-group {
      display: grid;
      grid-column: 1 / 5;
      grid-template-columns: auto auto auto;
      grid-auto-flow: column dense;
      width: 100%;
      .is-active {
        .el-radio-button__inner {
          padding: 9px 14px;
          box-shadow: none;
          border-radius: 5%;
        }
      }
      .el-radio-button {
        text-align: center;
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
      .el-checkbox-group {
        text-align: center;
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
