import { getAxios, postAxios } from "@/lib/request";
import { ResType } from "@/type";

export const getLinks = (params: {
  id: number
}) => {
  return getAxios({ url: `/links/getLinks/${params.id}` });
};
export const searchAdvice = (data: {
  keyword: string
}) => {
  return postAxios({ url: "/searchAdvice", data })
}
export const getLinkTableList = (data: {
  userId: number
  page: number
  catId: number
  title: string
  url: string
  tags: string
}) => {
  return postAxios({ url: "/links/getLinkTableList", data })
}

export const getCategoryList = (params: {
  id: number
}) => {
  return getAxios({ url: `/links/getCategoryList/${params.id}` });
}

export const deleteLink = (data: {
  id: number,
  userId: number
}) => {
  return postAxios({ url: "/links/deleteLink", data })
}

export const addLink = (data: {
  userId: number
  title: string
  url: string
  categoryId: number
  description: string
  tags: string
  github: string
}) => {
  return postAxios({ url: "/links/addLink", data })
}
export const editLink = (data: {
  id: number
  userId: number
  title: string
  url: string
  categoryId: number
  description: string
  tags: string
  github: string
}) => {
  return postAxios({ url: "/links/editLink", data })
}
export const getLinkById = (data: {
  id: number
  userId: number
}) => {
  return postAxios({ url: "/links/getLinkById", data })
}

export const addCategory = (data: {
  userId: number
  name: string
}) => {
  return postAxios({ url: "/links/addCategory", data })
}

export const deleteCategory = (data: {
  id: number
  userId: number
}) => {
  return postAxios({ url: "/links/deleteCategory", data })
}