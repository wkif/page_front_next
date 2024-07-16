import { getAxios, postAxios } from "@/lib/request";
import { ResType } from "@/type";

export const test = () => {
  return getAxios({ url: "/" });
};

// 登录
export const Login = (data: {
  email: string;
  password: string;
}): Promise<ResType> => {
  return postAxios({ url: "/user/login", data });
}


// 注册
export const register = (data: {
  username: string;
  email: string;
  password: string;
}): Promise<ResType> => {
  return postAxios({ url: "/user/register", data })
}

// 获取用户信息
export const getUserInfo = (params: {
  id: number
}) => {
  return getAxios({ url: `/user/getUserInfo/${params.id}` });
}
// 更新用户信息
export const updateUserInfo = (data: {
  id: number;
  username: string;
  emailSend: string;
  emailHost: string;
  emailPort: string;
  emailAuth: string;
  emailReceiver: string;
  emailCC: string;
  dailyTemplateName: string;
  monthlyTemplateName: string;
}) => {
  return postAxios({ url: "/user/updateUserInfo", data })
}
export const updateNewsTypes = (data: {
  id: number;
  newsTypes: string;
}) => {
  return postAxios({ url: "/user/updateNewsTypes", data })
}