<template>
  <!-- 边框 -->
  <el-popover
    popper-class="style-config-popover"
    placement="bottom"
    width="180"
    trigger="click"
  >
    <el-button slot="reference" icon="fa fa-image"></el-button>

    <el-form class="style-form" label-width="70px">
      <el-form-item label="背景">
        <el-switch
          v-model="background.enable"
          active-color="#13ce66"
          @change="toggleBackgroundEnable"
        ></el-switch>
      </el-form-item>

      <el-collapse-transition>
        <div v-if="backgroundProps">
          <el-form-item label="颜色">
            <!-- 颜色 -->
            <el-color-picker v-model="backgroundProps.color"></el-color-picker>
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
  data!: widgetConfig.Background;

  get background(): widgetConfig.Background {
    return this.data;
  }

  set background(background: widgetConfig.Background) {
    this.$emit("update:data", background);
  }

  get backgroundProps(): widgetConfig.Background["props"] {
    return this.background.props;
  }

  set backgroundProps(props: widgetConfig.Background["props"]) {
    this.background.props = props;
  }

  toggleBackgroundEnable(enable: boolean) {
    if (enable && this.backgroundProps === null) {
      this.backgroundProps = new WidgetBuilder(null).buildBackground(
        true
      ).props;
    } else if (!enable && this.backgroundProps !== null) {
      this.backgroundProps = null;
    }
  }
}
</script>
