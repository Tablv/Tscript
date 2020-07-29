import { WidgetType } from "@/config/WidgetType";

/**
 * 故事元素
 */
export interface DashWidget<ConfigType> {
  /**
   * ID
   */
  id: string;

  /**
   * 元素类型
   */
  type: WidgetType;

  /**
   * 可视化数据
   */
  visualData: widgetConfig.VisualData;

  /**
   * 配置项
   */
  config: ConfigType;
}

export namespace widgetConfig {
  /**
   * 元素位置
   */
  export type Position = {
    x: number;
    y: number;
    z: number;
  };

  /**
   * 元素尺寸
   */
  export type Size = {
    width: number;
    height: number;
  };

  /**
   * 元素边框
   */
  export type Border = {
    enable: boolean;
    props: {
      width: number;
      style: "dotted" | "solid" | "double" | "dashed";
      color: string; // Hex
      radius: number;
    } | null;
  };

  /**
   * 元素阴影
   */
  export type Shadow = {
    enable: boolean;
    props: {
      // 水平阴影的位置
      h: number;

      // 垂直阴影的位置
      v: number;

      // 模糊距离
      blur: number;

      // 阴影大小
      spread: number;

      // 阴影颜色
      color: string; // Hex
    } | null;
  };

  /**
   * 元素背景
   */
  export type Background = {
    enable: boolean;
    props: {
      color: string; // Hex
    } | null;
  };

  /**
   * 元素可视化配置项
   */
  export type VisualData = {
    /**
     * 坐标
     */
    position: Position;

    /**
     * 尺寸
     */
    width: number;
    height: number;

    /**
     * 边框
     */
    border: Border;

    /**
     * 背景
     */
    background: Background;

    /**
     * 阴影
     */
    shadow?: Shadow;
  };

  /**
   * 文本框配置
   */
  export type TextArea = {
    /**
     * 数值
     */
    value: string;

    /**
     * 字体
     */
    font: {
      color: string;
      size: number;
      bold: boolean;
      italic: boolean;
      underline: boolean;
    };

    /**
     * 对齐方式
     */
    alignment: {
      horizontal: "left" | "center" | "right";
      vertical: "top" | "middle" | "bottom";
    };
  };

  /**
   * 图片配置
   */
  export type Image = {
    /**
     * URL
     */
    url: string | null;

    /**
     * 图片显示类型
     */
    fit: "fill" | "contain" | "cover" | "none" | "scale-down";
  };
}
