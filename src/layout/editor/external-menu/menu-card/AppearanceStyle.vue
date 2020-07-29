<template>
  <!-- 外观样式 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>外观样式</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="背景色">
        <div
          v-if="currentWidget.visualData.background.enable"
          style="height: 32px;"
        >
          <el-color-picker
            v-model="currentWidget.visualData.background.props.color"
            :show-alpha="true"
            color-format="hex"
            size="mini"
          />
        </div>
      </el-form-item>

      <el-form-item label="边框">
        <el-switch
          :value="currentWidget.visualData.border.enable"
          active-color="#13ce66"
          @change="borderToggle"
        />
      </el-form-item>

      <detail-card :visible="currentWidget.visualData.border.enable">
        <el-form-item label="宽度">
          <!-- 宽度 -->
          <el-slider
            :disabled="borderDisabled"
            v-model="borderProps.width"
            :min="1"
            :max="10"
          ></el-slider>
        </el-form-item>

        <el-form-item label="样式">
          <!-- 样式 -->
          <el-select
            :disabled="borderDisabled"
            v-model="borderProps.style"
            placeholder="请选择边框样式"
            popper-class="border-style-selector"
          >
            <el-option
              v-for="option in borderStyleOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            >
              <span
                class="border-style-example"
                :style="{ 'border-style': option.value }"
              ></span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="颜色">
          <!-- 颜色 -->
          <div style="height: 32px;">
            <el-color-picker
              :disabled="borderDisabled"
              v-model="borderProps.color"
              :show-alpha="true"
              color-format="hex"
              size="mini"
            />
          </div>
        </el-form-item>

        <el-form-item label="圆角">
          <!-- 圆角 -->
          <el-slider
            :disabled="borderDisabled"
            v-model="borderProps.radius"
            class="width-slider"
            :min="0"
            :max="100"
          ></el-slider>
        </el-form-item>
      </detail-card>

      <el-form-item label="阴影">
        <el-switch
          :value="!shadowDisabled"
          active-color="#13ce66"
          @change="shadowToggle"
        />
      </el-form-item>

      <detail-card :visible="!shadowDisabled">
        <el-form-item label="尺寸">
          <!-- 尺寸 -->
          <el-select
            v-model="shadowSize"
            placeholder="请选择阴影尺寸"
            popper-class="border-style-selector"
          >
            <el-option
              v-for="option in shadowSizeOptions"
              :key="option.value"
              v-bind="option"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="颜色">
          <!-- 颜色 -->
          <div style="height: 32px;">
            <el-color-picker
              v-model="shadowColor"
              :show-alpha="true"
              color-format="hex"
              size="mini"
            />
          </div>
        </el-form-item>
      </detail-card>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject, Model } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import DetailCard from "@/components/DetailCard.vue";
import { DashWidget } from "@/types/DashWidget";
import { WidgetBuilder, blurSizeMap } from "@/config/WidgetBuilder";

@Component({
  components: {
    DetailCard
  }
})
export default class AppearanceStyle extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentWidget!: DashWidget<any>;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  boxCardShadow!: string;

  /**
   * 边框
   */
  borderStyleOptions = [
    { value: "dotted", label: "点状" },
    { value: "solid", label: "实线" },
    { value: "double", label: "双线" },
    { value: "dashed", label: "虚线" }
  ];

  borderToggle(enable: boolean) {
    this.currentWidget.visualData.border = WidgetBuilder.buildBorder(enable);
  }

  get borderDisabled() {
    return !this.currentWidget.visualData.border.enable;
  }

  get borderProps() {
    return (
      this.currentWidget.visualData.border.props ||
      WidgetBuilder.buildBorder(true).props
    );
  }

  set borderProps(props) {
    if (this.currentWidget.visualData.border.enable) {
      this.currentWidget.visualData.border.props = props;
    }
  }

  /**
   * 阴影
   */
  shadowSizeOptions = [
    { value: blurSizeMap.small, label: "小", mapping: "small" },
    { value: blurSizeMap.medium, label: "中", mapping: "medium" },
    { value: blurSizeMap.large, label: "大", mapping: "large" },
    { value: blurSizeMap.huge, label: "巨大", mapping: "huge" }
  ];

  shadowToggle(enable: boolean) {
    this.currentWidget.visualData.shadow = WidgetBuilder.buildShadow(enable);
  }

  get shadowDisabled() {
    return !this.currentWidget.visualData.shadow?.enable || false;
  }

  get shadowSize() {
    const shadowProps = this.currentWidget.visualData.shadow?.props;

    if (shadowProps) {
      const blurEntry = Object.entries(blurSizeMap).filter(
        ([size, blurValue]) => blurValue === shadowProps.blur
      )[0];
      const size = blurEntry[0];

      return this.shadowSizeOptions.filter(option => option.mapping === size)[0]
        ?.label as any;
    }

    return null as any;
  }

  set shadowSize(blur: number) {
    const shadow = this.currentWidget.visualData.shadow;

    if (!shadow || !shadow.props) {
      this.currentWidget.visualData.shadow = WidgetBuilder.buildShadow(
        true,
        "medium"
      );
    }

    (this.currentWidget.visualData.shadow as any).props.blur = blur;
  }

  get shadowColor() {
    return this.currentWidget.visualData.shadow?.props?.color;
  }

  set shadowColor(color) {
    if (!this.currentWidget.visualData.shadow?.props) return;

    (this.currentWidget.visualData.shadow.props as any).color = color;
  }
}
</script>

<style lang="scss">
.border-style-selector {
  width: 120px;

  .border-style-example {
    display: inline-block;
    width: 100%;
    border-width: 3px 0 0;
    margin-bottom: 3px;
  }
}
</style>
