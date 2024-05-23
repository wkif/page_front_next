import EditTask from "@/app/admin/task/_components/editDialog"
import TaskDetail from "@/app/admin/task/_components/taskDetail"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TaskType } from "@/type"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@radix-ui/react-context-menu"
import { Dialog } from "@radix-ui/react-dialog"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"
import React from "react"

interface TaskListItmType {
    day: number
    date: string
    tasks: TaskType[]
}


function TaskTitle({
    taskList,
    day,
    type,
    getTaskByMonth
}: {
    taskList: Array<
        {
            day: number
            date: string
            tasks: TaskType[]
        }> | undefined,
    day: number,
    type: number,
    getTaskByMonth: () => void
}) {
    const tasks: TaskType[] | undefined = taskList?.find((dayItem) => {
        return dayItem.day == day
    })?.tasks


    const [selectTask, setSelectTask] = React.useState<TaskType | null>(null)
    const [open, setOpen] = React.useState(false)
    const [edit, setEdit] = React.useState(false)
    const openDetail = (id: number) => {
        const task = tasks?.find((task) => {
            return task.id == id
        })
        if (task) {
            setSelectTask(task)
            setOpen(true)
        }
    }
    const openEdit = (id: number) => {
        const task = tasks?.find((task) => {
            return task.id == id
        })
        if (task) {
            setSelectTask(task)
            setEdit(true)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                {
                    selectTask && <TaskDetail data={selectTask} />
                }
            </Dialog>
            {selectTask && <EditTask open={edit} taskId={selectTask.id} setOpen={setEdit} getList={getTaskByMonth} />}
            {
                tasks?.map((task) => {
                    return (<ContextMenu key={task.id}>
                        <ContextMenuTrigger>
                            <div className={
                                cn("text-sm overflow-hidden text-ellipsis whitespace-nowrap text-white  px-2 max-w-40", {
                                    "bg-[#aa96da]": type == 1
                                }, {
                                    "bg-[#fcbad3]": type == 2
                                })
                            }>
                                {task.title}
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem onClick={() => openDetail(task.id)}>Detail</ContextMenuItem>
                            <ContextMenuItem onClick={() => openEdit(task.id)}>Edit</ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>)
                })
            }
        </>
    )

}


export default function MonthDayComp({
    day,
    holidayData,
    TaskLIst_estimate,
    TaskLIst_actual,
    getTaskByMonth,
    currentMonth,
    currentYear
}: {
    day: number,
    holidayData: {
        date: string
        day: number
        month: number
        status: number
        year: number
    }[] | undefined
    TaskLIst_estimate: TaskListItmType[] | undefined
    TaskLIst_actual: TaskListItmType[] | undefined
    currentMonth: number
    currentYear: number
    getTaskByMonth: () => void
}) {

    return <>
        <div className={
            cn("text-center p-4 border-2 hover:bg-slate-100 hover:text-black h-32 overflow-auto rounded-md", {
                "bg-blue-300 text-white": currentMonth == new Date().getMonth() && currentYear == new Date().getFullYear() && day == new Date().getDate()
            })
        }>
            <div className="text-xl p-1 flex flex-row items-center ">
                <span>{day}</span>
                {
                    holidayData?.find((dayItem) => {
                        return dayItem.day == day
                    })?.status == 0 || holidayData?.find((dayItem) => {
                        return dayItem.day == day
                    })?.status == 2 ? <Badge className="bg-[#dbe2ef] ml-auto dark:bg-[#aa96da]" variant="outline">Work</Badge> : ""
                }
            </div>
            <div>
                <TaskTitle taskList={TaskLIst_estimate} day={day} type={1} getTaskByMonth={getTaskByMonth} />
                <TaskTitle taskList={TaskLIst_actual} day={day} type={2} getTaskByMonth={getTaskByMonth} />
            </div>
        </div>
    </>
}