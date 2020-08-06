<template>
  <!-- 文本样式 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>文本样式</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="字体颜色">
        <!-- 字体颜色 -->
        <div style="height: 32px">
          <color-picker v-model="textFont.color"></color-picker>
        </div>
      </el-form-item>

      <el-form-item label="字号">
        <!-- 字号 -->
        <el-select
          v-model="textFont.size"
          filterable
          allow-create
          default-first-option
          placeholder="选择字号"
          style="width: 180px"
        >
          <el-option
            v-for="(sel, idx) in fontSizeOptions"
            :key="idx"
            :label="sel"
            :value="sel"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="排列方式">
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
      </el-form-item>

      <el-form-item label="字体样式">
        <el-button-group>
          <!-- 加粗 -->
          <el-button
            icon="fa fa-bold"
            :type="textFont.bold ? 'primary' : 'default'"
            @click="textFont.bold = !textFont.bold"
          />

          <!-- 斜体 -->
          <el-button
            icon="fa fa-italic"
            :type="textFont.italic ? 'primary' : 'default'"
            @click="textFont.italic = !textFont.italic"
          />

          <!-- 下划线 -->
          <el-button
            icon="fa fa-underline"
            :type="textFont.underline ? 'primary' : 'default'"
            @click="textFont.underline = !textFont.underline"
          />
        </el-button-group>
      </el-form-item>

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
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject, Model } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import DetailCard from "@/components/DetailCard.vue";
import { DashWidget, widgetConfig } from "@/types/DashWidget";
import { WidgetBuilder } from "@/config/WidgetBuilder";
import ColorPicker from "@/components/color-picker/index.vue";

@Component({
  components: {
    DetailCard,
    ColorPicker
  }
})
export default class TextStyle extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentWidget!: DashWidget<any>;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  boxCardShadow!: string;

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

  get widget(): DashWidget<widgetConfig.TextArea> {
    return this.currentWidget as DashWidget<widgetConfig.TextArea>;
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
    const widgetId = this.widget?.id;
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
