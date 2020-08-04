<template>
  <div class="text-widget">
    <div ref="htmlContent"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import { widgetConfig, DashWidget } from "@/types/DashWidget";

@Component({})
export default class CustomHtml extends Vue {
  @Prop()
  data!: DashWidget<widgetConfig.THtml>;

  get htmlEditer(): string {
    return this.data.config.htmlEditer;
  }

  @Watch("htmlEditer")
  htmlEditerChange() {
    (this.$refs.htmlContent as HTMLElement).innerHTML = this.htmlEditer;
  }

  mounted() {
    (this.$refs.htmlContent as HTMLElement).innerHTML = this.htmlEditer;
  }
}
</script>

<style lang="scss">
.text-widget {
  font-family: auto;
  position: relative;
  cursor: grab;
  overflow: visible !important;
}
</style>
