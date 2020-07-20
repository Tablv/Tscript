<script lang="tsx">
import { Vue, Component, Prop, Inject } from "vue-property-decorator";
import { CreateElement } from "vue";
import ObjectUtil from "glaway-bi-util/ObjectUtil";
import { ResultJSON } from "glaway-bi-util/AxiosUtil";
import { StoryWidget } from "@/types/StoryWidget";

import text from "./toolbars/Text.vue";
import img from "./toolbars/Image.vue";

@Component({
  components: {}
})
export default class ToolBar extends Vue {
  toolbarRegistry: any = {
    text,
    img
  };

  @Inject()
  wdata!: StoryWidget<any>;

  /**
   * 工具栏
   */
  toolbar(h: CreateElement) {
    let toolbarInner = null;

    if (this.wdata.visualData.type) {
      toolbarInner = this.toolbarRegistry[this.wdata.visualData.type];
    }

    return (
      <div class="tool-bar">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          duration="200"
        >
          <toolbarInner
            class="tool-bar-inner"
            style={{ animationDuration: "200ms" }}
          />
        </transition>
      </div>
    );
  }

  render(h: CreateElement) {
    if (this.wdata === null) return null;

    return (
      <el-row
        class="tool-bar-wrapper"
        type="flex"
        justify="space-between"
        align="middle"
      >
        {this.toolbar(h)}
      </el-row>
    );
  }
}
</script>

<style lang="scss">
@import "./toolbar";
</style>
