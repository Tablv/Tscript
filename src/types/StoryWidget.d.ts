import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { WidgetType } from "@/config/WidgetType";

/**
 * 故事元素
 */
export interface StoryWidget<ConfigType> {
  /**
   * ID
   */
  id: string;

  /**
   * 元素类型
   */
  type: WidgetType;

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
   * 元素背景
   */
  export type Background = {
    enable: boolean;
    props: {
      color: string; // Hex
    } | null;
  };

  /**
   * 故事元素基础配置项
   */
  export type Base = {
    /**
     * 坐标
     */
    position: Position;

    /**
     * 尺寸
     */
    size: Size;

    /**
     * 边框
     */
    border: Border;

    /**
     * 背景
     */
    background: Background;
  };

  /**
   * 文本框配置
   */
  export type TextArea = Base & {
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
  export type Image = Base & {
    /**
     * URL
     */
    url: string | null;
  };

  /**
   * 仪表盘配置
   */
  export type DashboardConf = Base & {
    /**
     * 仪表盘ID
     */
    dashboardId: string;

    /**
     * 仪表盘数据
     */
    data: Dashboard | null;
  };
}
