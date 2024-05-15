interface ResType {
    code: number
    msg: string
    data: any
}

interface UserinfoType {
    id: number
    email: string
    username: string
    avatar: string
    dailyTemplateName: string
    monthlyTemplateName: string
    emailSend: string
    emailHost: string
    emailPort: string
    emailAuth: string
    emailReceiver: string
    dailyTemplate: string
    monthlyTemplate: string
}

interface CategoryType {
    id: number
    typename: string
}
interface LinkType {
    id: number,
    title: string,
    tags: string,
    url: string,
    github: string,
    description: string,
    category: CategoryType
}

interface TaskType {
    id: number;
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
    level: number
}

interface TaskHistoryType {
    id: number
    createTime: string
    fileName: string
    fileHash: string
    fileExist: boolean
    reportType: number
    hasSendEmail: boolean
    reportDate: string
    reportDateStart: string
    reportDateEnd: string
}

export type {
    ResType,
    UserinfoType,
    CategoryType,
    LinkType,
    TaskType,
    TaskHistoryType
}
