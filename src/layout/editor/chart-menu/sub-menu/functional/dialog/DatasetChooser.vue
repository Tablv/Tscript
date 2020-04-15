<template>
  <el-dialog
    class="dataset-dialog"
    append-to-body
    :visible.sync="showDatasetChooser"
  >
    <!-- title -->
    <div slot="title">
      <div v-show="showDatasetTree">
        <div class="el-page-header__content">选择数据包</div>
      </div>

      <div v-show="!showDatasetTree">
        <el-page-header @back="showDatasetTree = true" content="选择数据集">
        </el-page-header>
      </div>
    </div>

    <!-- content -->
    <div v-show="showDatasetTree">
      <el-tree
        class="dataset-tree"
        :data="datasetTreeData"
        :props="treeProps"
        @node-click="datasetTreeClick"
      >
      </el-tree>
    </div>

    <div v-show="!showDatasetTree">
      <el-tree
        class="dataset-detail-tree"
        :data="datasetDetailData"
        :props="treeProps"
        @node-click="datasetDetailTreeClick"
      >
      </el-tree>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Model } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { treeConfig } from "@/config/Options";
import Dashboard from "@/model/view/dashboard/Dashboard";
import { DatasetType } from "@/enums/DatasetType";
import TableVO from "@/model/results/TableVO";
import TableInfoVO from "@/model/results/TableInfoVO";
import UIUtil, { MessageType, ConfirmType } from "@/util/UIUtil";
import UUID from "@/util/UUID";
import { AxiosRequest } from "@/config/AxiosRequest";
import ObjectUtil from "@/util/ObjectUtil";

@Component
export default class DatasetChooser extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  // 树设置项
  treeProps = treeConfig;

  /**
   * 数据集部分
   */
  @EditorStore.Action("loadDataset")
  loadDataset!: Function;

  // 是否打开 数据集选择器
  showDatasetChooser = false;

  // 是否显示 数据集树
  //   - true 为树形节点
  //   - false 为具体数据
  showDatasetTree = true;

  // 树形节点数据
  datasetTreeData = [];

  // 具体数据
  datasetDetailData = [];

  /**
   * 选择数据集
   */
  openDatasetChooser(): void {
    // 打开时，展示树
    this.showDatasetTree = true;

    // 加载数据
    UIUtil.showLoading();

    this.loadDatasetTree()
      .then(datasets => {
        // 赋值
        this.datasetTreeData = datasets;

        // 打开Dialog
        this.showDatasetChooser = true;
      })
      .catch(err => {
        UIUtil.showErrorMessage("数据集加载出错");
        console.error(err);
      })
      .finally(() => {
        UIUtil.closeLoading();
      });
  }

  // 点击树节点
  datasetTreeClick(data: any): void {
    // 当选择数据包时，跳转页面
    if (data.type === DatasetType.pack) {
      // 加载提示
      const loadingInstance = UIUtil.showLoading({
        target: ".el-dialog__body"
      });

      // 加载数据
      this.loadDatasetDetailTree(data.id)
        .then(datasetDetails => {
          this.datasetDetailData = datasetDetails;
        })
        .catch(err => {
          UIUtil.showErrorMessage("数据集加载出错");
          console.error(err);
        });

      // 关闭加载提示
      loadingInstance.close();

      // 显示detail
      this.showDatasetTree = false;
    }
  }

  // 点击详情树节点
  datasetDetailTreeClick(data: any): void {
    if (
      ObjectUtil.isEmptyArray(this.currentDashboard.analysis.dimensions) &&
      ObjectUtil.isEmptyArray(this.currentDashboard.analysis.measures)
    ) {
      this.chooseDataset(data);
    } else {
      let chooseConfirm = UIUtil.confirm(
        ConfirmType.warning,
        "选择数据集时，将清空此前拖入的维度和度量字段，请确认是否选择该数据集？",
        "警告"
      );
      chooseConfirm
        .then(() => {
          this.chooseDataset(data);
        })
        .catch(() => {});
    }
  }

  // 加载数据集树
  async loadDatasetTree(): Promise<any> {
    // 置空
    this.datasetTreeData = [];

    // 请求数据集
    return await AxiosRequest.dataset.find();
  }

  // 加载数据集详情
  async loadDatasetDetailTree(groupId: string): Promise<any> {
    // 置空
    this.datasetDetailData = [];

    // 请求数据集详情
    return await AxiosRequest.dataset.findDetail(groupId);
  }

  // 关闭数据集选择器
  closeDatasetChooser(): void {
    this.showDatasetChooser = false;
  }

  // 选择数据集
  chooseDataset(data: any): void {
    // 为对象赋值数据集ID
    this.currentDashboard.analysis.datasetId = data.id;

    // 清空X、Y轴数据
    this.emptyAxisData();

    // 加载数据集
    this.loadDataset();

    // 关闭数据集选择器
    this.closeDatasetChooser();
  }

  /**
   * 加载数据集
   */

  // 清空X、Y轴数据
  emptyAxisData(): void {
    this.currentDashboard.analysis.dimensions = [];
    this.currentDashboard.analysis.measures = [];
  }
}
</script>

<style lang="scss" scoped>
/** 
 * 数据集
 */

$datasetDialogHeight: 70vh;

// Dialog
.dataset-dialog {
  ::v-deep {
    .el-dialog {
      height: $datasetDialogHeight;
      width: 20%;
    }

    .el-dialog__body {
      overflow: auto;
      padding: 20px;
      height: calc(#{$datasetDialogHeight} - 94px);
    }
  }

  .footer-btn-group {
    text-align: right;
  }
}

// Tree
.dataset-tree,
.dataset-detail-tree {
  width: 100%;
  height: 100%;
}
</style>
