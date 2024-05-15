"use client"

import { z } from "zod"

import { apis } from "@/apis"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"


export default function AccountForm(
    { id }: {
        id: number
    }
) {
    const [userData, setUserData] = useState<{
        id: number;
        username: string;
        emailSend: string;
        emailHost: string;
        emailPort: string;
        emailAuth: string;
        emailReceiver: string;
        dailyTemplateName: string;
        monthlyTemplateName: string;
    }>(
        {
            id: 0,
            username: "",
            emailSend: "",
            emailHost: "",
            emailPort: "",
            emailAuth: "",
            emailReceiver: "",
            dailyTemplateName: "",
            monthlyTemplateName: "",
        }
    )
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<any[]>([]);

    const getUserInfo = async () => {
        const { code, data, msg } = await apis.getUserInfo(
            {
                id,
            }
        )
        if (code === 200) {
            setUserData(data)
        } else {
            toast(msg)
        }
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const mySchema = z.object({
                username: z.string().min(2, {
                    message: "Username must be at least 2 characters.",
                }),
                emailHost: z.string().min(2, {
                    message: "Email host must be at least 2 characters.",
                }),
                emailPort: z.string().regex(/^\d+$/, {
                    message: "Email port must be a number.",
                }),
                emailAuth: z.string().min(2, {
                    message: "Email auth user must be at least 2 characters.",
                }),
                emailSend: z.string().min(2, {
                    message: "Email sender must be at least 2 characters.",
                }),
                emailReceiver: z.string().min(2, {
                    message: "Email receiver must be at least 2 characters.",
                }),
                dailyTemplateName: z.string().min(2, {
                    message: "Daily template name must be at least 2 characters.",
                }),
                monthlyTemplateName: z.string().min(2, {
                    message: "Monthly template name must be at least 2 characters.",
                })
            });

            // store validation response
            const response = mySchema.safeParse({
                username: userData?.username,
                emailHost: userData?.emailHost,
                emailPort: userData?.emailPort,
                emailAuth: userData?.emailAuth,
                emailSend: userData?.emailSend,
                emailReceiver: userData?.emailReceiver,
                dailyTemplateName: userData?.dailyTemplateName,
                monthlyTemplateName: userData?.monthlyTemplateName
            });

            // refine errors
            if (!response.success) {
                let errArr: any[] = [];
                const { errors: err } = response.error;
                for (var i = 0; i < err.length; i++) {
                    errArr.push({ for: err[i].path[0], message: err[i].message });
                }
                setErrors(errArr);
                throw err;
            } else {
                const { code, msg } = await apis.updateUserInfo(
                    {
                        id,
                        username: userData.username,
                        emailHost: userData.emailHost,
                        emailPort: userData.emailPort,
                        emailAuth: userData.emailAuth,
                        emailSend: userData.emailSend,
                        emailReceiver: userData.emailReceiver,
                        dailyTemplateName: userData.dailyTemplateName,
                        monthlyTemplateName: userData.monthlyTemplateName
                    }
                )
                if (code === 200) {
                    toast('更新成功')
                } else {
                    toast(msg)
                }
            }

            setErrors([]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getUserInfo()
    }, []);

    return (
        <form className="flex flex-col gap-10 p-10" onSubmit={onSubmit}>
            <Separator />
            {/* username */}
            <div>
                <label
                    className="mb-3 text-sm font-medium text-black dark:text-white flex flex-col"
                >
                    <div>Username</div>
                    <span className="text-xs text-gray-500 mt-1"></span>
                </label>
                <input type="text" placeholder="username" className="w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-blue-500 active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={userData?.username}
                    onChange={
                        (e) => setUserData({
                            ...userData,
                            username: e.target.value
                        })
                    } autoComplete="off" required />
                <div className="mt-1 text-xs text-red-500">
                    {errors.find((error) => error.for === "username")?.message}
                </div>
            </div>
            {/* emailHost */}
            <div>
                <label
                    className="mb-3 text-sm font-medium text-black dark:text-white flex flex-col"
                >
                    <div>Email Host</div>
                    <span className="text-xs text-gray-500 mt-1">Configure daily mail server</span>
                </label>
                <input type="text" placeholder="emailHost" className="w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-blue-500 active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={userData?.emailHost}
                    onChange={(e) => setUserData({ ...userData, emailHost: e.target.value })} autoComplete="off" required />
                <div className="mt-1 text-xs text-red-500">
                    {errors.find((error) => error.for === "emailHost")?.message}
                </div>
            </div>
            {/* emailPort */}
            <div>
                <label
                    className="mb-3 text-sm font-medium text-black dark:text-white flex flex-col"
                >
                    <div>Email Port</div>
                    <span className="text-xs text-gray-500 mt-1">Configure daily mail port</span>
                </label>

                <input type="number" placeholder="emailPort" className="w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-blue-500 active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={userData?.emailPort}
                    onChange={(e) => setUserData({ ...userData, emailPort: e.target.value })} autoComplete="off" required />
                <div className="mt-1 text-xs text-red-500">
                    {errors.find((error) => error.for === "emailPort")?.message}
                </div>
            </div>
            {/* emailAuth */}
            <div>
                <label
                    className="mb-3 text-sm font-medium text-black dark:text-white flex flex-col"
                >
                    <div>Email password</div>
                    <span className="text-xs text-gray-500 mt-1">Configure the authentication key for daily mail</span>
                </label>
                <input type="password" placeholder="emailAuth" className="w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-blue-500 active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={userData?.emailAuth}
                    onChange={(e) => setUserData({ ...userData, emailAuth: e.target.value })} autoComplete="off" required />
                <div className="mt-1 text-xs text-red-500">
                    {errors.find((error) => error.for === "emailAuth")?.message}
                </div>
            </div>
            {/* emailSend */}
            <div>
                <label
                    className="mb-3 text-sm font-medium text-black dark:text-white flex flex-col"
                >
                    <div>Email Sender</div>
                    <span className="text-xs text-gray-500 mt-1">Configure daily mail to send mailbox</span>
                </label>
                <input type="text" placeholder="emailSend" className="w-full rounded-lg border-[1.5px] px-5 py-3 text-black outline-none transition focus:border-blue-500 active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={userData?.emailSend}
                    onChange={(e) => setUserData({ ...userData, emailSend: e.target.value })} autoComplete="off" required />
                <div className="mt-1 text-xs text-red-500">
                    {errors.find((error) => error.for === "emailSend")?.message}
                </div>
            </div>
            {/* emailReceiver */}
            <div>
                <label
                    className="mb-3 text-sm font-medium text-black dark:text-white flex flex-col"
                >
                    <div>Email Receivers</div>
                    <span className="text-xs text-gray-500 mt-1">Multiple mailboxes are separated by English commas</span>
                </label>
                <Textarea value={userData?.emailReceiver}
                    onChange={(e) => setUserData({ ...userData, emailReceiver: e.target.value })} autoComplete="off" required />
                <div className="mt-1 text-xs text-red-500">
                    {errors.find((error) => error.for === "emailReceiver")?.message}
                </div>
            </div>
            {/* dailyTemplateName */}
            <div>
                <label
                    className="mb-3 text-sm font-medium text-black dark:text-white flex flex-col"
                >
                    <div>DailyTemplateName</div>
                    <span className="text-xs text-gray-500 mt-1">The format of naming daily documents,[[username]] stands for user name,[[date]] stands for date, eg: 工作日志-[[username]]-[[date]].xlsx, If not set, default is [[userid]]_[[username]]_[[email]]_[[date]].xlsx</span>
                </label>
                <Textarea value={userData?.dailyTemplateName}
                    onChange={(e) => setUserData({ ...userData, dailyTemplateName: e.target.value })} autoComplete="off" required />
                <div className="mt-1 text-xs text-red-500">
                    {errors.find((error) => error.for === "dailyTemplateName")?.message}
                </div>
            </div>
            {/* monthlyTemplateName */}
            <div>

                <label
                    className="mb-3 text-sm font-medium text-black dark:text-white flex flex-col"
                >
                    <div>MonthlyTemplateName</div>
                    <span className="text-xs text-gray-500 mt-1">The format of naming monthly documents,[[username]] stands for user name,[[startDate]]stands for start date,[[endDate]] stands for end date,eg: 月报-[[username]]-[[startDate]]-[[endDate]].xlsx,If not set, default is [[userid]]_[[username]]_[[email]]_[[startDate]]_[[endDate]].xlsx </span>
                </label>

                <Textarea value={userData?.monthlyTemplateName}
                    onChange={(e) => setUserData({ ...userData, monthlyTemplateName: e.target.value })} autoComplete="off" required />
                <div className="mt-1 text-xs text-red-500">
                    {errors.find((error) => error.for === "monthlyTemplateName")?.message}
                </div>
            </div>
            <Separator />
            <div className="text-end">
                <button
                    type="submit"
                    className="h-10 w-32 rounded-md bg-blue-600 font-medium text-white disabled:cursor-not-allowed disabled:opacity-30"
                    disabled={isLoading}
                >
                    {isLoading ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    )
}