import { widgetConfig } from "@/types/DashWidget";
import { WidgetType } from "@/config/WidgetType";

/**
 * 元素模板
 */
export class WidgetBuilder {
  constructor(
    public type: WidgetType | null,
    public position?: widgetConfig.Position
  ) {}

  public buildConfig() {
    if (!this.type) {
      throw new Error("部件构造器的构造函数参数有误");
    }

    const configBuilder = this.widgetConfigBuilders[this.type];
    if (!configBuilder) {
      return {};
    }

    return configBuilder();
  }

  public buildVisualData(): widgetConfig.VisualData {
    return {
      position: this.position as widgetConfig.Position,
      width: 400,
      height: 300,
      background: WidgetBuilder.buildBackground(true),
      border: WidgetBuilder.buildBorder(false),
      shadow: WidgetBuilder.buildShadow(false)
    };
  }

  /**
   * 构建元素边框
   *
   * @param enable 是否启用
   */
  public static buildBorder(enable: boolean): widgetConfig.Border {
    return {
      enable,
      props: enable
        ? {
            width: 1,
            style: "solid",
            color: "#000",
            radius: 0
          }
        : null
    };
  }

  /**
   * 构建元素背景
   *
   * @param enable 是否启用
   */
  public static buildBackground(enable: boolean): widgetConfig.Background {
    return {
      enable,
      props: enable
        ? {
            color: "#fff"
          }
        : null
    };
  }

  public static buildShadow(enable: boolean, shadowSize?: "small"|"middle"|"large"): widgetConfig.Shadow {
    if (!enable) {
      return {
        enable,
        props: null
      };
    }

    // default value
    let props = {
      h: 0,
      v: 0,
      blur: 10,
      spread: 0,
      color: "#00000033"
    };

    return {
      enable,
      props
    };
  }

  private widgetConfigBuilders: { [type: string]: Function } = {
    text: (): widgetConfig.TextArea => {
      return {
        value: "",
        font: {
          color: "#666",
          size: 16,
          bold: false,
          italic: false,
          underline: false
        },
        alignment: {
          horizontal: "left",
          vertical: "top"
        }
      };
    },
    img: (): widgetConfig.Image => {
      return {
        url: null
      };
    }
  };
}
