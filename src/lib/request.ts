import { ResType } from "@/type";
import axios, { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import useStore from "@/store/usestore"
// const { token } = useStore()
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

declare module "axios" {
  interface AxiosRequestConfig {
    timeout?: number;
    headers?: any;
  }
  interface AxiosResponse {
    code: number;
    msg: string;
    data: any;
  }
}

// 拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const token = useStore.getState().token
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers['Authorization'] = token ? `Bearer ${token}` : '';
    config.timeout = 10000;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



// axios的get请求
export function getAxios({ url, params = {} }: { url: string; params?: any }): Promise<ResType> {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
      })
      .then((res: AxiosResponse) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err, "1");
        reject(err);
      });
  });
}

// axios的post请求
export function postAxios({ url, data, headers, responseType }: { url: string; data: any, headers?: any, responseType?: any }): Promise<ResType> {
  return new Promise((resolve, reject) => {
    const config: AxiosRequestConfig = {
      url,
      method: "post",
      data,
      headers,
    }
    if (responseType) {
      config.responseType = responseType
    }
    console.log('config', config)
    axios(config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default axios;
