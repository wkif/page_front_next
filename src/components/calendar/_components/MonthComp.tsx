import React, { useEffect } from "react"
import useStore from "@/store/usestore"
import { apis } from "@/apis"
import { transformMonth } from "@/lib/utils"

import { TaskType } from "@/type"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Separator } from "@radix-ui/react-context-menu"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import MonthDayComp from "./MonthDay"

export default function MonthComp() {
    const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear())
    const [firstDay, setFirstDay] = React.useState(new Date(currentYear, currentMonth, 1).getDay())
    const [totalDays, setTotalDays] = React.useState(new Date(currentYear, currentMonth + 1, 0).getDate())

    useEffect(() => {
        setFirstDay(new Date(currentYear, currentMonth, 1).getDay())
        setTotalDays(new Date(currentYear, currentMonth + 1, 0).getDate())
        getTaskByMonth()
    }, [currentMonth, currentYear])

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11)
            setCurrentYear(currentYear - 1)
        } else {
            setCurrentMonth(currentMonth - 1)
        }
    }
    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0)
            setCurrentYear(currentYear + 1)
        } else {
            setCurrentMonth(currentMonth + 1)
        }
    }
    const resetMonth = () => {
        setCurrentMonth(new Date().getMonth())
        setCurrentYear(new Date().getFullYear())
    }
    const [TaskLIst_actual, setTaskList_actual] = React.useState<{
        day: number
        date: string
        tasks: TaskType[]
    }[]>();
    const [TaskLIst_estimate, setTaskList_estimate] = React.useState<{
        day: number
        date: string
        tasks: TaskType[]
    }[]>();
    const [holidayData, setHolidayData] = React.useState<{
        date: string
        day: number
        month: number
        status: number
        year: number
    }[]>([])

    const getTaskByMonth = async () => {
        setLoading(true)
        const { code, data, msg } = await apis.getEstimateTaskByMonth({
            userId: useStore.getState().userInfo?.id,
            year: currentYear,
            month: currentMonth + 1
        })
        if (code === 200) {
            setTaskList_estimate(data)
        } else {
            toast(msg)
        }
        const res1 = await apis.getActualTaskByMonth({
            userId: useStore.getState().userInfo?.id,
            year: currentYear,
            month: currentMonth + 1
        })
        if (res1.code === 200) {
            setTaskList_actual(res1.data)
        } else {
            toast(res1.msg)
        }
        const res = await apis.getHoildayByMonth({
            userId: useStore.getState().userInfo?.id,
            year: currentYear,
            month: currentMonth + 1
        })
        setLoading(false)
        if (res.code === 200) {
            setHolidayData(res.data.holidayData)
        }
    }
    const [loading, setLoading] = React.useState(false)
    return <>
        <div>
            <div className="text-3xl mb-5 w-[450px] flex flex-row items-center justify-evenly">
                <Button variant="outline" size="icon" onClick={prevMonth} >
                    <ArrowLeftIcon />
                </Button>
                <div className="text-center w-[250px]" onDoubleClick={resetMonth}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>  {
                                `${transformMonth(currentMonth + 1, 1)} ${currentYear}`
                            }</TooltipTrigger>
                            <TooltipContent>
                                <p>Double click to reset</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ArrowRightIcon />
                </Button>
            </div>
            <Separator />
            <div className="relative">
                {loading &&
                    <div className="z-50 w-full h-full absolute bg-gray-600 flex items-center justify-center opacity-80 text-white">loading...</div>
                }
                <div className="grid grid-cols-7 mt-6">
                    {
                        ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'].map((item, index) => {
                            return <div key={index} className="text-center text-xl bg-[#3f72af] text-white border-2 p-2 rounded-md">
                                {item}
                            </div>
                        })
                    }
                    {
                        Array.from({ length: firstDay }).map((item, index) => {
                            return <div key={index} className="text-center p-4 border-2 bg-gray-100 rounded-md"></div>
                        })
                    }
                    {
                        Array.from({ length: totalDays }).map((item, index) => {
                            return <>
                            <MonthDayComp key={index} day={index + 1} holidayData={holidayData} TaskLIst_estimate={TaskLIst_estimate} TaskLIst_actual={TaskLIst_actual} getTaskByMonth={getTaskByMonth} currentMonth={currentMonth} currentYear={currentYear}></MonthDayComp>
                            </>
                          
                        })
                    }
                </div>
            </div>
        </div>
    </>
}
