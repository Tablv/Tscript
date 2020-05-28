/**
 * Axios 请求
 */
import AxiosUtil from "@/util/AxiosUtil";
import ObjectUtil from "@/util/ObjectUtil";

import AnalysisDTO from "glaway-bi-model/params/AnalysisDTO";
import DashboardSet from "glaway-bi-model/view/DashboardSet";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

import { ShareType } from "glaway-bi-model/enums/ShareType";
import ShareVO from "glaway-bi-model/results/ShareVO";

import { FilterDatapack } from "glaway-bi-model/view/Filter";
import { SortDatapack } from "glaway-bi-model/view/Sort";
import { WarnDatapack } from "glaway-bi-model/view/Warn";

const API = {
  /**
   * 数据集
   */
  findDatasetGroup: "/datasetGroup/findAll",
  findDataset: "/dataset/findOne",

  /**
   * 表关系
   */
  // findTables: "/dataset/table/findTableAndColumns",
  findTables: "/dashboard/container/loadCube",

  /**
   * 分析
   */
  analysis: {
    build: "/api/adhoc/build",
    sql: "/api/adhoc/s"
  },

  /**
   * 仪表盘
   */
  findDashboard: "/dashboard/findBySetId",
  saveDashboard: "/dashboard/save",

  /**
   * 仪表盘集
   */
  findDashboardSet: "/dashboard/container",
  saveDashboardSet: "/dashboardSet/update",

  /**
   * 分享
   */
  findShare: "/shareAdmin/getShareData",
  saveShare: "/shareAdmin/save",

  /**
   * 过滤器配置 (Restful)
   */
  filterConfig: "/filterDatapack",

  /**
   * 排序配置 (Restful)
   */
  sortConfig: "/sortDatapack",

  /**
   * 预警配置 (Restful)
   */
  warnConfig: "/warnDatapack",

  /**
   * 公共API
   */
  public: {
    /**
     * 分享
     */
    judgeShare: "/share/judge", // 校验
    findShareData: "/share/getShareData" // 获取数据
  }
};

