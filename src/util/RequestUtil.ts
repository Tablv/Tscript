import Vue from "vue";

export default class RequestUtil extends Vue {
  /**
   * 获取请求参数对象
   */
  public static getRequestParams(): Map<string, string> {
    let url = window.location.search, //获取url中"?"符后的字串
      params: Map<string, string> = new Map();

    if (url.indexOf("?") !== -1) {
      let paramsString = url.substr(1),
        paramsStringArray = paramsString.split("&"); // [ "id=1", "name=a" ]

      paramsStringArray.forEach(keyValString => {
        let keyValueArray = keyValString.split("="),
          key = keyValueArray[0],
          value = keyValueArray[1];
        params.set(key, decodeURI(value));
      });
    }
    console.log(params)
    return params;
  }
}
