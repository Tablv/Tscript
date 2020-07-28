<template>
  <div class="chart-toolbar common-toolbar">
    <tool-button
      icon-class="fa fa-cogs"
      title="设置"
      placement="top"
      @click="doShowMenu"
    />

    <tool-button
      :icon-class="
        focusDashboard.id
          ? 'fa fa-compress-arrows-alt'
          : 'fa fa-expand-arrows-alt'
      "
      :title="focusDashboard.id ? '取消' : '聚焦'"
      placement="top"
      @click="handleFocus"
    />

    <tool-button
      icon-class="fa fa-camera"
      title="快照"
      placement="top"
      @click="screenhotVisible = true"
    />

    <!-- 更多操作 -->
    <el-popover
      v-model="isShowDetail"
      placement="right-start"
      width="32"
      trigger="click"
      @show="handleShowDetail"
      @hide="handleHideDetail"
      popper-class="detail-toolbar-popper"
      :close-delay="0"
    >
      <detail-toolbar :dashboard.sync="thisDashboard" />

      <tool-button
        class="otherButton"
        icon-class="fa fa-ellipsis-v otherButton"
        title="更多"
        placement="top"
        slot="reference"
      />
    </el-popover>

    <!-- 保存快照 -->
    <el-dialog
      title="快照保存"
      :visible.sync="screenhotVisible"
      width="30%"
      :append-to-body="true"
      @close="checkNode = null"
    >
      <el-tree
        lazy
        :load="loadNode"
        :props="defaultProps"
        @node-click="handleNodeClick"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <i class="fa fa-folder" style="color: #ffe17b; padding-right: 10px">
          </i>
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="screenhotVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Watch, Prop } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ToolButton from "@/components/ToolButton.vue";
import DetailToolbar from "./DetailToolbar.vue";
import { AxiosRequest } from "@/api/AxiosRequest";
import ScreenshotUtil from "@/util/Screenshot";
import UIUtil, { MessageType } from "@/util/UIUtil";
import ObjectUtil from "@/util/ObjectUtil";
import TableView from "glaway-bi-model/view/dashboard/TableView";

@Component({
  components: {
    ToolButton,
    DetailToolbar
  }
})
export default class ChartToolbar extends Vue {
  /**
   * 仪表盘数据
   */
  @Prop()
  dashboard!: Dashboard;

  /**
   * 配置菜单部分
   */
  // 当前激活的元素 所在数组下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  // 聚焦图表信息
  @CommonStore.State("focusDashboard")
  focusDashboard!: Dashboard;

  // 设置聚焦状态
  @CommonStore.Mutation("setFocusDashboard")
  setFocusDashboard!: Function;

  // 菜单是否可见
  @EditorStore.State("menuVisible")
  menuVisible!: boolean;

  // 设置菜单是否可见
  @EditorStore.Mutation("setMenuVisible")
  setMenuVisible!: Function;

  // 加载数据集
  @EditorStore.Action("loadTables")
  loadTables!: Function;

  screenhotVisible: boolean = false;

  // 快照保存目录节点配置信息
  defaultProps = {
    children: "children",
    label: "name"
  };

  checkNode = null;

  /**
   * 更多菜单
   */
  isShowDetail: boolean = false;

  get thisDashboard() {
    return this.dashboard;
  }

  set thisDashboard(dashboard: Dashboard) {
    this.$emit("update:dashboard", dashboard);
  }

  // 显示菜单
  doShowMenu() {
    const isShowMenu = this.activeIndex !== -1 && !this.menuVisible;
    if (isShowMenu) {
      this.loadTables()
        .then((tableView: TableView) => {
          this.thisDashboard.tableView = tableView;
          // 这里能等接口，太费时间
          this.$nextTick(() => {
            this.setMenuVisible(isShowMenu);
          });
        })
        .catch((err: Error) => {
          UIUtil.showErrorMessage("加载数据集失败");
          console.error(err);
        });
    }
  }

  /**
   * 更多按钮
   */
  // 菜单打开window添加click监听
  handleShowDetail() {
    // IE9+
    window.addEventListener("click", this.handlePopver, true);
  }
  // 菜单关闭window移除click监听
  handleHideDetail() {
    window.removeEventListener("click", this.handlePopver, true);
  }

  // 更多菜单的开关关闭
  handlePopver(event: any) {
    let classNameFlag = event.target.className.indexOf("otherButton");
    if (classNameFlag !== -1) {
      event.stopPropagation();
    }
    this.isShowDetail = !this.isShowDetail;
  }

  /**
   * 快照按钮
   */
  loadNode(node: any, resolve: any) {
    let requestData = { parentId: node.data?.id || "0" };
    if (node.level === 0) {
      requestData = { parentId: "0" };
    }
    AxiosRequest.snapshot.find(requestData).then(result => {
      return resolve(result.filter((item: any) => item.type === 0));
    });
  }

  handleNodeClick(data: any) {
    this.checkNode = data;
  }

  handleSave() {
    if (this.checkNode) {
      this.screenhotVisible = false;
      const checkNode = this.checkNode || { id: "0" };
      ScreenshotUtil.getHtmlListScreenhot(
        `.chart-component,[id = "#${this.thisDashboard.id}"]`
      ).then(result => {
        if (!result.length) return;
        const requst = {
          parentId: checkNode.id,
          fileName: result[0].title + ".png",
          snapshot: result[0].fullPath
        };
        AxiosRequest.snapshot
          .save(requst)
          .then(result => {
            UIUtil.showMessage("保存成功", MessageType.success);
          })
          .catch(err => UIUtil.showMessage("保存失败", MessageType.error));
      });
    } else {
      UIUtil.showMessage("请选择保存目录", MessageType.warning);
    }
  }

  /**
   * 聚焦按钮
   */
  handleFocus() {
    // 是否存在放大的图表
    const id = this.focusDashboard.id ? "" : this.thisDashboard.id;
    // 放大图表配置
    const nowDashboard = { id } as Dashboard;
    if (!id) {
      // 存在放大图表，再次点击toggle
      this.thisDashboard.visualData = ObjectUtil.copy(
        this.focusDashboard.visualData
      );
    } else {
      const box = document.querySelector("#gridBox") as HTMLElement;
      ObjectUtil.merge(nowDashboard as any, {
        visualData: ObjectUtil.copy(this.thisDashboard.visualData)
      });
      ObjectUtil.merge(this.thisDashboard.visualData as any, {
        width: box.offsetWidth,
        height: box.offsetHeight,
        position: {
          x: 0,
          y: 0
        }
      });
    }
    this.setFocusDashboard(Object.assign(this.focusDashboard, nowDashboard));
  }
}
</script>

<style lang="scss">
.el-popper {
  padding: 0 !important;
  min-width: auto !important;
}

.detail-toolbar-popper {
  z-index: 2000 !important;
}
</style>

<style lang="scss">
.common-toolbar {
  display: flex;
  flex-flow: row nowrap;

  // .tool-btn {
  //   margin: 0 2px;
  //   padding: 4px;
  //   background: transparent;
  //   border: 0;
  //   cursor: pointer;

  //   background: #fff;
  //   border-radius: 50%;

  //   width: 28px;
  //   height: 28px;

  //   &:hover {
  //     background: rgba(0, 0, 0, 0.06);
  //   }

  //   &:active {
  //     background: rgba(0, 0, 0, 0.1);
  //   }

  //   .fa {
  //     color: map-get($colors, "chart");
  //   }
  // }
}
</style>
