<script lang="tsx">
import { Vue, Component, Prop } from "vue-property-decorator";
import { CreateElement } from "vue";
import ObjectUtil from "glaway-bi-util/ObjectUtil";
import { ResultJSON } from "glaway-bi-util/AxiosUtil";
import Page from "@/types/EditorPage";
import { StoryPage } from "@/types/Story";

import text from "./toolbars/Text.vue";
import img from "./toolbars/Image.vue";

@Component({
  components: {}
})
export default class ToolBar extends Vue {
  @Prop()
  state!: Page.State;

  toolbarRegistry: any = {
    text,
    img
  };

  /**
   * 工具栏
   */
  toolbar(h: CreateElement) {
    let toolbarInner = null;

    if (this.state.currentWidget) {
      toolbarInner = this.toolbarRegistry[this.state.currentWidget.type];
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
    if (this.state.currentPage === null) return null;

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
