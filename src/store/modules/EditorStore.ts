import Page from "@/types/EditorPage";
// import api from "@/api/editor";
import ObjectUtil from "glaway-bi-util/ObjectUtil";
import { StoryContainer, StoryPage } from "@/types/Story";
import StoryBuilder from "@/config/StoryBuilder";
import html2canvas from "html2canvas";

/**
 * 页面状态数据
 */
const pageState: Page.State = {
  groupId: "",

  /**
   * 当前页下标
   */
  currentPage: null,

  /**
   * 当前选中组件
   */
  currentWidget: null,

  /**
   * 故事板数据
   */
  data: null,

  unsavedPage: null,

  currentUser: null,

  previewMode: false,

  screenScale: 1,

  snapshotMoment: false
};

// const pageGetter: Page.Getter = {
const pageGetter = {
  /**
   * 当前页面已被锁
   */
  // get pageLocked() {
  //   return !!pageState.currentPage?.lockUser;
  // },

  /**
   * 当前页面被当前用户锁定
   */
  // get pageLockedByMe() {
  //   const userId = pageState.currentUser?.id;
  //   const lockUser = pageState.currentPage?.lockUser;
  //   return userId !== undefined && userId === lockUser;
  // },

  /**
   * 当前页面被暂存
   */
  // get currentStashed() {
  //   return (
  //     pageState.unsavedPage !== null &&
  //     pageState.unsavedPage.id === pageState.currentPage?.id
  //   );
  // }
};

/**
 * 页面状态动作
 */
// class PageAction implements Page.Action {
class PageAction {
  /**
   * 故事板ID
   */
  private containerId!: string;

  constructor(private state: Page.State) {}

  /**
   * 加载用户信息
   */
  // loadUser() {
  //   return api.user.find().then(res => {
  //     this.state.currentUser = res.result;
  //   });
  // }

  /**
   * 加载故事板数据
   *
   * @param groupId 分组ID
   */
  // loadStory(groupId: string) {
  //   return api.story.find(groupId).then(res => {
  //     const story: StoryContainer = res.result;
  //     if (story === null) return Promise.reject(null);

  //     // 解析故事板配置项
  //     if (!story.config) {
  //       story.config = StoryBuilder.buildContainerConfig();
  //     } else {
  //       try {
  //         story.config = JSON.parse((story.config as any) as string);
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }

  //     if (story.pages === null) {
  //       story.pages = [];
  //     }

  //     story.pages.forEach((page: StoryPage) => {
  //       // 解析故事页配置项
  //       if (!page.widgets) {
  //         page.widgets = [];
  //       } else {
  //         try {
  //           page.widgets = JSON.parse((page.widgets as any) as string);
  //         } catch (err) {
  //           console.error(err);
  //         }
  //       }
  //     });

  //     return Promise.resolve(story);
  //   });
  // }

  /**
   * 保存页面
   *
   * @param page 页面
   */
  // savePage(page: StoryPage) {
  //   // let pageDTO = ObjectUtil.copy(page);
  //   // pageDTO.widgets = JSON.stringify(pageDTO.widgets) as any;

  //   // return api.storyPage.save(pageDTO).then(() => {
  //   //   // 清空暂存数据
  //   //   this.clearUnsavedPage();
  //   //   // 释放锁
  //   //   this.releaseLock();
  //   // });
  // }

  /**
   * 添加故事页
   *
   * @param storyId 故事板ID
   */
  // addPage(storyId: string) {
  //   const newPage = StoryBuilder.buildPage(storyId);

  //   return api.storyPage.create(newPage).then(res => {
  //     const sortNum: number = res.result;
  //     newPage.sortNum = sortNum;

  //     this.state.data?.pages.splice(sortNum, 0, newPage);
  //   });
  // }

  /**
   * 获取页面锁
   */
  // getLock() {
  //   if (!this.state.currentPage) return Promise.reject();

  //   return api.storyPage
  //     .getLock(this.state.currentPage.id)
  //     .then(() => {
  //       if (this.state.currentUser && this.state.currentPage) {
  //         this.state.currentPage.lockUser = this.state.currentUser.id;
  //         this.state.currentPage.lockUserName = this.state.currentUser.username;
  //       }
  //       return Promise.resolve();
  //     })
  //     .catch(err => {
  //       return Promise.reject(err);
  //     });
  // }

  /**
   * 释放页面锁
   */
  // releaseLock() {
  //   if (!this.state.currentPage) return Promise.reject();

  //   return api.storyPage.releaseLock(this.state.currentPage.id).then(() => {
  //     this.state.unsavedPage = null;
  //     if (this.state.currentPage) {
  //       this.state.currentPage.lockUser = null;
  //       this.state.currentPage.lockUserName = null;
  //     }
  //   });
  // }

  /**
   * 暂存数据部分
   */
  // get unsavedKey() {
  //   const containerId = this.state.data?.id
  //     ? this.state.data.id
  //     : this.containerId;
  //   return `unsaved-${containerId}`;
  // }

  // get storage(): Storage {
  //   const storage = window.localStorage;
  //   if (!storage) {
  //     (this as any).$notify.success({
  //       title: "警告",
  //       message: "您的浏览器存在兼容性问题 请升级或更换浏览器",
  //       type: "warning",
  //       showClose: false
  //     });

  //     throw new Error("Current browser does not support localStorage feature.");
  //   }
  //   return storage;
  // }

  /**
   * 暂存当前页面
   */
  // stashUnsavedPage() {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       if (!this.state.currentPage) {
  //         reject("保存出错...故事页为空");
  //         return;
  //       }

  //       this.storage.setItem(
  //         this.unsavedKey,
  //         JSON.stringify(this.state.currentPage)
  //       );
  //       this.state.unsavedPage = this.state.currentPage;
  //       resolve();
  //     } catch {
  //       reject("保存出错...");
  //     }
  //   }) as Promise<void>;
  // }

  /**
   * 清空当前页面的暂存数据
   */
  // clearUnsavedPage() {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.storage.removeItem(this.unsavedKey);
  //       this.state.unsavedPage = null;
  //       resolve();
  //     } catch {
  //       reject("clear ERROR...");
  //     }
  //   }) as Promise<void>;
  // }

  /**
   * 获取当前页面的暂存数据
   */
  // loadUnsavedPage(containerId: string) {
  //   this.containerId = containerId;

  //   return new Promise((resolve, reject) => {
  //     try {
  //       const stashedPage = this.storage.getItem(this.unsavedKey);
  //       if (stashedPage) {
  //         this.state.unsavedPage = JSON.parse(stashedPage) as StoryPage;
  //       }
  //       resolve(this.state.unsavedPage as StoryPage);
  //     } catch {
  //       reject();
  //     }
  //   }) as Promise<StoryPage>;
  // }

  // captureSnapshot(dom: HTMLElement) {
  //   return html2canvas(dom, {
  //     allowTaint: false,
  //     useCORS: true
  //   }).then(canvas => {
  //     return Promise.resolve(canvas.toDataURL());
  //   }) as Promise<string>;
  // }
}

const pageAction = new PageAction(pageState);

export { pageState, pageGetter, pageAction };
