import ObjectUtil from "./ObjectUtil";
import Vue from "vue";
import {
  ElLoadingComponent,
  LoadingServiceOptions
} from "element-ui/types/loading";

/**
 * 确定框类型
 */
export enum ConfirmType {
  success = "success",
  warning = "warning",
  info = "info",
  error = "error"
}

/**
 * 消息类型
 */
export enum MessageType {
  success = "success",
  warning = "warning",
  error = "error"
}

/**
 * Loading 默认参数配置
 */
const loadingDefaultOptions: LoadingServiceOptions = {
  lock: true,
  text: "正在加载数据"
};

export default class UIUtil {
  public static loadingInstance: ElLoadingComponent | null;

  public static confirm(
    type: ConfirmType,
    msg: string,
    title?: string,
    confirmBtnText?: string,
    cancelBtnText?: string
  ): Promise<void> {
    return Vue.prototype.$confirm(msg, title || "提示", {
      confirmButtonText: confirmBtnText || "确定",
      cancelButtonText: cancelBtnText || "取消",
      type
    });
  }

  public static showMessage(
    msg: string,
    msgType: MessageType,
    closable?: boolean,
    duration?: number
  ): void {
    Vue.prototype.$message({
      message: msg,
      type: msgType,
      showClose: closable,
      duration: duration !== undefined ? duration : 1000
    });
  }

  public static showErrorMessage(msg: string, duration?: number): void {
    Vue.prototype.$message({
      message: msg,
      type: MessageType.error,
      duration: duration !== undefined ? duration : 1000
    });
  }

  public static showLoading(
    customOptions?: LoadingServiceOptions
  ): ElLoadingComponent {
    let loadingOptions = loadingDefaultOptions;

    if (customOptions) {
      loadingOptions = ObjectUtil.merge(loadingDefaultOptions, customOptions);
    }

    UIUtil.loadingInstance = Vue.prototype.$loading(loadingOptions);

    return UIUtil.loadingInstance as ElLoadingComponent;
  }

  public static closeLoading(instance?: ElLoadingComponent) {
    if (instance) {
      instance.close();
      UIUtil.loadingInstance = null;
    } else if (UIUtil.loadingInstance) {
      UIUtil.loadingInstance.close();
    }
  }
}
