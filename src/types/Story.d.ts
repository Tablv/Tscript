import { StoryWidget } from "./StoryWidget";

/**
 * 故事板容器
 */
export interface StoryContainer {
  /**
   * ID
   */
  id: string;

  /**
   * 故事板名称
   */
  name: string;

  /**
   * 团队ID
   */
  teamId: string;

  /**
   * 容器配置项
   */
  config: ContainerConfig;

  /**
   * 故事页
   */
  pages: Array<StoryPage>;
}

/**
 * 容器配置项
 */
export interface ContainerConfig {
  /**
   * 屏幕标准尺寸（缩放比例为 1 时的分辨率）
   */
  standardSize: {
    /**
     * 宽度
     */
    width: number;

    /**
     * 高度
     */
    height: number;
  };
}

/**
 * 故事页
 */
export interface StoryPage {
  /**
   * ID
   */
  id: string;

  /**
   * 所在故事板ID
   */
  storyId: string;

  /**
   * 所在下标
   */
  sortNum: number;

  /**
   * 锁定用户
   */
  lockUser: string | null;

  /**
   * 锁定用户名
   */
  lockUserName: string | null;

  /**
   * 缩略图 URL
   */
  thumbnail: string | null;

  /**
   * 元素
   */
  widgets: Array<StoryWidget<any>>;
}
