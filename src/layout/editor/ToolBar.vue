<template>
  <div class="toolbar">
    <el-tooltip effect="dark" content="保存" placement="right">
      <button class="toolbtn" @click="saveData">
        <i class="fa fa-save"></i>
      </button>
    </el-tooltip>

    <el-tooltip
      effect="dark"
      content="选择图表样式"
      placement="right"
      :manual="true"
    >
      <button class="toolbtn" @click="showCreateChart = true">
        <i class="fa fa-chart-bar"></i>
      </button>
    </el-tooltip>

    <el-tooltip effect="dark" content="文本" placement="right">
      <button
        class="toolbtn"
        draggable="true"
        @dragstart="dragText"
        @dragend="dragendText"
        @mousedown="createChart('text')"
      >
        <i class="fa fa-font"></i>
      </button>
    </el-tooltip>

    <!-- 实际抽屉 -->
    <el-drawer
      title="选择图表样式"
      :visible.sync="showCreateChart"
      direction="ltr"
      size="430px"
      style="po"
    >
      <div class="chart-btn-container">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(opt, idx) in chartCreateOptions" :key="idx">
            <el-button
              class="chart-btn simple-btn"
              :draggable="opt.enable && opt.createType !== 'sunpie'"
              :disabled="!opt.enable || opt.createType === 'sunpie'"
              @mousedown.native="createChart(opt.createType)"
              @dragstart.native="dragstart($event, opt.createType)"
              @dragend.native="dragend"
            >
              <svg class="icon-svg" aria-hidden="true">
                <use :xlink:href="'#' + opt.iconClass" />
              </svg>
              <div class="chart-title">{{ opt.title }}</div>
            </el-button>
          </el-col>
          <el-col
            :span="8"
            v-for="(opt, idx) in withShowOptions"
            :key="idx + 'withs'"
          >
            <el-button
              class="chart-btn simple-btn withs-filter-show"
              :draggable="opt.enable && opt.createType !== 'sunpie'"
              :disabled="!opt.enable || opt.createType === 'sunpie'"
              @mousedown.native="createChart(opt.createType)"
              @dragstart.native="dragstart($event, opt.createType)"
              @dragend.native="dragend"
            >
              <svg class="icon-svg" aria-hidden="true">
                <use :xlink:href="'#' + opt.iconClass" />
              </svg>
              <div class="chart-title">{{ opt.title }}</div>
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ChartType } from "glaway-bi-model/enums/ChartType";
import { DatasetType } from "glaway-bi-model/enums/DatasetType";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ObjectUtil from "@/util/ObjectUtil";
import UIUtil, { MessageType } from "@/util/UIUtil";
import ScreenshotUtil from "@/util/Screenshot";
import { chartCreateOptions } from "@/config/EditorOptions";
import { EditorStore, CommonStore } from "@/store/modules-model";
import DashboardSet from "glaway-bi-model/view/DashboardSet";
import {
  AxiosRequest,
  DashboardSnapshot,
  SaveDashboardSet
} from "@/api/AxiosRequest";
import { SortType } from "glaway-bi-model/enums/SortType";
import { generalDataTemplate } from "glaway-bi-component/src/config/DefaultTemplate";
import { ElLoadingComponent } from "element-ui/types/loading";
import Draggable from "glaway-bi-model/view/Draggable";
import { dragUtil } from "@/util/drag-util";
import { StoryWidget } from "@/types/StoryWidget";

@Component({
  components: {}
})
export default class ToolBar extends Vue {
  // 创建仪表盘
  @CommonStore.Mutation("createDashboard")
  createDashboard!: Function;

  // 创建仪表盘
  @CommonStore.Mutation("createWidget")
  createWidget!: Function;

  // 仪表盘集数据
  @CommonStore.State("dashboardSet")
  dashboardSet!: DashboardSet;

  // 仪表盘数据
  @CommonStore.State("dashboards")
  dashboards!: Array<Dashboard>;

  // 仪表盘集ID
  @CommonStore.State("dashboardSetId")
  setId!: string;

  // 仪表阴影标志
  @CommonStore.State("isShowshadow")
  isShowshadow!: boolean;

  // 仪表阴影风格
  @CommonStore.State("shadowStyle")
  shadowStyle!: Draggable;

  //
  @CommonStore.State("scrollStyle")
  scrollStyle!: {
    scrollLeft: number;
    scrollTop: number;
  };

  // 聚焦图表信息
  @CommonStore.State("focusDashboard")
  focusDashboard!: Dashboard;

  // 仪表阴影风格
  @CommonStore.Mutation("setShowshadow")
  setShowshadow!: Function;

