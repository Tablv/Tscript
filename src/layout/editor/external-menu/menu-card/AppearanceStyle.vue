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
        <div v-if="currentWidget.visualData.background.enable" style="height: 32px;">
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
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject, Model } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import DetailCard from "@/components/DetailCard.vue";
import { DashWidget } from '@/types/DashWidget';
import { WidgetBuilder } from '@/config/WidgetBuilder';

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
    return this.currentWidget.visualData.border.props || WidgetBuilder.buildBorder(true).props;
  }

  set borderProps(props) {
    if (this.currentWidget.visualData.border.enable) {
      this.currentWidget.visualData.border.props = props;
    }
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
