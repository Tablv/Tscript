import {
  AnalysisResults,
  AnalysisResult
} from "glaway-bi-model/types/AnalysisResults";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ReactWhere from "glaway-bi-model/view/ReactWhere";
import DashboardUtil from "./DashboardUtil";
import { SortType } from "glaway-bi-model/enums/SortType";
import FieldDTO from "glaway-bi-model/params/FieldDTO";
import ObjectUtil from "./ObjectUtil";
// import { AxiosRequest } from "@/api/AxiosRequest";
import { AxiosRequest } from "@/api/mock";

export default class ComponentUtil {
  /**
   * 获取数据
   */
  public static async fetchData(
    isSqlEnable: any,
    thisDashboard: Dashboard,
    reactWhere: ReactWhere,
    chartComponent: any
  ): Promise<AnalysisResults> {
    // 判断是否为 SQL
    let fetchPromise: Promise<AnalysisResults> = isSqlEnable
      ? this.fetchSqlData(thisDashboard.staticData.sql.data)
      : this.fetchAnalysisData(thisDashboard as any, reactWhere);
    return fetchPromise
      .then((data: AnalysisResults) => {
        data = this.doCustomOrder(data, thisDashboard);
        return Promise.resolve(data);
      })
      .catch(err => {
        chartComponent.clearChart();
        return Promise.reject(err);
      });
  }

  /**
   * 请求后端，查询 SQL
   * 返回Promise 分析结果
   */
  public static fetchSqlData(sql: string): Promise<any> {
    return AxiosRequest.analysis.fetchSQL(sql);
  }

  /**
   * 请求后端，分析维度度量数据
   * 返回Promise 分析结果
   */
  public static fetchAnalysisData(
    thisDashboard: Dashboard,
    reactWhere: ReactWhere
  ): Promise<AnalysisResults> {
    // 分析参数
    let analysisDTO = DashboardUtil.getAnalysisDTO(thisDashboard as any);
    let tableAlias: string = "";
    if (thisDashboard.analysis.viewName) {
      tableAlias = thisDashboard.analysis.viewName.split(".")[2];
    }

    if (reactWhere.where) {
      reactWhere.where.tableAlias = tableAlias;
    }

    analysisDTO.where.forEach(whe => {
      whe.tableAlias = tableAlias;
    });

    // 判断数据集是否一致
    if (thisDashboard.analysis.datasetId === reactWhere.datasetId) {
      DashboardUtil.pushReactWhere(analysisDTO.where, reactWhere);
    }
    return AxiosRequest.analysis.fetch(analysisDTO);
  }

  /**
   * 自定义排序
   */
  public static doCustomOrder(
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
}
