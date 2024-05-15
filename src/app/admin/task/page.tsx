"use client"


import { apis } from "@/apis"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"


import KifPagination from "@/components/kifPagination"

import useStore from "@/store/usestore"
import { CrumpledPaperIcon, MagnifyingGlassIcon, PlusCircledIcon, ValueIcon, CheckCircledIcon, StopwatchIcon, CrossCircledIcon, QuestionMarkCircledIcon, ArrowUpIcon, ArrowLeftIcon, ArrowDownIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { TaskType } from "@/type"
import { cn } from "@/lib/utils"
import { formatDate } from "date-fns"
import { DatePicker } from "@/components/DatePicker"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { statusOptions, TaskLevel } from "@/lib/data"

import EditTask from "./_components/editDialog"
import TaskDetail from "./_components/taskDetail"

export default function TaskPage() {

    const [title, setTitle] = useState("")
    const [mainTitle, setMainTitle] = useState("")
    const [status, setStatus] = useState('')
    const [level, setLevel] = useState<number>(-1)
    const [date, setDate] = useState<Date>()
    const changeDate = (date: Date | undefined) => {
        date && setDate(date)
    }

    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [listData, setListData] = useState<Array<TaskType>>([])
    const getList = async (page = 1) => {
        setPage(page)
        const formData = {
            userId: useStore.getState().userInfo?.id,
            page: page,
            title: title,
            mainTitle: mainTitle,
            status: status,
            date: date && formatDate(date, "yyyy-MM-dd"),
            level: level == -1 ? '' : level
        }
        const { code, data, msg } = await apis.getTaskList(formData)
        if (code === 200) {
            setListData(data?.tasks)
            setTotal(data?.total)
        } else {
            toast(msg)
        }
    }
    const clear = () => {
        setTitle("")
        setMainTitle("")
        setStatus("")
        setLevel(-1)
        setDate(undefined)
    }
    const deleteTask = async (id: number) => {
        const { code, data, msg } = await apis.deleteTask(
            {
                id,
                userId: useStore.getState().userInfo?.id
            }
        )
        if (code === 200) {
            getList(1)
        } else {
            toast(msg)
        }
    }
    const [selTaskId, setSelTaskId] = useState(0)
    const [open, setOpen] = useState(false)

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Done':
                return <CheckCircledIcon />
            case 'Todo':
                return <ValueIcon />
            case 'Doing':
                return <StopwatchIcon />
            case "Cancel":
                return <CrossCircledIcon />
            case 'Test':
                return <QuestionMarkCircledIcon />
            default:
                return ''
        }
    }
    const getStatusColorClass = (status: string) => {
        switch (status) {
            case 'Done':
                return "text-green-400"
            case 'Todo':
                return "text-blue-400"
            case 'Doing':
                return "text-yellow-400"
            case "Cancel":
                return "text-red-400"
            case 'Test':
                return "text-purple-400"
            default:
                return ''
        }
    }
    const getLevelIcon = (level: number) => {
        switch (level) {
            case 0:
                return <ArrowDownIcon />
            case 1:
                return <ArrowLeftIcon />
            case 2:
                return <ArrowUpIcon />
            default:
                return ''
        }
    }
    const getLevelColorClass = (level: number) => {
        switch (level) {
            case 0:
                return "text-green-400"
            case 1:
                return "text-blue-400"
            case 2:
                return "text-yellow-400"
            default:
                return ''
        }
    }

    useEffect(() => {
        getList(1)
    }, [])

    return (
        <div className="space-y-6">

            <div className="flex flex-row justify-between">
                <div>
                    <h3 className="text-lg font-medium">Task</h3>
                    <p className="text-sm text-muted-foreground">
                        Here is a list of your tasks for this month!
                    </p>
                </div>

                <Button variant="outline" size="icon" onClick={() => {
                    setSelTaskId(0)
                    setOpen(true)
                }}>
                    <PlusCircledIcon className="h-4 w-4" />
                </Button>
            </div>

            <>
                <Separator />
                <div className="flex flex-row flex-wrap items-center my-4">
                    <Input className="max-w-[200px] mr-4" placeholder="Main Title" value={mainTitle} onChange={(e) => setMainTitle(e.target.value)} />
                    <Input className="max-w-[200px] mr-4" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <DatePicker date={date} setDate={changeDate} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="ml-4" variant="outline"><PlusCircledIcon className={cn("mr-2 h-4 w-4", getStatusColorClass(status))} />
                                {
                                    status ? <span className={getStatusColorClass(status)}>{status}</span> : "Status"
                                }
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            {
                                statusOptions?.map((item) => (
                                    <DropdownMenuCheckboxItem
                                        key={item.value}
                                        checked={item.value === status}
                                        onClick={() => setStatus(item.value)}
                                        className={getStatusColorClass(item.value)}
                                    >
                                        {item.label}
                                    </DropdownMenuCheckboxItem>
                                ))
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="ml-4" variant="outline"><PlusCircledIcon className={cn("mr-2 h-4 w-4", getLevelColorClass(level))} />
                                {
                                    TaskLevel.find((item) => item.value === level) ? <span className={
                                        getLevelColorClass(level)
                                    }>{
                                            TaskLevel.find((item) => item.value === level)?.label
                                        }</span> : "Level"
                                }
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            {
                                TaskLevel?.map((item: {
                                    label: string
                                    value: number
                                }) => (
                                    <DropdownMenuCheckboxItem
                                        key={item.value}
                                        checked={item.value === level}
                                        onClick={() => setLevel(item.value)}
                                        className={
                                            getLevelColorClass(item.value)
                                        }
                                    >
                                        {item.label}
                                    </DropdownMenuCheckboxItem>
                                ))
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="ml-4" variant="outline" onClick={() => getList(1)}>
                        <MagnifyingGlassIcon className="h-4 w-4 mr-2" /> Search
                    </Button>
                    <Button className="ml-4" variant="outline" onClick={() => clear()}>
                        <CrumpledPaperIcon className="h-4 w-4 mr-2" /> Clear
                    </Button>
                </div>
                <Separator />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead>MainTitle</TableHead>
                            <TableHead className="w-[300px]">Title</TableHead>
                            <TableHead className="text-center w-[140px]">Date</TableHead>
                            {/* status */}
                            <TableHead>Status</TableHead>
                            {/* level */}
                            <TableHead>Level</TableHead>
                            {/* progress */}
                            <TableHead>Progress</TableHead>
                            {/* remarks */}
                            <TableHead>Remarks</TableHead>
                            <TableHead>Option</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listData?.map((task, index) => (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="font-medium w-[300px]">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="w-[300px] text-ellipsis overflow-hidden whitespace-nowrap">{task.mainTitle}</span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{task.mainTitle}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell className="font-medium w-[300px]">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="w-[300px] text-ellipsis overflow-hidden whitespace-nowrap">{task.title}</span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{task.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell className="font-medium text-center w-[140px]">{task.date}</TableCell>
                                <TableCell>
                                    <div className={
                                        cn(
                                            "font-medium flex flex-row items-center",
                                            getStatusColorClass(task.status)
                                        )
                                    }>
                                        {
                                            getStatusIcon(task.status)
                                        }
                                        <span className="ml-2">
                                            {
                                                task.status
                                            }
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium ">
                                    <div className={
                                        cn(
                                            "font-medium flex flex-row items-center",
                                            getLevelColorClass(task.level)
                                        )
                                    }>{
                                            getLevelIcon(task.level)
                                        } <span className="ml-2">{TaskLevel.find((item) => item.value === task.level)?.label} </span></div>
                                </TableCell>
                                <TableCell className="font-medium">{task.progress} %</TableCell>
                                <TableCell className="font-medium">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="w-[300px] text-ellipsis overflow-hidden whitespace-nowrap">{task.remarks}</span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{task.remarks}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Dialog>
                                        <DialogTrigger>
                                            <Button variant="ghost" className="w-8 h-8 mr-4 text-green-500">Detail</Button>
                                        </DialogTrigger>
                                        <TaskDetail data={task} />
                                    </Dialog>
                                    <Button variant="ghost" className="w-8 h-8 mr-4 text-blue-500" onClick={() => {
                                        setSelTaskId(task.id);
                                        setOpen(true);
                                    }}>Edit</Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <Button variant="ghost" className="w-8 h-8 text-red-500">Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your task!
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteTask(task.id)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <KifPagination currentPage={page} total={total} changePage={getList} />
            </>
            <EditTask open={open} taskId={selTaskId} setOpen={setOpen} getList={getList} />
        </div>
    )
}