export const AxiosRequest = {
  /**
   * 数据集
   */
  dataset: {
    // 查找数据集
    findGroup: () =>
      AxiosUtil.get(API.findDatasetGroup)
        .then(res =>
          res.success
            ? Promise.resolve(res.result)
            : Promise.reject("加载数据集出错")
        )
        .catch(err => Promise.reject(err)),

    // 查找数据集
    find: (groupId: string) =>
      AxiosUtil.get(API.findDataset, { groupId })
        .then(res =>
          res.success
            ? Promise.resolve(res.result)
            : Promise.reject("加载数据集出错")
        )
        .catch(err => Promise.reject(err))
  },

  /**
   * 表关系
   */
  table: {
    // 查找表信息
    find: (datasetId: string) =>
      AxiosUtil.get(API.findTables, { datasetId })
        .then(res => {
          let loadSuccess = res.success && res.result;
          return loadSuccess
            ? Promise.resolve(res.result)
            : Promise.reject("加载表信息失败");
        })
        .catch(err => Promise.reject(err))

    // 查找表关系
    // findRelation: (datasetId: string) =>
    //   AxiosUtil.get(API.findRelation, { datasetId })
    //     .then(res =>
    //       res.success
    //         ? Promise.resolve(res.result)
    //         : Promise.reject("加载关系失败")
    //     )
    //     .catch(err => Promise.reject(err))
  },

  /**
   * 分析
   */
  analysis: {
    // 获取分析结果
    fetch: (analysisDTO: AnalysisDTO) => {
      return AxiosUtil.post(
        API.analysis.build,
        JSON.stringify(analysisDTO),
        true
      )
        .then(res =>
          res.success && res.result !== null
            ? Promise.resolve(res.result)
            : Promise.reject("分析API返回值异常")
        )
        .catch(err => Promise.reject(err));
    },

    // 获取 SQL 查询结果
    fetchSQL: (sql: string) => {
      return AxiosUtil.post(API.analysis.sql, { sql })
        .then(res =>
          res.success && res.result !== null
            ? Promise.resolve(res.result)
            : Promise.reject("分析API返回值异常")
        )
        .catch(err => Promise.reject(err));
    }
  },

  /**
   * 仪表盘集
   */
  dashboardSet: {
    // 加载仪表盘集
    find: (setId: string) => {
      return AxiosUtil.get(`${API.findDashboardSet}/${setId}`)
        .then(res => {
          if (res.result && !ObjectUtil.isEmptyString(res.result.settings)) {
            const { settings, dashboards } = res.result;
            return ObjectUtil.parseJSON(settings).then(dashboardSet => {
              return {
                container: dashboardSet,
                dashboards
              };
            });
          }

          // 仪表盘集为空，使用默认配置
          return Promise.resolve({
            container: {},
            dashboards: []
          });
        })
        .catch(err => Promise.reject(err));
    },

    // 保存仪表盘集
    save: (
      setId: string,
      dashboardSet: DashboardSet,
      dashboards: Array<Dashboard>
    ) =>
      AxiosUtil.post(API.saveDashboardSet, {
        id: setId,
        settings: JSON.stringify(dashboardSet)
      })
        .then(res =>
          res.result ? Promise.resolve() : Promise.reject("保存仪表盘集错误")
        )
        .catch(err => Promise.reject(err))
  },

  /**
   * 分享
   */
  share: {
    // 获取分享
    find: (setId: string, shareType: ShareType) =>
      AxiosUtil.get(API.findShare, { id: setId, type: shareType })
        .then(res =>
          res.result
            ? Promise.resolve(res.result)
            : Promise.reject("分享 API 返回值错误")
        )
        .catch(err => Promise.reject(err)),

    // 保存分享
    save: (shareVO: ShareVO) =>
      AxiosUtil.post(API.saveShare, shareVO, true)
        .then(res =>
          res.result
            ? Promise.resolve()
            : Promise.reject("保存分享 API 返回值错误")
        )
        .catch(err => Promise.reject(err))
  },

  /**
   * 过滤器配置 (Restful)
   */
  filterConfig: {
    // 加载过滤器配置
    find: (dashboardId: string) =>
      AxiosUtil.get(API.filterConfig, {
        dashboardId
      })
        .then(res =>
          res.success
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载过滤器配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 保存过滤器配置
    save: (filterDatapack: FilterDatapack) =>
      AxiosUtil.request(API.filterConfig, filterDatapack, "PUT", true)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存过滤器配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 删除过滤器配置
    remove: (datapackId: string) =>
      AxiosUtil.request(
        API.filterConfig,
        {
          filterId: datapackId
        },
        "DELETE"
      )
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("删除过滤器配置异常")
        )
        .catch(err => Promise.reject(err))
  },

  /**
   * 排序配置 (Restful)
   */
  sortConfig: {
    // 加载排序配置
    find: (dashboardId: string) =>
      AxiosUtil.get(API.sortConfig, {
        dashboardId
      })
        .then(res =>
          res.success
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载排序配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 保存排序配置
    save: (sortDatapack: SortDatapack) =>
      AxiosUtil.request(API.sortConfig, sortDatapack, "PUT", true)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存排序配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 删除排序配置
    remove: (datapackId: string) =>
      AxiosUtil.request(
        API.sortConfig,
        {
          id: datapackId
        },
        "DELETE"
      )
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("删除排序配置异常")
        )
        .catch(err => Promise.reject(err))
  },

  /**
   * 预警配置 (Restful)
   */
  warnConfig: {
    // 加载预警配置
    find: (dashboardId: string) =>
      AxiosUtil.get(API.warnConfig, {
        dashboardId
      })
        .then(res =>
          res.success
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载预警配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 保存预警配置
    save: (warnDatapack: WarnDatapack) =>
      AxiosUtil.request(API.warnConfig, warnDatapack, "PUT", true)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存预警配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 删除预警配置
    remove: (datapackId: string) =>
      AxiosUtil.request(
        API.warnConfig,
        {
          id: datapackId
        },
        "DELETE"
      )
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("删除预警配置异常")
        )
        .catch(err => Promise.reject(err))
  },

  /**
   * 公共接口方法
   */
  publicAPI: {
    // 分享
    share: {
      // 验证分享
      validate: (shareId: string, sharePwd: string) =>
        AxiosUtil.post(API.public.judgeShare, {
          id: shareId,
          password: sharePwd
        })
          .then(res =>
            res.success ? Promise.resolve(res.result) : Promise.reject(false)
          )
          .catch(err => Promise.reject(err)),

      // 加载分享数据
      find: (shareId: string) =>
        AxiosUtil.post(API.public.findShareData, { shareId })
          .then(res => {
            if (
              res.result &&
              res.result.boardSet !== null &&
              res.result.boardSet.settings !== null
            ) {
              try {
                let boardSet = JSON.parse(res.result.boardSet.settings);

                return Promise.resolve({
                  boardSet,
                  boards: res.result.boards
                });
              } catch (err) {
                console.error(err);
              }
            }

            return Promise.reject("API返回值错误");
          })
          .catch(err => Promise.reject(err))
    }
  }
};
