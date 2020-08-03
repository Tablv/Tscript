<template>
  <div class="toolbar">
    <el-tooltip effect="dark" content="保存" placement="right">
      <button class="toolbtn" @click="saveData">
        <i class="fa fa-save"></i>
      </button>
    </el-tooltip>

    <el-tooltip effect="dark" content="选择图表样式" placement="right">
      <button class="toolbtn" @click="showCreateChart = true">
        <i class="fa fa-chart-bar"></i>
      </button>
    </el-tooltip>

    <el-tooltip effect="dark" content="选择扩展组件" placement="right">
      <button class="toolbtn" @click="showCreateExternal = true">
        <i class="fa fa-dice-d6"></i>
      </button>
    </el-tooltip>

    <!-- 图表抽屉 -->
    <el-drawer
      title="选择图表样式"
      :visible.sync="showCreateChart"
      direction="ltr"
      size="430px"
    >
      <div class="drawer-btn-container">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(opt, idx) in chartCreateOptions" :key="idx">
            <el-button
              class="drawer-btn simple-btn"
              :draggable="opt.enable && opt.createType !== 'sunpie'"
              :disabled="!opt.enable || opt.createType === 'sunpie'"
              @mousedown.native="createChart(opt.createType)"
              @dragstart.native="handleChartDragStart($event, opt.createType)"
              @dragend.native="handleChartDragEnd"
            >
              <svg class="icon-svg" aria-hidden="true">
                <use :xlink:href="'#' + opt.iconClass" />
              </svg>
              <div class="chart-title">{{ opt.title }}</div>
            </el-button>
          </el-col>

          <!-- 仅展示 选项 -->
          <el-col
            :span="8"
            v-for="(opt, idx) in withShowOptions"
            :key="idx + 'withs'"
          >
            <el-button
              class="drawer-btn simple-btn withs-filter-show"
              :draggable="opt.enable && opt.createType !== 'sunpie'"
              :disabled="!opt.enable || opt.createType === 'sunpie'"
              @mousedown.native="createChart(opt.createType)"
              @dragstart.native="handleChartDragStart($event, opt.createType)"
              @dragend.native="handleChartDragEnd"
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

    <!-- 组件抽屉 -->
    <el-drawer
      title="选择扩展组件"
      :visible.sync="showCreateExternal"
      direction="ltr"
      size="430px"
    >
      <div class="drawer-btn-container">
        <el-row :gutter="20">
          <el-col
            :span="8"
            v-for="(opt, idx) in externalCreateOptions"
            :key="idx"
          >
            <el-button
              class="drawer-btn simple-btn"
              :draggable="opt.enable"
              :disabled="!opt.enable"
              @mousedown.native="createExternal(opt.type)"
              @dragstart.native="handleExternalDragStart($event, opt.type)"
              @dragend.native="handleExternalDragEnd"
            >
              <i class="icon-class" :class="opt.iconClass" />
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
import { DashWidget } from "@/types/DashWidget";
import { WidgetType } from "@/config/WidgetType";

@Component({
  components: {}
})
export default class AsideToolBar extends Vue {
  // 创建仪表盘
  @CommonStore.Mutation("createDashboard")
  createDashboard!: Function;

  // 创建组件
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
  showCreateChart = false;

  // 打开创建组件抽屉
  showCreateExternal = false;

  // 图表创建选项
  chartCreateOptions = chartCreateOptions;

  // 组件创建选项
  externalCreateOptions = [
    {
      iconClass: "fa fa-font",
      title: "文本",
      type: WidgetType.TEXT_AREA,
      enable: true
    },
    {
      iconClass: "fa fa-image",
      title: "图片",
      type: WidgetType.IMAGE,
      enable: true
    },
    {
      iconClass: "fa fa-dice-d20",
      title: "外部页面",
      type: WidgetType.EXTERNAL_PAGE,
      enable: false
    },
    {
      iconClass: "fa fa-code",
      title: "HTML 片段",
      type: WidgetType.HTML_PHRASE,
      enable: false
    }
  ];

  createChartType!: ChartType;
  createWidgetType!: WidgetType;

