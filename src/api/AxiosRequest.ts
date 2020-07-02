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
import { SortDatapack, SortConfig } from "glaway-bi-model/view/Sort";
import { LimitDatapack } from "glaway-bi-model/view/Limit";
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
  findTables: "/dashboard/container/loadCube",

  /**
   * 分析
   */
  analysis: {
    build: "/api/adhoc/build",
    sql: "/api/adhoc/s"
  },

  /**
   * 仪表盘集
   */
  findDashboardSet: "/dashboard/findDashboard",
  saveDashboardSet: "/dashboard/container/save",

  /**
   * 分享
   */
  findShare: "/shareAdmin/getShareData",
  saveShare: "/shareAdmin/save",

  /**
   * 过滤器配置 (Restful)
   */
  filterConfig: {
    find: "/dashboard/ops/filter",
    save: "/dashboard/ops/filter/save",
    remove: "/dashboard/ops/filter/remove"
  },

  /**
   * 排序配置 (Restful)
   */
  sortConfig: {
    find: "/dashboard/ops/sort",
    save: "/dashboard/ops/sort/save",
    remove: "/dashboard/ops/sort/remove"
  },

  /**
   * 排名配置
   */
  limitConfig: {
    find: "/dashboard/ops/top",
    save: "/dashboard/ops/top/save",
    remove: "/dashboard/ops/top/remove"
  },

  /**
   * 预警配置 (Restful)
   */
  warnConfig: {
    find: "/dashboard/ops/warn",
    save: "/dashboard/ops/warn/save",
    remove: "/dashboard/ops/warn/remove"
  },

  /**
   * 快照 素材库
   */
  snapshot: {
    findDir: "/mate/findAllDir",
    save: "/mate/uploadSnapshot"
  },

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
          if (res.result) {
            return {
              container: {},
              dashboards: ObjectUtil.deserialize(res.result)
            };
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
      dashboards: Array<Dashboard>,
      containerSnapshot: string,
      dashboardSnapshots: Array<{
        dashboardId: string;
        fullPath: string;
        title: string;
      }>
    ) => {
      const req = {
        containerId: setId,
        containerSnapshot,
        dashboardSnapshots: JSON.stringify(dashboardSnapshots),
        containerOptions: JSON.stringify(dashboardSet),
        dashboardOptions: JSON.stringify(dashboards)
      };
      return AxiosUtil.post(API.saveDashboardSet, req)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存仪表盘集错误")
        )
        .catch(err => Promise.reject(err));
    }
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
      AxiosUtil.get(`${API.filterConfig.find}/${dashboardId}`)
        .then(res =>
          res.success
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载过滤器配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 保存过滤器配置
    save: (filterDatapack: FilterDatapack) => {
      const request = {
        id: filterDatapack.id,
        name: filterDatapack.name,
        dashboardId: filterDatapack.dashboardId,
        config: JSON.stringify(filterDatapack.config)
      };
      return AxiosUtil.post(API.filterConfig.save, request)
        .then(res => {
          res.success
            ? Promise.resolve()
            : Promise.reject("保存过滤器配置异常");
        })
        .catch(err => Promise.reject(err));
    },

    // 删除过滤器配置
    remove: (datapackId: string) =>
      AxiosUtil.post(`${API.filterConfig.remove}/${datapackId}`, {
        filterId: datapackId
      })
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
      AxiosUtil.get(`${API.sortConfig.find}/${dashboardId}`)
        .then(res =>
          res.success
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载排序配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 保存排序配置
    save: (sortDatapack: SortDatapack) => {
      const request = {
        id: sortDatapack.id,
        name: sortDatapack.name,
        dashboardId: sortDatapack.dashboardId,
        config: JSON.stringify(sortDatapack.config)
      };
      return AxiosUtil.post(API.sortConfig.save, request)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存排序配置异常")
        )
        .catch(err => Promise.reject(err));
    },

    // 删除排序配置
    remove: (datapackId: string) =>
      AxiosUtil.post(`${API.sortConfig.remove}/${datapackId}`, {
        sortId: datapackId
      })
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("删除排序配置异常")
        )
        .catch(err => Promise.reject(err))
  },

  /**
   * 排名配置 (Restful)
   */
  limitConfig: {
    // 加载排名配置
    find: (dashboardId: string) =>
      AxiosUtil.get(`${API.limitConfig.find}/${dashboardId}`)
        .then(res =>
          res.success
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载排名配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 保存排名配置
    save: (sortDatapack: LimitDatapack) => {
      const request = {
        id: sortDatapack.id,
        name: sortDatapack.name,
        dashboardId: sortDatapack.dashboardId,
        config: JSON.stringify(sortDatapack.config)
      };
      return AxiosUtil.post(API.limitConfig.save, request)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存排名配置异常")
        )
        .catch(err => Promise.reject(err));
    },

    // 删除排序配置
    remove: (datapackId: string) =>
      AxiosUtil.post(`${API.limitConfig.remove}/${datapackId}`, {
        topId: datapackId
      })
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("删除排名配置异常")
        )
        .catch(err => Promise.reject(err))
  },

  /**
   * 预警配置 (Restful)
   */
  warnConfig: {
    // 加载预警配置
    find: (dashboardId: string) =>
      AxiosUtil.get(`${API.warnConfig.find}/${dashboardId}`)
        .then(res =>
          res.success
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载预警配置异常")
        )
        .catch(err => Promise.reject(err)),

    // 保存预警配置
    save: (warnDatapack: WarnDatapack) => {
      const request = {
        id: warnDatapack.id,
        name: warnDatapack.name,
        dashboardId: warnDatapack.dashboardId,
        config: JSON.stringify(warnDatapack.config)
      };
      return AxiosUtil.post(API.warnConfig.save, request)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存预警配置异常")
        )
        .catch(err => Promise.reject(err));
    },

    // 删除预警配置
    remove: (datapackId: string) =>
      AxiosUtil.post(`${API.warnConfig.remove}/${datapackId}`, {
        warnId: datapackId
      })
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("删除预警配置异常")
        )
        .catch(err => Promise.reject(err))
  },

  snapshot: {
    // 加载资料库路径
    find: (requestData: any) =>
      AxiosUtil.get(API.snapshot.findDir, {
        filter: JSON.stringify(requestData)
      })
        .then(res =>
          res.success
            ? Promise.resolve(ObjectUtil.deserialize(res.result))
            : Promise.reject("加载素材库目录异常")
        )
        .catch(err => Promise.reject(err)),

    // 保存到资料库
    save: (requestData: any) => {
      return AxiosUtil.post(API.snapshot.save, requestData)
        .then(res =>
          res.success ? Promise.resolve() : Promise.reject("保存快照异常")
        )
        .catch(err => Promise.reject(err));
    }
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
