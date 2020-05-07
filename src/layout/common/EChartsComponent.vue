<template>
  <div class="chart-wrapper">
    <div class="chart-container" ref="echartsContainer"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import echarts from "echarts";
import EChartsService, {
  reactUpdate,
  fetchAnalysisData,
  bindEvents,
  renderChart,
  renderChartByJSON,
  fetchSqlData
} from "@/service/EChartsService";
import { CommonStore } from "@/store/modules-model";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ChartUIService from "@/service/interfaces/ChartUIService";
import EChartsOption from "@/model/view/dashboard/EChartsOption";
import AnalysisData from "@/model/view/dashboard/AnalysisData";
import EventsConfig from "@/model/view/dashboard/EventsConfig";
import ReactWhere from "@/model/view/ReactWhere";
import { generalMenuOptions } from "@/config/MenuOptions";
import UUID from "@/util/UUID";
import EChartsUtil from "@/util/EChartsUtil";
import UIUtil from "@/util/UIUtil";
import ObjectUtil from "@/util/ObjectUtil";
import { SortType } from "@/enums/SortType";
import FieldDTO from "@/model/params/FieldDTO";
import { AnalysisResult, AnalysisResults } from "@/model/types/AnalysisResults";

@Component
export default class EChartsComponent extends Vue implements ChartUIService {
  // 仪表盘
  @CommonStore.State("dashboards")
  dashboards!: Array<Dashboard>;

  // 图表数据及所在下标
  @Prop()
  item!: Dashboard;

  // 联动数据
  @CommonStore.State("reactWhere")
  reactWhere!: ReactWhere;

  // 设置联动
  @CommonStore.Mutation("setReactWhere")
  setReact!: Function;

  // 图表实例
  // echartsInstance: echarts.ECharts | null = null;

  /**
   * Getter
   */
  get thisDashboard(): Dashboard {
    return this.item;
  }

  get thisAnalysis(): AnalysisData {
    return this.thisDashboard.analysis;
  }

  get isJsonEnable(): boolean {
    return this.thisDashboard.staticData.json.enable;
  }

  get isSqlEnable(): boolean {
    return this.thisDashboard.staticData.sql.enable;
  }

  get isStaticData(): boolean {
    return this.isJsonEnable || this.isSqlEnable;
  }

  /**
   * 接口实现方法
   */

  /**
   * 初始化
   */
  public initChart(): void {
    // 存在实例时，忽略初始化
    if (!this.$data.echartsInstance) {
      let echartsContainer = this.$refs.echartsContainer as HTMLDivElement;
      this.$data.echartsInstance = EChartsUtil.init(echartsContainer);
    }
  }

  /**
   * 销毁
   */
  public destoryChart(): void {
    EChartsUtil.destroy(this.$data.echartsInstance);
    this.$data.echartsInstance = null;
  }

  /**
   * 清空
   */
  public clearChart(): void {
    EChartsUtil.clear(this.$data.echartsInstance);
  }

  /**
   * 调整尺寸
   */
  public resizeChart(): void {
    if (this.$data.echartsInstance) {
      EChartsUtil.resize(this.$data.echartsInstance);
    }
  }

  /**
   * 绑定事件
   */
  public bindChartEvents(clearEvent: boolean, thisEvents: EventsConfig): void {
    // 事件选项
    let eventSelection = clearEvent
        ? generalMenuOptions.events.method.selection
        : null,
      triggerCallback = this.getEventMethod(thisEvents);

    // 绑定事件
    triggerCallback &&
      this.$data.echartsInstance &&
      bindEvents(
        this.$data.echartsInstance, // 实例
        thisEvents, // 事件配置
        triggerCallback, // 回调方法
        this, // 回调上下文
        eventSelection // 清空此前触发方法
      );
  }

