import { AxiosRequest } from "@/config/AxiosRequest";
import { Properties } from "csstype";
import JoinRelation from "@/model/params/JoinRelation";
import TableVO from "@/model/results/TableVO";
import DashboardSet from "@/model/view/DashboardSet";
import { ChartType } from "@/enums/ChartType";
import Dashboard from "@/model/view/dashboard/Dashboard";
import UUID from "./UUID";
import DefaultTemplate from "@/config/DefaultTemplate";
import TableInfoVO from "@/model/results/TableInfoVO";
import AnalysisDTO from "@/model/params/AnalysisDTO";
import FieldDTO, { FieldDTOBuilder } from "@/model/params/FieldDTO";
import WhereDTO from "@/model/params/WhereDTO";
import ReactWhere from "@/model/view/ReactWhere";
import ObjectUtil from "./ObjectUtil";
import { BackgroundType } from "@/enums/DashboardSet";
import OrderDTO from "@/model/params/OrderDTO";
import { AnalysisResult } from "@/model/types/AnalysisResults";

export default class DashboardUtil {
  /**
   * 根据配置，获取初始化数据
   *
   */
  public static getInitDashboard(
    currentLength: number,
    type: ChartType
  ): Dashboard | undefined {
    // 根据模板创建出来的数据
    let templateData = DefaultTemplate.getInitData(type);
    if (templateData === undefined) {
      console.error("Template Not Found...");
      return undefined;
    }

    // 对模板对象进行深拷贝
    let createdData: Dashboard = JSON.parse(JSON.stringify(templateData));

    // 创建默认配置项
    createdData.id = UUID.generate();
    createdData.visualData.position = {
      x: currentLength * 10,
      y: currentLength * 10,
      z: currentLength
    };

    return createdData;
  }

  /**
   * 获取仪表盘集样式属性
   *
   * @param dashboardSet 仪表盘集配置
   */
  public static getDashboardSetStyle(dashboardSet: DashboardSet): Properties {
    let style: Properties = {};

    switch (dashboardSet.canvasSetting.background.type) {
      case BackgroundType.color:
        style = {
          backgroundColor: dashboardSet.canvasSetting.background.color
        };
        break;
      case BackgroundType.picture:
        style = {
          background: `url("${dashboardSet.canvasSetting.background.url}") no-repeat`,
          backgroundSize: "100%"
        };
        break;
    }

    return style;
  }

  /**
   * 获取分析对象
   *
   * @param currentDashboard 当前仪表盘
   */
  public static getAnalysisDTO(currentDashboard: Dashboard): AnalysisDTO {
    let fromDTO = currentDashboard.analysis.fromTable
        ? {
            schema: currentDashboard.analysis.fromTable.schema,
            tableName: currentDashboard.analysis.fromTable.name,
            alias: currentDashboard.analysis.fromTable.alias
          }
        : null,
      analysisDTO: AnalysisDTO = {
        dashboardId: currentDashboard.id,
        from: fromDTO,
        join: currentDashboard.analysis.joinRelation,
        fields: [],
        where: currentDashboard.analysis.where,
        order: []
      };

    // 拷贝分析DTO
    analysisDTO = ObjectUtil.copy(analysisDTO);

    // 追加维度、度量数据
    DashboardUtil.pushFieldDTO(
      analysisDTO.fields,
      currentDashboard.analysis.dimensions
    );
    DashboardUtil.pushFieldDTO(
      analysisDTO.fields,
      currentDashboard.analysis.measures
    );

    // 追加过滤
    DashboardUtil.pushWhereDTO(
      analysisDTO.where,
      currentDashboard.analysis.filter.data
    );

    // 追加排序
    DashboardUtil.pushOrderDTO(
      analysisDTO.order,
      currentDashboard.analysis.sort.data
    );

    return analysisDTO;
  }

