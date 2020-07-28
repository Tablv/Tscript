<template>
  <div class="img-tool-bar"></div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import { widgetConfig, DashWidget } from "@/types/DashWidget";
import { WidgetType } from "@/config/WidgetType";

@Component({
  components: {}
})
export default class ImageToolBar extends Vue {
  @Inject()
  state!: any;

  get widget(): DashWidget<widgetConfig.Image> {
    return this.state.currentWidget as DashWidget<widgetConfig.Image>;
  }

  get imgUrl(): widgetConfig.Image["url"] {
    return this.widget.config.url;
  }

  set imgUrl(url: widgetConfig.Image["url"]) {
    this.widget.config.url = url;
  }
}
</script>
