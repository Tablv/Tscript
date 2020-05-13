<template>
  <el-popover
    v-model="chooserVisible"
    placement="bottom-end"
    width="400"
    trigger="click"
    @show="onChooserOpen"
  >
    <el-button type="text" slot="reference">
      <i class="fa fa-cog"></i>
    </el-button>

    <div class="dataset-tree-box">
      <el-tree
        :data="datasetTreeData"
        :props="treeProps"
        @node-click="datasetTreeClick"
      >
      </el-tree>
    </div>

  </el-popover>
</template>

<script lang="ts">
import { Component, Vue, Model } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { treeConfig } from "@/config/CommonOptions";
import Dashboard from "@/model/view/dashboard/Dashboard";
import DatasetGroupVO from "@/model/results/DatasetGroupVO";
import { DatasetType } from "@/enums/DatasetType";
import TableVO from "@/model/results/TableVO";
import TableInfoVO from "@/model/results/TableInfoVO";
import UIUtil, { MessageType, ConfirmType } from "@/util/UIUtil";
import UUID from "@/util/UUID";
import { AxiosRequest } from "@/api/AxiosRequest";
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
  @EditorStore.Action("loadTables")
  loadTables!: Function;

  // 是否打开 数据集选择器
  chooserVisible = false;

  // 数据集
  datasetData: Array<DatasetGroupVO> = [];

  get datasetTreeData(): any {
    // 转为树结构
    return this.datasetData
      .filter((dataset: DatasetGroupVO) => dataset.parentId === "0")
      .map((datasetPack: DatasetGroupVO) => {
        const children = this.datasetData.filter((childDataset: DatasetGroupVO) => childDataset.parentId === datasetPack.id);

        datasetPack.children = children.length ? children : [];
        return datasetPack;
      });
  }

  /**
   * 数据集打开事件
   */
  onChooserOpen(): void {
    // 重置数据集
    this.datasetData = [];

    // 加载提示
    const loadingInstance = UIUtil.showLoading({
      target: ".dataset-tree-box"
    });

    this.loadTablesTree()
      .catch(err => {
        UIUtil.showErrorMessage("数据集加载出错");
        console.error(err);
      })
      .finally(() => {
        // 关闭加载提示
        loadingInstance.close();
      });
  }

  // 点击树节点
  datasetTreeClick(dataset: DatasetGroupVO): void {
    // 当选择数据包时，跳转页面
    if (dataset.type === DatasetType.data) {
      // 加载数据
      this.datasetDetailTreeClick(dataset);
    }
  }

  // 点击具体数据集
  datasetDetailTreeClick(dataset: DatasetGroupVO): void {
    if (
      ObjectUtil.isEmptyArray(this.currentDashboard.analysis.dimensions) &&
      ObjectUtil.isEmptyArray(this.currentDashboard.analysis.measures)
    ) {
      this.chooseDataset(dataset);
    } else {
      UIUtil.confirm(
        ConfirmType.warning,
        "选择数据集时，将清空此前拖入的维度和度量字段，请确认是否选择该数据集？",
        "警告"
      )
        .then(() => {
          this.chooseDataset(dataset);
        })
        .catch(() => {});
    }
  }

  // 加载数据集树
  loadTablesTree(): Promise<any> {
    // 请求数据集
    return AxiosRequest.dataset.findGroup().then((datasets: Array<DatasetGroupVO>) => {
      this.datasetData = datasets;
    });
  }

  // 关闭数据集选择器
  closeDatasetChooser(): void {
    this.chooserVisible = false;
  }

  // 选择数据集
  async chooseDataset(datasetGroup: DatasetGroupVO) {
debugger
    const dataset = await AxiosRequest.dataset.find(datasetGroup.id);

    this.currentDashboard.analysis.datasetId = dataset.id;

    // 清空X、Y轴数据
    this.emptyAxisData();

    // 加载提示
    const loadingInstance = UIUtil.showLoading({
      target: ".dataset-tree-box"
    });

    // 加载数据集
    this.loadTables()
      .then(() => {
        // 关闭数据集选择器
        this.closeDatasetChooser();
      })
      .catch((err: Error) => {
        UIUtil.showErrorMessage("加载数据集失败");
        console.error(err);
      })
      .finally(() => {
        // 关闭加载提示
        loadingInstance.close();
      });

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
.dataset-tree-box {
  padding: 10px;
}
</style>
