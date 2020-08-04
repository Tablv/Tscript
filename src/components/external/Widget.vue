<script lang="tsx">
import { Vue, Component, Provide, Inject, Prop } from "vue-property-decorator";
import { CreateElement } from "vue";
import text from "./widgets/Text.vue";
import img from "./widgets/Image.vue";
import customHtml from "./widgets/CustomHtml.vue";
import { DashWidget } from "@/types/DashWidget";

const widgetMap: { [type: number]: any } = {
  1: text,
  3: customHtml,
  4: img
};

@Component({})
export default class Widget extends Vue {
  @Prop()
  data!: DashWidget<any>;

  render(h: CreateElement) {
    if (!this.data.type) return null;
    const component = widgetMap[this.data.type];
    if (!component) return null;

    return (
      <component
        class="widget-item"
        id={"widget-" + this.data.id}
        data={this.data}
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
