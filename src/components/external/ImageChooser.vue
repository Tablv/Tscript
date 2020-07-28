<template>
  <el-drawer
    class="image-chooser"
    direction="rtl"
    :visible.sync="chooserVisible"
  >
    <span slot="title" class="el-page-header__content">选择图片</span>
    <el-tree
      v-if="chooserVisible"
      :data="groups"
      node-key="id"
      lazy
      :props="{ label: 'name', isLeaf: data => data.type === 1 }"
      :load="loadGroup"
      :render-content="treeNodeRender"
      @node-click="selectImage"
    >
    </el-tree>
  </el-drawer>
</template>

<script lang="tsx">
import { Vue, Component, Prop, Inject } from "vue-property-decorator";
import { CreateElement } from "vue";
import { TreeNode } from "element-ui/types/tree";

import { promiseTimeout } from "@/util/AxiosUtil.ts";
import { WidgetType } from "@/config/WidgetType";
import { DashWidget, widgetConfig } from "@/types/DashWidget";
import { CommonStore } from "../../store/modules-model";

const validImgSuffix = ["jpg", "jpeg", "png", "gif", "bmp"];

/**
 * 校验文件是否为图片类型
 *
 * @param fileName 文件名
 */
function isImageFile(fileName: string) {
  // 获取后缀名下标
  const suffixIndex = fileName.lastIndexOf(".");
  if (suffixIndex === -1) return false;

  // 文件后缀
  const fileSuffix = fileName.slice(suffixIndex + 1);

  // 校验后缀名
  return validImgSuffix.includes(fileSuffix.toLowerCase());
}

@Component
export default class ImageChooser extends Vue {
  // 创建组件
  @CommonStore.Mutation("createWidget")
  createWidget!: Function;

  @Inject()
  state!: any;

  @Inject()
  getter!: any;

  @Prop()
  visible!: boolean;

  groups: Array<MateGroup> = [];

  loading = false;

  get chooserVisible() {
    return this.visible;
  }

  set chooserVisible(visible: boolean) {
    this.$emit("update:visible", visible);
  }

  loadGroup(node: TreeNode<string, MateGroup>, resolve: Function) {
    const parentId = node.data.id ? node.data.id : "0";
  }

  async selectImage(data: MateGroup) {
    if (data.type === 0 || !this.state.currentPage || !this.state.data) return;

    // 图片校验
    if (!isImageFile(data.name)) {
      (this as any).$message.warning("请选择图片文件");
      return;
    }

    // 获取图片原始宽高
    const { imgWidth, imgHeight } = await promiseTimeout(
      new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => {
          resolve({
            imgWidth: img.width,
            imgHeight: img.height
          });
        };

        img.src = data.url as string;
      }),
      3000
    ).catch(err => {
      (this as any).$message("请求超时");
      console.error(err);
    });

    // 构建图片组件对象
    this.createWidget();
    // const imgWidget = StoryBuilder.buildWidget(WidgetType.IMAGE, {
    //   x: 0,
    //   y: 0,
    //   z: this.state.currentPage.widgets.length
    // }) as DashWidget<widgetConfig.Image>;

    // // 添加 URL
    // imgWidget.config.url = data.url;

    // // 成功获取宽高时，覆盖默认宽高
    // if (imgWidth && imgHeight) {
    //   // 判断是否超出画布标准尺寸
    //   const standardSize = this.state.data.config.standardSize;
    //   const standardWidth = standardwidth;
    //   const standardHeight = standardheight;
    //   // 不超出，直接设置宽高
    //   if (imgWidth < standardWidth && imgHeight < standardHeight) {
    //     imgWidget.visualData.size = {
    //       width: imgWidth,
    //       height: imgHeight
    //     };
    //   } else {
    //     /**
    //      * 图片尺寸超出画布
    //      */
    //     const widthScale = imgWidth / standardWidth;
    //     const heightScale = imgHeight / standardHeight;

    //     const imgScale = Math.max(widthScale, heightScale);

    //     const scaledWidth = parseInt(`${imgWidth / imgScale}`);
    //     const scaledHeight = parseInt(`${imgHeight / imgScale}`);

    //     imgWidget.visualData.size = {
    //       width: Math.min(scaledWidth, standardWidth),
    //       height: Math.min(scaledHeight, standardHeight)
    //     };
    //   }
    // }

    // // 组件数组追加组件
    // this.state.currentPage.widgets.push(imgWidget);

    // // 选中当前组件
    // this.state.currentWidget = imgWidget;

    // // 关闭抽屉
    // this.chooserVisible = false;
  }

  treeNodeRender(
    h: CreateElement,
    context: { node: TreeNode<string, MateGroup>; data: MateGroup }
  ) {
    const { node, data } = context;
    const treeIcon = this.treeIconRender(h, data);

    return (
      <span class="tree-node">
        {treeIcon}
        <span>{node.label}</span>
      </span>
    );
  }

  treeIconRender(h: CreateElement, group: MateGroup) {
    if (group.type === 0) {
      return <i class="fa fa-folder folder-tree-icon"></i>;
    } else {
      const isImg = isImageFile(group.name);
      const iconClass = isImg ? "fa-image" : "fa-file";
      return <i class={`fa ${iconClass} file-tree-icon`}></i>;
    }
  }
}

interface MateGroup {
  id: string;

  name: string;

  /**
   * 类型
   *  - 0: 文件夹
   *  - 1：图片
   */
  type: 0 | 1;

  url: null | string;
}
</script>

<style lang="scss">
.image-chooser {
  user-select: none;
}
</style>
