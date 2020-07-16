import { StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/config/StoryBuilder";

/**
 * 拖动组件工具类
 */
export const dragUtil = {
  /**
   * 文本
   */
  putText(event: DragEvent) {
    setDragData(event, {
      type: WidgetType.TEXT_AREA
    });
  },

  /**
   * 图片
   */
  putImage(event: DragEvent, url: string) {
    setDragData(event, {
      type: WidgetType.IMAGE,
      data: { url }
    });
  },

  /**
   * 仪表盘
   */
  // putDashboard(event: DragEvent, id: string) {
  //   setDragData(event, {
  //     type: WidgetType.DASHBOARD,
  //     data: { id }
  //   });
  // },

  /**
   * 获取拖拽到的组件
   */
  getWidget(event: DragEvent): StoryWidget<any> | null {
    const dropVal = getDragData(event);
    if (dropVal === null) {
      console.error("组件数据传递出错");
      return null;
    }

    const widgetType = dropVal.type;
    let widget = StoryBuilder.buildWidget(widgetType);

    // switch (dropVal.type) {
    //   case WidgetType.IMAGE: {
    //     (widget as StoryWidget<widgetConfig.Image>).config.url =
    //       dropVal.data.url;
    //     break;
    //   }

    //   case WidgetType.DASHBOARD: {
    //     (widget as StoryWidget<widgetConfig.DashboardConf>).config.dashboardId =
    //       dropVal.data.id;
    //     break;
    //   }
    // }

    return widget;
  }
};

const NEW_WIDGET_KEY = "newWidget";

function setDragData(event: DragEvent, value: dragValue) {
  if (!event.dataTransfer) {
    console.warn("拖动事件异常，无 dataTransfer");
    return false;
  }

  event.dataTransfer.setData(NEW_WIDGET_KEY, JSON.stringify(value));
}

function getDragData(event: DragEvent): dragValue | null {
  if (!event.dataTransfer) {
    console.warn("拖动事件异常，无 dataTransfer");
    return null;
  }

  const value = event.dataTransfer.getData(NEW_WIDGET_KEY);
  return value ? JSON.parse(value) : null;
}

type dragValue = {
  // 组件类型
  type: WidgetType;

  // 组件数据
  data?: any;
};
