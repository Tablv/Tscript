import WhereDTO from "@/model/params/WhereDTO";

/**
 * 联动查询
 */
export default interface ReactWhere {
  /**
   * 当前仪表盘ID
   */
  dashboardId: string | null;

  /**
   * 数据集ID
   */
  datasetId: string | null;

  /**
   * 条件过滤
   */
  where: WhereDTO | null;
}