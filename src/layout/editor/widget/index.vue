<script lang="tsx">
import { Vue, Component, Prop } from "vue-property-decorator";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { DashWidget } from "@/types/DashWidget";
import { CreateElement } from "vue";
import DashboardWidget from "./Dashboard.vue";
import ExternalWidget from "./External.vue";

@Component({
  components: {
    DashboardWidget,
    ExternalWidget
  }
})
export default class WidgetProxy extends Vue {
  /**
   * 每个可调整元素的数据和所在下标
   */
  @Prop()
  item!: Dashboard | DashWidget<any>;

  @Prop()
  index!: number;

  /**
   * 拖拽事件
   */
  onDragging(x: number, y: number) {
    this.widget.onDragging && this.widget.onDragging(x, y);
  }

  onDragStop(x: number, y: number) {
    this.widget.onDragStop && this.widget.onDragStop(x, y);
  }

  onResizeStop(x: number, y: number, width: number, height: number) {
    this.widget.onResizeStop && this.widget.onResizeStop(x, y, width, height);
  }

  render(h: CreateElement) {
    const isDashboard = !(this.item as any).type;
    const widget = isDashboard ? DashboardWidget : ExternalWidget;

    return (
      <widget
        item={this.item}
        index={this.index}
        ref="widget"
        onContextmenu={this.doHandleContextmenu.bind(this)}
      />
    );
  }

  get widget(): any {
    return this.$refs.widget;
  }

  doHandleContextmenu(event: MouseEvent) {
    this.$emit("doContextMenu", event);
    event.preventDefault();
  }
}
</script>
