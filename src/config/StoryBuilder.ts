import { WidgetBuilder } from "@/config/WidgetBuilder";
import UUID from "glaway-bi-util/UUID";
import { StoryPage, ContainerConfig } from "@/types/Story";
import { StoryWidget, widgetConfig } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";

/**
 * 故事板构建类
 */
export default class StoryBuilder {
  /**
   * 构建元素
   *
   * @param type 元素类型
   * @param position 元素位置
   */
  static buildWidget(
    type: WidgetType,
    position?: widgetConfig.Position
  ): StoryWidget<any> {
    const widget = new WidgetBuilder(type, position);
    return {
      id: UUID.generate(),
      type,
      config: widget.buildConfig(),
      visualData: widget.buildVisualData()
    };
  }
}
