import { BarTemplates } from "./BarTemplates";
import ObjectUtil from "@/util/ObjectUtil";

/**
 * 初始化模板
 */
const templates = {
  echarts: {
    sampleStyle: {
      barStack: ObjectUtil.copy(BarTemplates.templates.echarts.sampleStyle)
    }
  }
};

/**
 * 菜单选项
 */
const menuOptions = ObjectUtil.copy(BarTemplates.menuOptions);

export const BarStackTemplates = {
  templates,
  menuOptions
};
