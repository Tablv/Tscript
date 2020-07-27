<script lang="tsx">
import { Vue, Component, Provide, Inject, Prop } from "vue-property-decorator";
import { CreateElement } from "vue";
import text from "./widgets/Text.vue";
import img from "./widgets/Image.vue";
import { DashWidget } from "@/types/DashWidget";

@Component({})
export default class Widget extends Vue {
  @Prop()
  data!: DashWidget<any>;

  widgetRegistry: any = {
    text,
    img
  };

  render(h: CreateElement) {
    if (!this.data.type) return null;
    const component = this.widgetRegistry[this.data.type];
    if (!component) return null;

    return (
      <component
        class="widget-item"
        id={"widget-" + this.data.id}
        data={this.data}
        widgetConfig={this.data.config}
        style={[(this as any).borderStyle, (this as any).backgroundStyle]}
      ></component>
    );
  }
}
</script>

<style lang="scss">
.widget-item {
  width: 100%;
  height: 100%;
}
</style>