  // 仪表阴影风格
  @CommonStore.Mutation("setShadowStyle")
  setShadowStyle!: Function;

  // 滚动条信息
  @CommonStore.Mutation("setScrollStyle")
  setScrollStyle!: Function;

  // 设置正在保存截图
  @CommonStore.Mutation("setSavingScreenhot")
  setSavingScreenhot!: Function;

  // 打开创建图表抽屉
  showCreateChart: boolean = false;

  // 图表创建选项
  chartCreateOptions = chartCreateOptions;

  createChartType: string = "";

  withShowOptions = [
    // {
    //   enable: false,
    //   createType: "withShow",
    //   iconClass: "gw-iconfsux_tubiao_juxingshutu",
    //   title: "矩形树图"
    // },
    // {
    //   enable: false,
    //   createType: "withShow",
    //   iconClass: "gw-iconfsux_tubiao_qipaotu",
    //   title: "气泡图"
    // },
    // {
    //   enable: false,
    //   createType: "withShow",
    //   iconClass: "gw-iconfsux_tubiao_pubutu",
    //   title: "瀑布图"
    // },
    {
      enable: false,
      createType: "withShow",
      iconClass: "gw-iconfsux_tubiao_shuangzhoutu",
      title: "组合图"
    },
    {
      enable: false,
      createType: "withShow",
      iconClass: "gw-iconfsux_tubiao_biaoge",
      title: "表格"
    },
    {
      enable: false,
      createType: "withShow",
      iconClass: "gw-iconfsux_tubiao_xuritu",
      title: "甘特图"
    },
    {
      enable: false,
      createType: "withShow",
      iconClass: "gw-iconfsux_tubiao_ditu_sandian",
      title: "地图"
    }
  ];

  mounted() {
    const centerBox = document.querySelector(".center") as HTMLDivElement;
    centerBox.addEventListener("scroll", e => {
      this.setScrollStyle({
        scrollLeft: (e.target as HTMLDivElement).scrollLeft,
        scrollTop: (e.target as HTMLDivElement).scrollTop
      });
    });
  }

  createChart(chartType: string): void {
    this.createChartType = chartType;
  }

  /**
   * 创建图表
   */
  dragstart(event: any, chartType: ChartType): void {
    this.showCreateChart = false;
    this.$nextTick(() => {
      event.dataTransfer.setDragImage(new Image(), 0, 0);
      event.dataTransfer.setData("chartType", chartType);
      const bgBox = document.querySelector("#bgBox") as HTMLDivElement;
      const bgBoxLeft = parseInt(bgBox.style.left) || 0,
        bgBoxTop = parseInt(bgBox.style.top) || 0;
      const bgStyle: Draggable = {
        w: 400,
        h: 300,
        x: event.pageX - 84 - 250 - bgBoxLeft + this.scrollStyle.scrollLeft,
        y: event.pageY - 60 - 200 - bgBoxTop + this.scrollStyle.scrollTop,
        z: 1000,
        grid: [10, 10],
        handles: []
      };
      this.setShadowStyle(bgStyle);
      this.setShowshadow(true);
    });
  }

  // 拖拽结束
  dragend(event: any) {
    this.setShowshadow(false);
    // 放到异步微任务，等待数据更新执行创建
    setTimeout(() => {
      const baseConfig = {
        chartType: this.createChartType,
        position: {
          x: Math.round((this.shadowStyle as { x: number }).x / 10) * 10,
          y: Math.round((this.shadowStyle as { y: number }).y / 10) * 10
        }
      };
      this.createDashboard(baseConfig);
      this.setShowshadow(false);
    }, 0);
  }

  /**
   * 保存数据
   */
  saveData(): void {
    new Promise((resolve, reject) => {
      const loading: ElLoadingComponent = this.$loading({
        lock: true,
        text: "正在保存"
      });
      resolve(loading);
    }).then(loading => {
      this.setSavingScreenhot(true);
      this.$nextTick(() => {
        this.getScreenhot(loading as ElLoadingComponent);
      });
    });
  }

  /**
   * 截图
   */
  getScreenhot(loading: ElLoadingComponent) {
    Promise.all([
      ScreenshotUtil.getHtmlScreenhot("#gridBox"),
      ScreenshotUtil.getHtmlListScreenhot(".chart-component")
    ]).then(resultList => {
      if (ObjectUtil.isEmptyString(this.setId)) {
        UIUtil.showMessage(
          "仪表盘参数有误 系统无法正常保存数据",
          MessageType.error
        );
        throw "DashboardSetId 不存在";
      }

      this.saveDashboards(resultList)
        .then(() => {
          UIUtil.showMessage("保存成功", MessageType.success);
        })
        .catch(err => {
          console.error(err);
          UIUtil.showMessage("系统保存失败，请稍后重试", MessageType.error);
        })
        .finally(() => {
          this.setSavingScreenhot(false);
          this.$nextTick(() => {
            UIUtil.closeLoading(loading);
          });
        });
    });
  }

