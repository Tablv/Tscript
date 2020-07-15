import { StoryWidget } from "@/types/StoryWidget";
import { StoryContainer, StoryPage } from "./Story";

declare namespace Page {
  type User = {
    /**
     * - 用户ID
     */
    id: string;

    /**
     * - 用户姓名
     */
    name: string;

    /**
     * - 用户名
     */
    username: string;

    /**
     * - IP地址
     */
    ipAddress: string;

    /**
     * - 用户当前票据
     */
    token: string;
  };

  /**
   * 页面状态数据
   */
  type State = {
    /**
     * 分组ID
     */
    groupId: string;

    /**
     * 当前页下标
     */
    currentPage: StoryPage | null;

    /**
     * 当前选中组件
     */
    currentWidget: StoryWidget<any> | null;

    /**
     * 故事板数据
     */
    data: StoryContainer | null;

    /**
     * 未保存页面数组
     */
    unsavedPage: StoryPage | null;

    /**
     * 当前用户
     */
    currentUser: User | null;
  };

  /**
   * 页面状态 Getter
   */
  type Getter = {
    /**
     * 当前页面已被锁
     */
    pageLocked: boolean;

    /**
     * 当前页面被当前用户锁定
     */
    pageLockedByMe: boolean;

    /**
     * 当前页面被暂存
     */
    currentStashed: boolean;
  };

  /**
   * 页面状态动作
   */
  type Action = {
    /**
     * 加载用户信息
     */
    loadUser(): Promise<void>;

    /**
     * 加载故事板数据
     *
     * @param groupId 分组ID
     */
    loadStory(groupId: string): Promise<StoryContainer>;

    /**
     * 保存页面
     *
     * @param page 页面
     */
    savePage(page: StoryPage): Promise<void>;

    /**
     * 添加页面
     *
     * @param storyId 故事板ID
     */
    addPage(storyId: string): Promise<void>;

    /**
     * 获取页面锁
     */
    getLock(): Promise<void>;

    /**
     * 释放页面锁
     */
    releaseLock(): Promise<void>;

    /**
     * 暂存未保存的数据
     */
    stashUnsavedPage(): Promise<void>;

    /**
     * 清空未保存的数据
     */
    clearUnsavedPage(): Promise<void>;

    /**
     * 获取未保存页面数据
     */
    loadUnsavedPage(containerId: string): Promise<StoryPage>;
  };
}

export default Page;
