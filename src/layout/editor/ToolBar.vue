<template>
  <div class="toolbar">
    <el-tooltip effect="dark" content="保存" placement="right">
      <button class="toolbtn" @click="saveData">
        <i class="fa fa-save"></i>
      </button>
    </el-tooltip>

    <el-tooltip effect="dark" content="选择图表样式" placement="right">
      <button class="toolbtn" @click="showCreateChart = true">
        <i class="fa fa-bar-chart"></i>
      </button>
    </el-tooltip>

    <el-drawer
      title="选择图表样式"
      :visible.sync="showCreateChart"
      direction="ltr"
    >
      <div class="chart-btn-group">
        <el-button
          class="chart-btn simple-btn"
          v-for="(opt, idx) in chartCreateOptions"
          :key="idx"
          :disabled="!opt.enable"
          @click="createChart(opt.createType)"
        >
          <svg class="icon-svg" aria-hidden="true">
            <use :xlink:href="'#' + opt.iconClass"></use>
          </svg>
          <div>{{ opt.title }}</div>
        </el-button>

        <!-- <el-button
          class="chart-btn"
          v-for="(opt, idx) in chartCreateOptions"
          :key="idx"
          :disabled="!opt.enable"
          @click="createChart(opt.createType)"
        >
          <div>
            <i class="gw-icon" :class="opt.iconClass"></i>
          </div>
          <div>{{ opt.title }}</div>
        </el-button> -->
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ChartType } from "@/enums/ChartType";
import { DatasetType } from "@/enums/DatasetType";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import UIUtil, { MessageType } from "@/util/UIUtil";
import { chartCreateOptions } from "@/config/EditorOptions";
import { EditorStore, CommonStore } from "@/store/modules-model";
import DashboardSet from "@/model/view/DashboardSet";
import { AxiosRequest } from "@/config/AxiosRequest";
import { SortType } from "@/enums/SortType";
import { generalDataTemplate } from "@/config/DefaultTemplate";

@Component({
  components: {}
})
export default class ToolBar extends Vue {
  // 创建仪表盘
  @CommonStore.Mutation("createDashboard")
  createDashboard!: Function;

  // 仪表盘集数据
  @CommonStore.State("dashboardSet")
  dashboardSet!: DashboardSet;

  // 仪表盘数据
  @CommonStore.State("dashboards")
  dashboards!: Array<Dashboard>;

  // 仪表盘集ID
  @CommonStore.State("dashboardSetId")
  setId!: string;

  // 打开创建图表抽屉
  showCreateChart: boolean = false;

  // 图表创建选项
  chartCreateOptions = chartCreateOptions;

  /**
   * 创建图表
   */
  createChart(chartType: ChartType): void {
    this.showCreateChart = false;
    setTimeout(() => {
      this.createDashboard(chartType);
    }, 500);
  }

  /**
   * 保存数据
   */
  saveData(): void {
    if (ObjectUtil.isEmptyString(this.setId)) {
      UIUtil.showMessage(
        "仪表盘参数有误 系统无法正常保存数据",
        MessageType.error
      );
      throw "DashboardSetId 不存在";
    }

    Promise.all([this.saveDashboardSet(), this.saveDashboards()])
      .then(() => {
        UIUtil.showMessage("保存成功", MessageType.success);
      })
      .catch(err => {
        console.error(err);
        UIUtil.showMessage("系统保存失败，请稍后重试", MessageType.error);
      });
  }

  /**
   * 保存仪表盘集
   */
  async saveDashboardSet(): Promise<void> {
    let dashboardSet: DashboardSet = ObjectUtil.copy(this.dashboardSet);
    delete dashboardSet.tempParams;

    return await AxiosRequest.dashboardSet.save(this.setId, dashboardSet);
  }

  /**
   * 保存仪表盘集
   */
  async saveDashboards(): Promise<void> {
    let serializedDashboards = ObjectUtil.copy(this.dashboards);

    // 保存前处理
    serializedDashboards.forEach((serializedDashboard: Dashboard) => {
      // 置为默认过滤器配置
      serializedDashboard.analysis.filter = ObjectUtil.copy(
        generalDataTemplate.analysis.filter
      );

      // 置为默认排序配置
      serializedDashboard.analysis.sort = ObjectUtil.copy(
        generalDataTemplate.analysis.sort
      );
    });

    return await AxiosRequest.dashboard.save(this.setId, serializedDashboards);
  }
}
</script>

<style lang="scss" scoped>
// 修复flex布局时，按钮错位问题
.el-button + .el-button {
  margin-left: 0;
}

.chart-btn-group {
  display: flex;
  padding: 0 20px;
  flex: inherit;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;

  .chart-btn {
    flex: 0 0 30%;
    margin-bottom: 15px;

    .fa {
      margin: 8px 4px 12px;
    }

    &.simple-btn {
      border: 1px solid #dcdfe6;
      background-color: #f7f8fa;
      color: #323233;
      transition: background-color 0.3s;

      &:hover {
        background-color: #eef0f4;
      }

      &:active {
        background-color: #e4e8ee;
      }
    }
  }
}

.toolbar {
  margin-top: 10px;

  .toolbtn {
    border: 0;
    height: 40px;
    width: 40px;
    color: #ddd;
    cursor: pointer;
    border-radius: 6px;
    background-color: #555;
    @include select(none);

    &:hover {
      background-color: #444;
    }

    &:active {
      background-color: #333;
    }

    &:focus {
      outline: none;
    }

    & + .toolbtn {
      margin-top: 10px;
    }
  }
}
</style>
