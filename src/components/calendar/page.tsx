import React, { useEffect } from "react"
import { Button } from "../ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"


import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons"
import useStore from "@/store/usestore"

import { cn, transformMonth } from "@/lib/utils"
import { Separator } from "../ui/separator"
import { apis } from "@/apis"
import { toast } from "sonner"
import { TaskType } from "@/type"

import TaskDetail from "../../app/admin/task/_components/taskDetail"
import EditTask from "../../app/admin/task/_components/editDialog"

import { Dialog, DialogTrigger } from "../ui/dialog"
import { Badge } from "../ui/badge"


function MonthComp() {
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
        task: TaskType
    }[]>();
    const [TaskLIst_estimate, setTaskList_estimate] = React.useState<{
        day: number
        date: string
        task: TaskType
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
        }else{
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
    const [selectTask, setSelectTask] = React.useState<TaskType | null>(null)
    const [open, setOpen] = React.useState(false)
    const [edit, setEdit] = React.useState(false)
    const openDetail = (index: number, type: number) => {
        if (type == 1) {
            const task = TaskLIst_actual?.find((dayItem) => {
                return dayItem.day == index
            })?.task
            if (task) {
                setSelectTask(task)
                setOpen(true)
            }
        }
        if (type == 2) {
            const task = TaskLIst_estimate?.find((dayItem) => {
                return dayItem.day == index
            })?.task
            if (task) {
                setSelectTask(task)
                setOpen(true)
            }
        }

    }
    const openEdit = (index: number, type: number) => {
        if (type == 1) {
            const task = TaskLIst_actual?.find((dayItem) => {
                return dayItem.day == index
            })?.task
            if (task) {
                setSelectTask(task)
                setEdit(true)
            }
        }
        if (type == 2) {
            const task = TaskLIst_estimate?.find((dayItem) => {
                return dayItem.day == index
            })?.task
            if (task) {
                setSelectTask(task)
                setEdit(true)
            }
        }
    }
    const [loading, setLoading] = React.useState(false)
    return <>
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                {
                    selectTask && <TaskDetail data={selectTask} />
                }
            </Dialog>
            {selectTask && <EditTask open={edit} taskId={selectTask.id} setOpen={setEdit} getList={getTaskByMonth} />}

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
                                <div key={index} className={
                                    cn("text-center p-4 border-2 hover:bg-slate-100 hover:text-black h-32 rounded-md", {
                                        "bg-blue-300 text-white": currentMonth == new Date().getMonth() && currentYear == new Date().getFullYear() && index + 1 == new Date().getDate()
                                    })
                                }>
                                    <div className="text-xl p-1 flex flex-row items-center">
                                        <span>{index + 1}</span>
                                        {
                                            holidayData?.find((dayItem) => {
                                                return dayItem.day == index + 1
                                            })?.status == 0 || holidayData?.find((dayItem) => {
                                                return dayItem.day == index + 1
                                            })?.status == 2 ? <Badge className="bg-[#dbe2ef] ml-auto" variant="outline">Work</Badge> : ""
                                        }
                                    </div>
                                    <div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>

                                                    <ContextMenu>
                                                        <ContextMenuTrigger>
                                                            <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap text-white bg-[#aa96da] px-2 max-w-40">
                                                                {
                                                                    TaskLIst_estimate?.find((dayItem) => {
                                                                        return dayItem.day == index + 1
                                                                    })?.task ?
                                                                        'E:' + TaskLIst_estimate?.find((dayItem) => {
                                                                            return dayItem.day == index + 1
                                                                        })?.task.title :
                                                                        ""
                                                                }
                                                            </div>
                                                        </ContextMenuTrigger>
                                                        <ContextMenuContent>
                                                            <ContextMenuItem onClick={() => openDetail(index + 1, 2)}>Detail</ContextMenuItem>
                                                            <ContextMenuItem onClick={() => openEdit(index + 1, 2)}>Edit</ContextMenuItem>
                                                        </ContextMenuContent>
                                                    </ContextMenu>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        {
                                                            TaskLIst_estimate?.find((dayItem) => {
                                                                return dayItem.day == index + 1
                                                            })?.task?.mainTitle + " " + TaskLIst_estimate?.find((dayItem) => {
                                                                return dayItem.day == index + 1
                                                            })?.task?.title
                                                        }
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>

                                    <div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ContextMenu>
                                                        <ContextMenuTrigger><div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap text-white bg-[#fcbad3] px-2 max-w-40" >
                                                            {
                                                                TaskLIst_actual?.find((dayItem) => {
                                                                    return dayItem.day == index + 1
                                                                })?.task ? 'A:' + TaskLIst_actual?.find((dayItem) => {
                                                                    return dayItem.day == index + 1
                                                                })?.task.title : ""
                                                            }
                                                        </div></ContextMenuTrigger>
                                                        <ContextMenuContent>
                                                            <ContextMenuItem onClick={() => openDetail(index + 1, 1)}>Detail</ContextMenuItem>
                                                            <ContextMenuItem onClick={() => openEdit(index + 1, 1)}>Edit</ContextMenuItem>
                                                        </ContextMenuContent>
                                                    </ContextMenu>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        {
                                                            TaskLIst_actual?.find((dayItem) => {
                                                                return dayItem.day == index + 1
                                                            })?.task?.mainTitle + " " + TaskLIst_actual?.find((dayItem) => {
                                                                return dayItem.day == index + 1
                                                            })?.task?.title
                                                        }
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>


                                </div>
                            </>
                        })
                    }
                </div>
            </div>
        </div>
    </>
}
function WeekComp() {

    return <>
    <div>Waiting...</div>
    </>
}

function DayComp() {

    return <></>
}

export default function Calendar() {
    const currentDate = new Date()
    // 当前周日期
    const currentWeek = currentDate.getDate()
    const [currentMode, setCurrentMode] = React.useState(1)
    const changeMode = (mode: number) => {
        setCurrentMode(mode)
    }
    return (<>
        <Card>
            <CardHeader>
                <CardTitle>

                    <div className="flex flex-row items-center">
                        <Button variant="ghost" className={
                            currentMode === 1 ? "bg-gray-300" : ""
                        } onClick={() => changeMode(1)}>Month</Button>
                        <Button disabled variant="ghost" className={
                            currentMode === 2 ? "bg-gray-300" : ""
                        } onClick={() => changeMode(2)}>Week</Button>
                        <Button variant="ghost" className={
                            currentMode === 3 ? "bg-gray-300" : ""
                        } onClick={() => changeMode(3)}>Day</Button>
                        <div className="ml-auto">
                            <span className="text-sm mr-4">Tips: </span>
                            <Badge className="bg-[#aa96da] text-sm" variant="outline">Estimate</Badge>
                            <Badge className="bg-[#fcbad3] text-sm" variant="outline">Actual</Badge>
                        </div>
                    </div>

                </CardTitle>
            </CardHeader>
            <CardContent>
                {
                    currentMode === 1 ? <MonthComp /> :
                        currentMode === 2 ? <WeekComp /> :
                            <DayComp />
                }
            </CardContent>
            {/* <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
        </Card>

        {/* <div className="border-2 rounded-md p-2">
        </div> */}
    </>)
}