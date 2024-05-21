import { getAxios, postAxios } from "@/lib/request";
import { ResType } from "@/type";

export const getTaskList = (data: {
    userId: number
    page: number
    title?: string
    mainTitle?: string
    status?: string
    date?: string
}): Promise<ResType> => {
    return postAxios({ url: "/task/getTaskList", data })
};

export const addTask = (data: {
    userId: number;
    title: string;
    mainTitle: string;
    date: string;
    arranger: string;
    estimatedWorkingHours: number;
    estimatedStartDate: string;
    estimatedEndDate: string;
    actualWorkingHours: number;
    actualStartDate: string;
    actualEndDate: string;
    status: string;
    progress: number;
    remarks: string;
}): Promise<ResType> => {
    return postAxios({ url: "/task/addTask", data })
}

export const editTask = (data: {
    id: number;
    userId: number;
    title: string;
    mainTitle: string;
    date: string;
    arranger: string;
    estimatedWorkingHours: number;
    estimatedStartDate: string;
    estimatedEndDate: string;
    actualWorkingHours: number;
    actualStartDate: string;
    actualEndDate: string;
    status: string;
    progress: number;
    remarks: string;
}): Promise<ResType> => {
    return postAxios({ url: "/task/editTask", data })
}

export const getTaskById = (data: {
    id: number
    userId: number
}): Promise<ResType> => {
    return postAxios({ url: "/task/getTaskById", data })
}

export const deleteTask = (data: {
    id: number
    userId: number
}): Promise<ResType> => {
    return postAxios({ url: "/task/deleteTask", data })
}

export const uploadTemplate = (data: FormData): Promise<ResType> => {
    return postAxios({ url: "/task/uploadTemplate", data, headers: { "Content-Type": "multipart/form-data" } })
}

export const downloadTemplate = (data: {
    userId: number
    type: number
}) => {
    return postAxios({ url: "/task/downloadTemplate", data, responseType: "blob" })
}

export const getHistoryList = (data: {
    userId: number
    page: number
    type: number
}) => {
    return postAxios({ url: "/task/getHistoryList", data })
}
export const downloadHistoryFile = (data: {
    userId: number
    hisId: number
}) => {
    return postAxios({ url: "/task/downloadHistoryFile", data, responseType: "blob" })
}

export const deleteHistoryFile = (data: {
    userId: number
    id: number
}) => {
    return postAxios({ url: "/task/deleteHistoryFile", data })
}
export const exportMonthly = (data: {
    userId: number
    startDate: string
    endDate: string
}) => {
    return postAxios({ url: "/task/exportMonthly", data })
}

export const sendDailyEmail = (data: {
    userId: number
    hisId: number
}) => {
    return postAxios({ url: "/task/sendDailyEmail", data })
}

export const exportDaily = (data: {
    userId: number
    date: string
}): Promise<ResType> => {
    return postAxios({ url: "/task/exportDaily", data })
}

export const getLunarDate = (date: string) => {
    return postAxios({ url: "/getLunarDate", data: { date } })
}

export const getTaskByMonth = (data: {
    userId: number
    year: number
    month: number
}) => {
    return postAxios({ url: "/task/getTaskByMonth", data })
}

export const getHoildayByMonth = (data: {
    userId: number
    year: number
    month: number
}) => {
    return postAxios({ url: "/task/getHoildayByMonth", data })
}