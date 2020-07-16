<template>
  <!-- 边框 -->
  <el-popover
    popper-class="style-config-popover"
    placement="bottom"
    width="180"
    trigger="click"
  >
    <el-button slot="reference" icon="fa fa-border-style"></el-button>

    <el-form class="style-form" label-width="70px">
      <el-form-item label="边框">
        <el-switch
          v-model="border.enable"
          active-color="#13ce66"
          @change="toggleBorderEnable"
        ></el-switch>
      </el-form-item>

      <el-collapse-transition>
        <div v-if="borderProps">
          <el-form-item label="宽度">
            <!-- 宽度 -->
            <el-slider
              v-model="borderProps.width"
              class="width-slider"
              :min="1"
              :max="10"
            ></el-slider>
          </el-form-item>

          <el-form-item label="样式">
            <!-- 样式 -->
            <el-select
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
            <el-color-picker v-model="borderProps.color"></el-color-picker>
          </el-form-item>

          <el-form-item label="圆角">
            <!-- 圆角 -->
            <el-slider
              v-model="borderProps.radius"
              class="width-slider"
              :min="0"
              :max="100"
            ></el-slider>
          </el-form-item>
        </div>
      </el-collapse-transition>
    </el-form>
  </el-popover>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Page from "@/types/EditorPage";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";
import { WidgetBuilder } from "@/config/WidgetBuilder";

@Component({
  components: {}
})
export default class BorderStyle extends Vue {
  @Prop()
  data!: widgetConfig.Border;

  borderStyleOptions = [
    { value: "dotted", label: "点状" },
    { value: "solid", label: "实线" },
    { value: "double", label: "双线" },
    { value: "dashed", label: "虚线" }
  ];

  get border(): widgetConfig.Border {
    return this.data;
  }

  set border(border: widgetConfig.Border) {
    this.$emit("update:data", border);
  }

  get borderProps(): widgetConfig.Border["props"] {
    return this.border.props;
  }

  set borderProps(props: widgetConfig.Border["props"]) {
    this.border.props = props;
  }

  toggleBorderEnable(enable: boolean) {
    if (enable && this.borderProps === null) {
      this.borderProps = new WidgetBuilder(null).buildBorder(true).props;
    } else if (!enable && this.borderProps !== null) {
      this.borderProps = null;
    }
  }
}
</script>

<style lang="scss">
.border-style-selector {
  .border-style-example {
    display: inline-block;
    width: 100%;
    border-width: 3px 0 0;
    margin-bottom: 3px;
  }
}
</style>