  withShowOptions = [
    // {
    //   enable: false,
    //   createChartType: "withShow",
    //   iconClass: "gw-iconfsux_tubiao_juxingshutu",
    //   title: "矩形树图"
    // },
    // {
    //   enable: false,
    //   createChartType: "withShow",
    //   iconClass: "gw-iconfsux_tubiao_qipaotu",
    //   title: "气泡图"
    // },
    // {
    //   enable: false,
    //   createChartType: "withShow",
    //   iconClass: "gw-iconfsux_tubiao_pubutu",
    //   title: "瀑布图"
    // },
    {
      enable: false,
      createType: "withShow",
      iconClass: "gw-iconfsux_tubiao_shuangzhoutu",
      title: "组合图"
    }
    // {
    //   enable: false,
    //   createType: "withShow",
    //   iconClass: "gw-iconfsux_tubiao_biaoge",
    //   title: "表格"
    // },
    // {
    //   enable: false,
    //   createType: "withShow",
    //   iconClass: "gw-iconfsux_tubiao_xuritu",
    //   title: "甘特图"
    // },
    // {
    //   enable: false,
    //   createType: "withShow",
    //   iconClass: "gw-iconfsux_tubiao_ditu_sandian",
    //   title: "地图"
    // }
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

  createChart(chartType: ChartType) {
    this.createChartType = chartType;
  }

  createExternal(widgetType: WidgetType) {
    this.createWidgetType = widgetType;
  }

  /**
   * 创建图表
   */
  handleChartDragStart(event: any, chartType: ChartType) {
    this.createChartType = chartType;
    this.showCreateChart = false;
    this._handleDragStart(event);
  }

  handleChartDragEnd(event: DragEvent) {
    this._handleDragEnd(event).then(() => {
      const baseConfig = {
        chartType: this.createChartType,
        position: this._getDraggedPosition()
      };
      this.createDashboard(baseConfig);
    });
  }

  /**
   * 创建外部扩展组件
   */
  handleExternalDragStart(event: DragEvent, widgetType: WidgetType) {
    this.createWidgetType = widgetType;
    this.showCreateExternal = false;
    this._handleDragStart(event);
  }

  handleExternalDragEnd(event: DragEvent) {
    this._handleDragEnd(event).then(() => {
      const baseConfig = {
        type: this.createWidgetType,
        position: this._getDraggedPosition()
      };
      this.createWidget(baseConfig);
    });
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
    let {
      serializedDashboards,
      serializedDashWidget
    } = this.setTemplateDashboard(ObjectUtil.copy(this.dashboards));

    // 仪表盘集
    let dashboardSet: DashboardSet = ObjectUtil.copy(this.dashboardSet);
    delete dashboardSet.tempParams;

    const saveResult: SaveDashboardSet = {
      setId: this.setId,
      dashboardSet,
      dashboards: serializedDashboards,
      containerSnapshot: containerSnapshot as string,
      dashboardSnapshots: dashboardSnapshots as Array<DashboardSnapshot>,
      extComponents: serializedDashWidget
    };

    return await AxiosRequest.dashboards.save(saveResult);
  }

  typeMap = new Map<string, number>([
    ["text", 1],
    ["img", 4]
  ]);

  /**
   * 特殊处理一些数据
   */
  setTemplateDashboard(
    dashboards: Array<any>
  ): {
    serializedDashboards: Array<Dashboard>;
    serializedDashWidget: Array<DashWidget<any>>;
  } {
    const serializedDashboards: Array<Dashboard> = [];
    const serializedDashWidget: Array<DashWidget<any>> = [];
    dashboards.forEach((serialized: any) => {
      if (serialized.type || serialized.config) {
        if (isNaN(parseInt(serialized.type))) {
          serialized.type = this.typeMap.get(serialized.type);
        }
        serialized.containerId = this.setId;
        serializedDashWidget.push(serialized);
      } else {
        // 合并分析数据
        Object.assign(serialized.analysis, serialized.tableView);

        // 置为默认过滤器配置
        serialized.analysis.filter = ObjectUtil.copy(
          generalDataTemplate.analysis.filter
        );

        // 置为默认排序配置
        serialized.analysis.sort = ObjectUtil.copy(
          generalDataTemplate.analysis.sort
        );

        // 置为默认排名配置
        serialized.analysis.limit = ObjectUtil.copy(
          generalDataTemplate.analysis.limit
        );
        serializedDashboards.push(serialized);
      }
    });
    return {
      serializedDashboards,
      serializedDashWidget
    };
  }

  /**
   * 通用开始拖动处理方法
   */
  _handleDragStart(event: DragEvent) {
    event.dataTransfer?.setDragImage(new Image(), 0, 0);
    event.dataTransfer?.setData(
      "widgetType",
      this.createChartType || this.createWidgetType
    );
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
    this.$nextTick(() => {
      this.setShadowStyle(bgStyle);
      this.setShowshadow(true);
    });
  }

  /**
   * 通用结束拖动处理方法
   */
  _handleDragEnd(event: DragEvent): Promise<void> {
    // 放到异步微任务，等待数据更新执行创建
    return new Promise(resolve => {
      this.setShowshadow(false);
      resolve();
    });
  }

  /**
   * 通用获取拖动位置方法
   */
  _getDraggedPosition() {
    return {
      x: Math.round((this.shadowStyle as { x: number }).x / 10) * 10,
      y: Math.round((this.shadowStyle as { y: number }).y / 10) * 10
    };
  }
}
</script>

<style lang="scss" scoped>
// 修复flex布局时，按钮错位问题
.el-button + .el-button {
  margin-left: 0;
}

.drawer-btn-container {
  padding: 0 20px;
  overflow-y: auto;

  .withs-filter-show {
    filter: grayscale(100%);
  }
  .drawer-btn {
    margin-bottom: 15px;
    width: 100%;
    min-width: 80px;
    min-height: 80px;
    cursor: move;

    .icon-class {
      margin: 8px 4px 12px;
      font-size: 28px;
      color: #706ee7;
    }

    &.simple-btn:not([disabled]) {
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
  .dragbutton {
    cursor: move !important;
  }
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
