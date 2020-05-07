/**
 * 路由以及交互封装
 */
import AxiosUtil from "@/util/AxiosUtil";
import ObjectUtil from "@/util/ObjectUtil";

import AnalysisDTO from "@/model/params/AnalysisDTO";
import DashboardSet from "@/model/view/DashboardSet";
import Dashboard from "@/model/view/dashboard/Dashboard";

import { ShareType } from "@/enums/ShareType";
import ShareVO from "@/model/results/ShareVO";

import { FilterDatapack } from "@/model/view/Filter";
import { SortDatapack } from "@/model/view/Sort";
import { WarnDatapack } from "@/model/view/Warn";

const API = {
  /**
   * 数据集
   */
  findDataset: "/datasetGroup/findAllChild",
  findDatasetDetail: "/dataset/list",

  /**
   * 表关系
   */
  findTables: "/dataset/operat/findTables",
  findRelation: "/relation/findRelation",

  /**
   * 分析
   */
  analysis: {
    build: "/api/v1/build",
    sql: "/api/v1/s"
  },

  /**
   * 仪表盘
   */
  findDashboard: "/dashboard/findBySetId",
  saveDashboard: "/dashboard/save",

  /**
   * 仪表盘集
   */
  findDashboardSet: "/dashboardSet/selectone",
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
    find: async () =>
      await AxiosUtil.get(API.findDataset)
        .then(res => Promise.resolve(res))
        .catch(err => Promise.reject(err)),

    // 查找数据集具体数据
    findDetail: async (groupId: string) =>
      await AxiosUtil.get(API.findDatasetDetail, { groupId })
        .then(res => Promise.resolve(res.result.list))
        .catch(err => Promise.reject(err))
  },

  /**
   * 表关系
   */
  table: {
    // 查找表信息
    find: async (datasetId: string) =>
      await AxiosUtil.get(API.findTables, { datasetId })
        .then(res => {
          let loadSuccess = res.success && res.result.from && res.result.tables;
          return loadSuccess
            ? Promise.resolve({
                from: res.result.from,
                tables: res.result.tables
              })
            : Promise.reject("加载表信息失败");
        })
        .catch(err => Promise.reject(err)),

    // 查找表关系
    findRelation: async (datasetId: string) =>
      await AxiosUtil.get(API.findRelation, { datasetId })
        .then(res =>
          res.success
            ? Promise.resolve(res.result)
            : Promise.reject("加载关系失败")
        )
        .catch(err => Promise.reject(err))
  },

  /**
   * 分析
   */
  analysis: {
    // 获取分析结果
    fetch: async (analysisDTO: AnalysisDTO) => {
      return await AxiosUtil.post(
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
    fetchSQL: async (sql: string) => {
      return await AxiosUtil.post(API.analysis.sql, { sql })
        .then(res =>
          res.success && res.result !== null
            ? Promise.resolve(res.result)
            : Promise.reject("分析API返回值异常")
        )
        .catch(err => Promise.reject(err));
    }
  },

  /**
   * 仪表盘
   */
  dashboardRequest: {
    // 加载仪表盘
    find: async (setId: string) =>
      await AxiosUtil.get(API.findDashboard + "/" + setId)
        .then(res =>
          res.result
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载仪表盘失败")
        )
        .catch(err => Promise.reject(err)),

    // 保存仪表盘
    save: async (setId: string, dashboards: Array<Dashboard>) =>
      await AxiosUtil.post(API.saveDashboard, { setId, dashboards }, true)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存仪表盘错误")
        )
        .catch(err => Promise.reject(err))
  },

  /**
   * 仪表盘集
   */
  dashboardSet: {
    // 加载仪表盘集
    find: async (setId: string) =>
      await AxiosUtil.get(API.findDashboardSet, { id: setId })
        .then(res => {
          if (res.result && !ObjectUtil.isEmptyString(res.result.settings)) {
            return ObjectUtil.parseJSON(res.result.settings);
          }
          // 仪表盘集为空，使用默认配置
          return Promise.resolve({});
        })
        .catch(err => Promise.reject(err)),

    // 保存仪表盘集
    save: async (setId: string, dashboardSet: DashboardSet) =>
      await AxiosUtil.post(API.saveDashboardSet, {
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
    find: async (setId: string, shareType: ShareType) =>
      await AxiosUtil.get(API.findShare, { id: setId, type: shareType })
        .then(res =>
          res.result
            ? Promise.resolve(res.result)
            : Promise.reject("分享 API 返回值错误")
        )
        .catch(err => Promise.reject(err)),

    // 保存分享
    save: async (shareVO: ShareVO) =>
      await AxiosUtil.post(API.saveShare, shareVO, true)
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
    find: async (dashboardId: string) =>
      await AxiosUtil.get(API.filterConfig, {
        dashboardId
      })
        .then(res =>
          res.success
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载过滤器配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 保存过滤器配置
    save: async (filterDatapack: FilterDatapack) =>
      await AxiosUtil.request(API.filterConfig, filterDatapack, "PUT", true)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存过滤器配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 删除过滤器配置
    remove: async (datapackId: string) =>
      await AxiosUtil.request(
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
    find: async (dashboardId: string) =>
      await AxiosUtil.get(API.sortConfig, {
        dashboardId
      })
        .then(res =>
          res.success
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载排序配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 保存排序配置
    save: async (sortDatapack: SortDatapack) =>
      await AxiosUtil.request(API.sortConfig, sortDatapack, "PUT", true)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存排序配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 删除排序配置
    remove: async (datapackId: string) =>
      await AxiosUtil.request(
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
    find: async (dashboardId: string) =>
      await AxiosUtil.get(API.warnConfig, {
        dashboardId
      })
        .then(res =>
          res.success
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载预警配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 保存预警配置
    save: async (warnDatapack: WarnDatapack) =>
      await AxiosUtil.request(API.warnConfig, warnDatapack, "PUT", true)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存预警配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 删除预警配置
    remove: async (datapackId: string) =>
      await AxiosUtil.request(
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
      validate: async (shareId: string, sharePwd: string) =>
        await AxiosUtil.post(API.public.judgeShare, {
          id: shareId,
          password: sharePwd
        })
          .then(res =>
            res.success ? Promise.resolve(res.result) : Promise.reject(false)
          )
          .catch(err => Promise.reject(err)),

      // 加载分享数据
      find: async (shareId: string) =>
        await AxiosUtil.post(API.public.findShareData, { shareId })
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
