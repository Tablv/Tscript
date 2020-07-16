import { Vue, Component, Prop } from "vue-property-decorator";
import { StoryWidget, widgetConfig } from "@/types/StoryWidget";

/**
 * 可配置边框的部件
 */
@Component
export default class BackgroundConfigurable extends Vue {
  @Prop()
  data!: StoryWidget<widgetConfig.Base>;

  /**
   * 边框配置
   */
  get backgroundConfig(): widgetConfig.Background {
    return this.data.config.background;
  }

  get backgroundStyle() {
    const backgroundProps = this.backgroundConfig.props;

    if (this.backgroundConfig.enable && backgroundProps) {
      const backgroundColor = backgroundProps.color;
      return { backgroundColor };
    }

    return {};
  }
}