  /**
   * 保存接口
   */
  async saveDashboards(
    resultList: Array<string | Array<DashboardSnapshot>>
  ): Promise<void> {
    let [containerSnapshot, dashboardSnapshots] = resultList;

    // 保存前处理
    let serializedDashboards = this.setTemplateDashboard(
      ObjectUtil.copy(this.dashboards)
    );

    // 仪表盘集
    let dashboardSet: DashboardSet = ObjectUtil.copy(this.dashboardSet);
    delete dashboardSet.tempParams;

    const saveResult: SaveDashboardSet = {
      setId: this.setId,
      dashboardSet,
      dashboards: serializedDashboards,
      containerSnapshot: containerSnapshot as string,
      dashboardSnapshots: dashboardSnapshots as Array<DashboardSnapshot>
    };

    return await AxiosRequest.dashboardSet.save(saveResult);
  }

  /**
   * 特殊处理一些数据
   */
  setTemplateDashboard(
    serializedDashboards: Array<Dashboard>
  ): Array<Dashboard> {
    serializedDashboards.forEach((serializedDashboard: any) => {
      if (!serializedDashboard.analysis) {
        serializedDashboard.analysis = serializedDashboard.config;
        return;
      }
      // 合并分析数据
      Object.assign(
        serializedDashboard.analysis,
        serializedDashboard.tableView
      );

      // 置为默认过滤器配置
      serializedDashboard.analysis.filter = ObjectUtil.copy(
        generalDataTemplate.analysis.filter
      );

      // 置为默认排序配置
      serializedDashboard.analysis.sort = ObjectUtil.copy(
        generalDataTemplate.analysis.sort
      );

      // 置为默认排名配置
      serializedDashboard.analysis.limit = ObjectUtil.copy(
        generalDataTemplate.analysis.limit
      );

      // 置为无聚焦状态
      if (
        this.focusDashboard.id &&
        serializedDashboard.id === this.focusDashboard.id
      ) {
        serializedDashboard.visualData = ObjectUtil.copy(
          this.focusDashboard.visualData
        );
      }
    });
    return serializedDashboards;
  }

  dragendText() {
    this.setShowshadow(false);
    // 放到异步微任务，等待数据更新执行创建
    setTimeout(() => {
      const baseConfig = {
        chartType: this.createChartType,
        position: {
          x: Math.round((this.shadowStyle as { x: number }).x / 10) * 10,
          y: Math.round((this.shadowStyle as { y: number }).y / 10) * 10
        }
      };
      // this.createDashboard(baseConfig);
      this.createWidget(baseConfig);
      this.setShowshadow(false);
    }, 0);
  }

  dragText(event: any) {
    // dragUtil.putText(event);
    event.dataTransfer.setDragImage(new Image(), 0, 0);
    event.dataTransfer.setData("chartType", "text");
    const bgBox = document.querySelector("#bgBox") as HTMLDivElement;
    const bgBoxLeft = parseInt(bgBox.style.left) || 0,
      bgBoxTop = parseInt(bgBox.style.top) || 0;
    const bgStyle: Draggable = {
      w: 400,
      h: 300,
      x: event.pageX - 84 - 250 - bgBoxLeft + this.scrollStyle.scrollLeft,
      y: event.pageY - 60 - 100 - bgBoxTop + this.scrollStyle.scrollTop,
      z: 1000,
      grid: [10, 10],
      handles: []
    };
    this.setShadowStyle(bgStyle);
    this.setShowshadow(true);
  }
}
</script>

<style lang="scss" scoped>
// 修复flex布局时，按钮错位问题
.el-button + .el-button {
  margin-left: 0;
}

.chart-btn-container {
  padding: 0 20px;
  .withs-filter-show {
    filter: grayscale(100%);
  }
  .chart-btn {
    margin-bottom: 15px;
    width: 100%;
    min-width: 80px;
    min-height: 80px;
    cursor: move;

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

    .chart-title {
      @include oneLineNowrap;
    }
  }
}

.toolbar {
  .toolbtn {
    border: 0;
    height: 84px;
    width: 83px;
    color: #666;
    font-size: 22px;
    background: #f1f3f6;
    cursor: pointer;
    @include select(none);

    &:hover {
      background-color: #e6e9ec;
    }

    &:active {
      background-color: #e6e9ec;
    }

    &:focus {
      outline: none;
    }
  }
}
</style>
