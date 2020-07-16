import { Vue, Component, Prop } from "vue-property-decorator";
import { StoryWidget, widgetConfig } from "@/types/StoryWidget";

/**
 * 可配置边框的部件
 */
@Component
export default class BorderConfigurable extends Vue {
  @Prop()
  data!: StoryWidget<widgetConfig.Base>;

  /**
   * 边框配置
   */
  get borderConfig(): widgetConfig.Border {
    return this.data.config.border;
  }

  get borderStyle() {
    const borderProps = this.borderConfig.props;

    if (this.borderConfig.enable && borderProps) {
      const { width, style, color, radius } = borderProps;
      return {
        border: `${width}px ${style} ${color}`,
        borderRadius: `${radius}px`
      };
    }

    return {};
  }
}
