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
   * 构建容器配置
   */
  static buildContainerConfig(): ContainerConfig {
    return {
      standardSize: {
        width: 960,
        height: 540
      }
    };
  }

  /**
   * 构建页面
   *
   * @param storyboardId 故事板ID
   * @param sortNum 排序下标
   */
  static buildPage(storyId: string, sortNum?: number): StoryPage {
    return {
      id: UUID.generate(),
      storyId,
      sortNum: sortNum as number,
      lockUser: null,
      lockUserName: null,
      thumbnail: null,
      widgets: []
    };
  }

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
    return {
      id: UUID.generate(),
      type,
      config: new WidgetBuilder(type, position).buildConfig()
    };
  }
}
