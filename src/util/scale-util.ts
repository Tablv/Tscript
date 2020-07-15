import { widgetConfig } from "@/types/StoryWidget";
import { ContainerConfig } from "@/types/Story";

/**
 * 计算画布缩放尺寸
 *
 * @param canvas 画布DOM
 * @param config 画布配置
 * @param paddingSize 画布 Padding
 */
export function getCanvasScale(
  canvas: HTMLElement,
  config: ContainerConfig,
  paddingSize: number = 30
) {
  const canvasWidth = canvas.clientWidth - paddingSize;
  const canvasHeight = canvas.clientHeight - paddingSize;

  const widthScale = canvasWidth / config.standardSize.width;
  const heightScale = canvasHeight / config.standardSize.height;

  // 屏幕缩放 取最小值
  let screenScale = Math.min(widthScale, heightScale);

  // 取后6位
  screenScale = parseFloat(screenScale.toFixed(6));

  // 防止负数
  return Math.max(screenScale, 0.01);
}

/**
 * 计算幻灯片缩放尺寸
 *
 * @param config 画布配置
 */
export function getSlideScale(config: ContainerConfig) {
  const { width, height } = config.standardSize;
  const { clientWidth, clientHeight } = document.documentElement;

  const standardRatio = width / height;
  const clientRatio = clientWidth / clientHeight;

  /**
   * 判断宽高比
   *  - 标准比例 > 客户端比例：客户端宽度/标准宽度
   *  - 标准比例 < 客户端比例：客户端高度/标准高度
   */
  let slideScale =
    standardRatio > clientRatio ? clientWidth / width : clientHeight / height;
  // 取后6位
  slideScale = parseFloat(slideScale.toFixed(6));

  // 防止负数
  return Math.max(slideScale, 0.01);
}

/**
 * 缩放后样式
 */
export const scaledStyle = {
  /**
   * 获取画布缩放尺寸样式
   *
   * @param config 画布配置
   * @param scale 缩放比例
   */
  getCanvasSize(config: ContainerConfig, scale: number) {
    return {
      width: `${config.standardSize.width * scale}px`,
      height: `${config.standardSize.height * scale}px`
    };
  },

  /**
   *
   * @param config 组件配置
   * @param scale 缩放比例
   */
  getWidgetSize(config: widgetConfig.Base, scale: number) {
    const { size, position } = config;

    return {
      position: {
        x: scale * position.x,
        y: scale * position.y
      },
      size: {
        width: scale * size.width,
        height: scale * size.height
      }
    };
  }
};
