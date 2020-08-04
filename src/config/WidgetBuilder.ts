import { widgetConfig } from "@/types/DashWidget";
import { WidgetType } from "@/config/WidgetType";
import { BackgroundType } from "glaway-bi-model/enums/DashboardSet";

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
      props: {
        type: BackgroundType.color,
        color: "#fff",
        url: ""
      }
    };
  }

  public static buildShadow(
    enable: boolean,
    shadowSize: "small" | "medium" | "large" | "huge" = "small"
  ): widgetConfig.Shadow {
    if (!enable) {
      return {
        enable,
        props: null
      };
    }

    let blurSize = blurSizeMap[shadowSize] || blurSizeMap.medium;

    // props
    let props = {
      h: 0,
      v: 0,
      blur: blurSize,
      spread: 0,
      color: "#000000"
    };

    return {
      enable,
      props
    };
  }

  private widgetConfigBuilders: { [type: string]: Function } = {
    // text
    1: (): widgetConfig.TextArea => {
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
    // iframe
    2: (): widgetConfig.TIframe => {
      return {
        url: ""
      };
    },
    // html
    3: (): widgetConfig.THtml => {
      return {
        htmlEditer: `<div class="example">
  打开设置，自定义 html 代码
</div>
<style>
  .example {
    width: 100%;
    height: 100%;
    color: #858585;"
    font-size: 20px;
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style>`
      };
    },
    // img
    4: (): widgetConfig.Image => {
      return {
        url: null,
        fit: "cover"
      };
    }
  };
}

/**
 * 阴影模糊映射
 */
export const blurSizeMap = {
  small: 6,
  medium: 10,
  large: 20,
  huge: 40
};