  /**
   * 绘制图表
   */
  public renderChart(): void {
    // JSON 配置
    let JSONConfig = this.thisDashboard.staticData.json;

    if (!this.$data.echartsInstance) {
      this.initChart();
    }

    if (!this.$data.echartsInstance) {
      UIUtil.showErrorMessage("初始化图表出错");
      return;
    }

    // 绘制 JSON 静态数据
    if (JSONConfig.enable) {
      renderChartByJSON(this.$data.echartsInstance, JSONConfig.data).catch(
        err => {
          UIUtil.showErrorMessage("解析 JSON 出错，请检查格式");
        }
      );
    } else {
      renderChart(this.$data.echartsInstance, this.thisDashboard)
        .then(result => {})
        .catch(err => {
          console.error(err);
        });
    }
  }

  /**
   * 获取数据
   */
  public async fetchData(): Promise<AnalysisResults> {
    // 判断是否为 SQL
    let fetchPromise: Promise<AnalysisResults> = this.isSqlEnable
      ? fetchSqlData(this.thisDashboard.staticData.sql.data)
      : fetchAnalysisData(this.thisDashboard, this.reactWhere);

    return await fetchPromise
      .then((data: AnalysisResults) => {
        data = this.doCustomOrder(data, this.thisDashboard);
        return Promise.resolve(data);
      })
      .catch(err => {
        this.clearChart();
        return Promise.reject(err);
      });
  }

  /**
   * 私有方法
   */

  /**
   * 自定义排序
   */
  private doCustomOrder(
    dataArray: AnalysisResults,
    dashboard: Dashboard
  ): AnalysisResults {
    let sort = dashboard.analysis.sort;
    if (sort.type !== SortType.customOrder) return dataArray;

    // 复制数组
    dataArray = ObjectUtil.copy(dataArray);
    // 排序后的数组
    let sortedData: AnalysisResults = [],
      fieldAlias: Array<string> = dashboard.analysis.dimensions.flatMap(
        (fieldDTO: FieldDTO) => fieldDTO.alias
      );

    /**
     * 符合排序要求的存入 sortedData
     * 其他存入 tempData 待遍历完成后一并存入 sortedData
     */
    sort.custom.map((fieldValue: string) => {
      for (let i = 0; i < dataArray.length; i++) {
        let data: AnalysisResult = dataArray[i];

        fieldAlias.map((columnName: string) => {
          if (
            data.hasOwnProperty(columnName) &&
            data[columnName] === fieldValue
          ) {
            sortedData.push(ObjectUtil.copy(data));
            // 复制后 删除源数组对应的值
            dataArray.splice(i--, 1);
          }
        });
      }
    });

    // 排序的数组 与剩余值的数组合并 返回新数组
    return sortedData.concat(dataArray);
  }

  /**
   * 获取事件回调方法
   */
  private getEventMethod(eventsConfig: EventsConfig): Function | null {
    return this.eventMethod[eventsConfig.triggerEvent] || null;
  }

  /**
   * 事件方法回调
   */
  private eventMethod: any = {
    /**
     * 联动
     */
    // react(EChartsParams: any, thisContext: EChartsComponent) {
    react(echartsParams: any) {
      let thisContext = this;
      let reactWhere = {
        dashboardId: thisContext.thisDashboard.id,
        datasetId: thisContext.thisAnalysis.datasetId,
        where: {
          id: UUID.generate(),
          tableAlias: thisContext.thisAnalysis.dimensions[0].tableAlias,
          columnName: thisContext.thisAnalysis.dimensions[0].columnName,
          w: [
            {
              type: 1,
              value: echartsParams.name
            }
          ]
        }
      };
      thisContext.setReact(reactWhere);
    },

    /**
     * 弹框
     */
    pop(echartsParams: any, thisContext: EChartsComponent) {},

    /**
     * 穿透(跳转页面)
     */
    jump(echartsParams: any, thisContext: EChartsComponent) {}
  };
}
</script>

<style lang="scss">
.chart-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;

  .chart-container {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
</style>