  /**
   * 获取字段所有值
   *
   * @param dashboard 仪表盘
   * @param tableInfo 表字段VO
   */
  public static async fetchFieldValues(
    dashboard: Dashboard,
    tableInfo: TableInfoVO
  ): Promise<Array<string>> {
    let fetchValuesDTO = this.getFetchValuesDTO(
      dashboard.analysis.fromTable as TableVO,
      dashboard.analysis.joinRelation,
      tableInfo
    );
    return await AxiosRequest.analysis
      .fetch(fetchValuesDTO)
      .then(result => {
        // 返回结果为空 直接返回
        if (ObjectUtil.isEmptyArray(result)) {
          return Promise.resolve(new Array());
        }

        // 获取返回的字段 Key
        let fieldName: string | null = null;

        if (result[0].hasOwnProperty(tableInfo.columnName)) {
          fieldName = tableInfo.columnName;
        } else if (result[0].hasOwnProperty(tableInfo.alias)) {
          fieldName = tableInfo.alias;
        }

        // 字段 Key 不为空
        if (!ObjectUtil.isEmpty(fieldName)) {
          let valueArray = result.flatMap(
            (keyValue: AnalysisResult) => keyValue[fieldName as string]
          );

          return Promise.resolve(valueArray);
        }

        // 为空 获取值失败
        return Promise.reject("获取字段所有值失败");
      })
      .catch(err => Promise.reject(err));
  }

  /**
   * 追加字段
   *
   * @param whereArray DTO源数组
   * @param reactWhere 联动条件
   */
  public static pushReactWhere(
    whereArray: Array<WhereDTO>,
    reactWhere: ReactWhere
  ): void {
    if (reactWhere.dashboardId && reactWhere.datasetId && reactWhere.where) {
      // 获取联动判断条件
      // const reactId = reactWhere.where.tableAlias + "#" + reactWhere.where.columnName;
      const reactId = reactWhere.where.columnName;

      for (let i = 0; i < whereArray.length; i++) {
        const whereDTO = whereArray[i];

        // if(whereDTO.tableAlias + "#" + whereDTO.columnName === reactId) {
        if (whereDTO.columnName === reactId) {
          whereArray.splice(i--, 1);
        }
      }

      whereArray.push(reactWhere.where);
    }
  }

  /**
   * 追加字段
   *
   * @param fieldTarget DTO源数组
   * @param fieldSources 字段数据数组
   */
  public static pushFieldDTO(
    fieldTarget: Array<FieldDTO>,
    fieldSources: Array<FieldDTO>
  ): void {
    fieldSources.forEach(fieldSource => {
      let fieldDTO = ObjectUtil.copy(fieldSource);

      fieldDTO.group = (fieldTarget.length + 1) * 10;

      fieldTarget.push(fieldDTO);
    });
  }

  /**
   * 追加条件
   *
   * @param whereTarget DTO源数组
   * @param whereSources 条件数据数组
   */
  public static pushWhereDTO(
    whereTarget: Array<WhereDTO>,
    whereSources: Array<WhereDTO>
  ): void {
    whereSources.forEach(where => {
      let whereDTO = ObjectUtil.copy(where);
      whereTarget.push(whereDTO);
    });
  }

  /**
   * 追加条件
   *
   * @param orderTarget DTO源数组
   * @param orderSources 条件数据数组
   */
  public static pushOrderDTO(
    orderTarget: Array<OrderDTO>,
    orderSources: Array<OrderDTO>
  ): void {
    orderSources.forEach(order => {
      let orderDTO = ObjectUtil.copy(order);
      orderTarget.push(orderDTO);
    });
  }

  /**
   * tableInfo 转 analysisDTO
   */
  public static getFetchValuesDTO(
    fromTable: TableVO,
    joinRelations: Array<JoinRelation>,
    tableInfo: TableInfoVO
  ): AnalysisDTO {
    let fieldDTO = FieldDTOBuilder.buildFieldDTO(tableInfo),
      analysisDTO: AnalysisDTO = {
        dashboardId: "",
        from: {
          schema: fromTable.schema,
          tableName: fromTable.name,
          alias: fromTable.alias
        },
        join: joinRelations,
        fields: [],
        where: [],
        order: []
      };

    // 字段追加去重
    fieldDTO.func = ["distinct"];

    // 加入过滤DTO
    analysisDTO.fields.push(fieldDTO);

    return analysisDTO;
  }
}
