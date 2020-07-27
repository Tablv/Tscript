<script lang="tsx">
import { Vue, Component, Provide, Inject, Prop } from "vue-property-decorator";
import { CreateElement } from "vue";
import text from "./widgets/Text.vue";
import img from "./widgets/Image.vue";
import { StoryWidget } from "@/types/StoryWidget";

@Component({})
export default class Widget extends Vue {
  @Prop()
  data!: StoryWidget<any>;

  widgetRegistry: any = {
    text,
    img
  };

  render(h: CreateElement) {
    if (!this.data.visualData.type) return null;
    const component = this.widgetRegistry[this.data.visualData.type];
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
