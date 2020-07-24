<template>
  <div class="img-tool-bar"></div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/EditorPage";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";

@Component({
  components: {}
})
export default class ImageToolBar extends Vue {
  @Inject()
  state!: Page.State;

  get widget(): StoryWidget<widgetConfig.Image> {
    return this.state.currentWidget as StoryWidget<widgetConfig.Image>;
  }

  get imgUrl(): widgetConfig.Image["url"] {
    return this.widget.config.url;
  }

  set imgUrl(url: widgetConfig.Image["url"]) {
    this.widget.config.url = url;
  }
}
</script>
