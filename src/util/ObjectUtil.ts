import _ from "lodash";

/**
 * 对象工具类
 */
export default class ObjectUtil<T> {
  /**
   * 判断对象是否为null、undefined 或为空
   *
   * @param obj 对象
   */
  public static isEmpty(obj: any): boolean {
    return obj === undefined || obj === null;
  }

  /**
   * 判断字符串是否为空
   *
   * @param obj 对象
   */
  public static isEmptyString(obj: string): boolean {
    return !(obj && obj.trim().length !== 0);
  }

  /**
   * 判断数组是否为空
   *
   * @param obj 对象
   */
  public static isEmptyArray(obj: any): boolean {
    return !(obj && obj.length !== 0);
  }

  /**
   * 复制对象
   *
   * @param obj 对象
   */
  public static copy<T>(obj: T): T {
    // return JSON.parse(JSON.stringify(obj));
    return _.cloneDeep(obj);
  }

  /**
   * 解析 JSON 返回一个对象 Promise
   *
   * @param json JSON 数据
   */
  public static parseJSON(json: string): Promise<Object> {
    try {
      let object = JSON.parse(json);
      return Promise.resolve(object);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * 合并两个对象
   *
   * @param targetObj 目标对象
   * @param sourceObj 源对象
   */
  public static merge<T>(
    targetObj: T,
    sourceObj: T,
    objectIsolation?: boolean
  ): T {
    if (objectIsolation) {
      targetObj = ObjectUtil.copy(targetObj);
      sourceObj = ObjectUtil.copy(sourceObj);
    }

    if (targetObj && sourceObj) {
      this.mergeRecursive(targetObj, sourceObj);
    }

    return targetObj;
  }

  // 递归合并参数
  private static mergeRecursive(targetObj: any, sourceObj: any): void {
    for (let key in sourceObj) {
      if (targetObj[key] === undefined) {
        targetObj[key] = sourceObj[key];
      } else if (
        targetObj[key] instanceof Array ||
        targetObj[key] instanceof Object
      ) {
        this.mergeRecursive(targetObj[key], sourceObj[key]);
      }
    }
  }

  public static serialize(
    object: any,
    objectIsolation?: boolean
  ): { [key: string]: string } {
    if (objectIsolation) {
      object = ObjectUtil.copy(object);
    }

    for (const key in object) {
      if (typeof object[key] === "object")
        object[key] = JSON.stringify(object[key]);
    }

    return object;
  }

  /**
   * 解析存储的JSON对象的集合
   *
   * @param serializedData 序列化数据的 数组/对象
   * @param objectIsolation 是否拷贝对象引用
   * @param recursive 是否递归反序列化
   */
  public static deserialize(
    serializedData: Array<any> | any,
    objectIsolation?: boolean,
    recursive?: boolean
  ): Array<any> | any {
    if (objectIsolation) {
      serializedData = ObjectUtil.copy(serializedData);
    }

    if (serializedData instanceof Array) {
      serializedData.forEach((data, index) => {
        serializedData[index] = this.deserialize(
          data,
          objectIsolation,
          recursive
        );
      });
    } else {
      for (const field in serializedData) {
        /* eslint-disable */
        try {

          // string 类型，需要反序列化
          if (typeof serializedData[field] === "string") {
            serializedData[field] = JSON.parse(serializedData[field]);
          }

          // 反序列化处理后，判断是否需要递归
          if (recursive && typeof serializedData[field] === "object" && serializedData[field] !== null) {
            serializedData[field] = this.deserialize(serializedData[field], objectIsolation, recursive);
          }

        } catch {}
        /* eslint-enable */
      }
    }

    return serializedData;
  }
}
