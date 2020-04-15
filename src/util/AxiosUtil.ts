import Vue from "vue";
import qs from "qs";
import axios, { Method, AxiosResponse } from "axios";

interface ResultJSON {
  code: string;

  message: string;

  success: boolean;

  result: any;
}

export default class AxiosUtil extends Vue {
  public static async get(url: string, data?: any): Promise<ResultJSON> {
    return await axios
      .get(this.getBasePath() + url, {
        params: data
      })
      .then((result: AxiosResponse<ResultJSON>) =>
        Promise.resolve(result.data as ResultJSON)
      )
      .catch((err: Error) => Promise.reject(err));
  }

  public static async post(
    url: string,
    data: any,
    isJSON?: boolean
  ): Promise<ResultJSON> {
    return await this.request(url, data, "POST", isJSON);
  }

  public static async request(
    url: string,
    data: any,
    type: Method,
    isJSON?: boolean
  ): Promise<ResultJSON> {
    return await axios({
      url: this.getBasePath() + url,
      method: type,
      data: isJSON ? data : qs.stringify(data),
      headers: {
        "Content-Type": isJSON
          ? "application/json"
          : "application/x-www-form-urlencoded"
      }
    })
      .then((result: AxiosResponse<ResultJSON>) =>
        Promise.resolve(result.data as ResultJSON)
      )
      .catch((err: Error) => Promise.reject(err));
  }

  public static getBasePath(): string {
    return super.prototype.axiosPath;
  }
}
