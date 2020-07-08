import { AxiosRequest } from "@/api/AxiosRequest";
import { Properties } from "csstype";
import JoinRelation, {
  TableRelation
} from "glaway-bi-model/params/JoinRelation";
import DashboardSet from "glaway-bi-model/view/DashboardSet";
import { ChartType } from "glaway-bi-model/enums/ChartType";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import UUID from "./UUID";
import DefaultTemplate from "glaway-bi-component/src/config/DefaultTemplate";
import TableInfoVO from "glaway-bi-model/results/TableInfoVO";
import AnalysisDTO from "glaway-bi-model/params/AnalysisDTO";
import FieldDTO, { FieldDTOBuilder } from "glaway-bi-model/params/FieldDTO";
import WhereDTO from "glaway-bi-model/params/WhereDTO";
import ReactWhere from "glaway-bi-model/view/ReactWhere";
import ObjectUtil from "./ObjectUtil";
import { BackgroundType } from "glaway-bi-model/enums/DashboardSet";
import OrderDTO from "glaway-bi-model/params/OrderDTO";
import { AnalysisResult } from "glaway-bi-model/types/AnalysisResults";
import LimitDTO from "glaway-bi-model/params/LimitDTO";
import TableView from "glaway-bi-model/view/dashboard/TableView";

export default class DashboardUtil {
  /**
   * 根据配置，初始化数据
   * @param currentLength {number} 当前存在仪表数量
   * @param type {ChartType} 创建的仪表类型
   */
  public static getInitDashboard(
    currentLength: number,
    type: ChartType
  ): Dashboard | undefined {
    // 获取默认公共模板数据
    let templateData = DefaultTemplate.getDefaultConfig(type);
    if (templateData === undefined) {
      console.error("未找到公共模板");
      return undefined;
    }

    // 对模板对象进行深拷贝
    let createdData: Dashboard = JSON.parse(JSON.stringify(templateData));

    // 赋予唯一id
    createdData.id = UUID.generate();
    // 确定新建仪表的定位位置
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
    let analysisDTO: AnalysisDTO = {
      dashboardId: currentDashboard.id,
      from: currentDashboard.tableView.fromTable,
      viewName: currentDashboard.tableView.viewName,
      join: currentDashboard.analysis.joinRelation,
      where: currentDashboard.analysis.where,
      fields: [],
      order: [],
      limit: ""
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

    // 追加排名
    if (currentDashboard.analysis.limit.data[0]) {
      const result = DashboardUtil.pushLimitDTO(
        currentDashboard.analysis.limit.data[0]
      );
      analysisDTO.order = [result.order];
      analysisDTO.limit = result.limit;
    }
    return analysisDTO;
  }

  public static initTableView(): TableView {
    return {
      viewName: "",
      fromTable: {
        schema: "",
        tableName: "",
        alias: ""
      }
    };
  }

  /**
   * 获取视图图表信息
   * @param viewName {string} 视图信息字符串
   * @param unit {string} 分割符
   */
  public static getFormTable(
    viewName: string,
    unit: string = "."
  ): TableRelation {
    const fromTable: TableRelation = DashboardUtil.initTableView().fromTable;

    const viewNameList = viewName ? viewName.split(unit) : [];

    if (viewName.length) {
      Object.assign(fromTable, {
        schema: viewNameList[0] + "." + viewNameList[1],
        tableName: viewNameList[2],
        alias: viewNameList[2]
      });
    }

    return fromTable;
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
      dashboard.tableView,
      dashboard.analysis.joinRelation,
      tableInfo,
      dashboard
    );
    return AxiosRequest.analysis
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
      const reactId = reactWhere.where.columnName;

      for (let i = 0; i < whereArray.length; i++) {
        const whereDTO = whereArray[i];

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

  public static pushLimitDTO(orderSources: LimitDTO) {
    return {
      order: ObjectUtil.copy(orderSources),
      limit: orderSources.limit
    };
  }

  /**
   * tableInfo 转 analysisDTO
   */
  public static getFetchValuesDTO(
    tableView: TableView,
    joinRelations: Array<JoinRelation>,
    tableInfo: TableInfoVO,
    currentDashboard: Dashboard
  ): AnalysisDTO {
    let fieldDTO = FieldDTOBuilder.buildFieldDTO(tableInfo),
      analysisDTO: AnalysisDTO = {
        dashboardId: currentDashboard.id,
        from: tableView.fromTable,
        viewName: tableView.viewName || "",
        join: joinRelations,
        fields: [],
        where: [],
        order: [],
        limit: ""
      };

    // 字段追加去重
    fieldDTO.func = ["distinct"];
    fieldDTO.tableAlias = tableView.fromTable?.alias || "";
    fieldDTO.schema = tableView.fromTable?.schema || "";

    // 加入过滤DTO
    analysisDTO.fields.push(fieldDTO);

    return analysisDTO;
  }
}
