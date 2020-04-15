import Vue from "vue";

export default class RequestUtil extends Vue {
  /**
   * 获取请求参数对象
   */
  public static getRequestParams(): RequestParamMap {
    const url = window.location.search, //获取url中"?"符后的字串
      paramMap: RequestParamMap = {};

    if (url.indexOf("?") !== -1) {
      let params = url.substr(1),
        paramsPair = params.split("&"); // [ "id=1", "name=a" ]

        paramsPair.reduce((paramMap, paramPair) => {

          const [paramName, paramVal] = paramPair.split("=");
          paramMap[paramName] = paramVal;
          return paramMap;
        }, paramMap);
    }

    return paramMap;
  }
}

export type RequestParamMap = { [name: string]: string };