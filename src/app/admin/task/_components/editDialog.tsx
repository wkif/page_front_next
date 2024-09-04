import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { apis } from "@/apis";
import { useState, useEffect } from "react";
import useStore from "@/store/usestore";
import { toast } from "sonner";
import useWatch from "@/hooks/useWatch"
import { statusOptions, TaskLevel } from "@/lib/data";
import { DatePicker } from "@/components/DatePicker";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowDownIcon, ArrowLeftIcon, ArrowUpIcon, CheckCircledIcon, CrossCircledIcon, QuestionMarkCircledIcon, StopwatchIcon, ValueIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";


export default function EditTask(
    {
        open,
        setOpen,
        getList,
        taskId
    }: {
        open: boolean
        setOpen: (open: boolean) => void
        getList: (page: number) => void
        taskId: number
    }
) {
    const [form, setForm] = useState<{
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
        level: number | null
    }>({
        id: 0,
        title: "",
        mainTitle: "",
        date: "",
        arranger: "",
        estimatedWorkingHours: 0,
        estimatedStartDate: "",
        estimatedEndDate: "",
        actualWorkingHours: 0,
        actualStartDate: "",
        actualEndDate: "",
        status: "",
        progress: 0,
        remarks: "",
        level: null
    })
    const getTaskById = async () => {
        if (!taskId) {
            setForm({
                id: 0,
                title: "",
                mainTitle: "",
                date: "",
                arranger: "",
                estimatedWorkingHours: 0,
                estimatedStartDate: "",
                estimatedEndDate: "",
                actualWorkingHours: 0,
                actualStartDate: "",
                actualEndDate: "",
                status: "",
                progress: 0,
                remarks: "",
                level: null
            })
            return
        }
        const { code, data, msg } = await apis.getTaskById(
            {
                id: taskId,
                userId: useStore.getState().userInfo?.id
            }
        )
        if (code === 200) {
            setForm(data)
        } else {
            toast(msg)
        }
    }

    const submit = async () => {
        if (!taskId) {
            // add
            const { code, data, msg } = await apis.addTask(
                {
                    ...form,
                    userId: useStore.getState().userInfo?.id
                }
            )
            if (code === 200) {
                setOpen(false)
                toast(msg)
            } else {
                toast(msg)
            }
        }
        else {
            // edit
            const { code, data, msg } = await apis.editTask(
                {
                    ...form,
                    userId: useStore.getState().userInfo?.id
                }
            )
            if (code === 200) {
                setOpen(false)
                toast(msg)
            } else {
                toast(msg)
            }
        }
        getList(1)
    }

    useEffect(() => {
        getTaskById()
    }, [taskId])


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

    return (<>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-screen-xl">
                <DialogHeader>
                    <DialogTitle>
                        {
                            taskId ? 'Edit Task' : 'Add Task'
                        }
                    </DialogTitle>
                    <Separator />
                </DialogHeader>
                <div className="grid w-full grid-cols-2 gap-4 my-6">
                    <div className="flex flex-row items-center">
                        <span className="mr-2 after:content-['*'] after:ml-2 after:mr-2 after:text-red-400">Main title: </span>
                        <Input type="text"
                            value={form?.mainTitle}
                            onChange={(e) => setForm({ ...form, mainTitle: e.target.value })}
                            placeholder="main title" />
                    </div>
                    {/* title */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2 after:content-['*'] after:ml-2 after:mr-2 after:text-red-400">Title:</span>
                        <Input type="text"
                            value={form?.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="title" />
                    </div>
                    {/* arranger */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2 after:content-['*'] after:ml-2 after:mr-2 after:text-red-400">Arranger:</span>
                        <Input type="text"
                            value={form?.arranger}
                            onChange={(e) => setForm({ ...form, arranger: e.target.value })}
                            placeholder="arranger" />
                    </div>
                    {/* date */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2 after:content-['*'] after:ml-2 after:mr-2 after:text-red-400">Date:</span>
                        <DatePicker date={form?.date ? new Date(form.date) : undefined} setDate={
                            (date) => {
                                setForm({
                                    ...form,
                                    date: date ? format(date, 'yyyy-MM-dd') : "",
                                    estimatedStartDate: date ? format(date, 'yyyy-MM-dd') : "",
                                    estimatedEndDate: date ? format(date, 'yyyy-MM-dd') : "",
                                    actualStartDate: date ? format(date, 'yyyy-MM-dd') : "",
                                    actualEndDate: date ? format(date, 'yyyy-MM-dd') : "",
                                });
                            }
                        } />
                    </div>
                    {/* estimatedstartdate */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2 after:content-['*'] after:ml-2 after:mr-2 after:text-red-400">Estimated Start Date:</span>
                        <DatePicker date={form?.estimatedStartDate ? new Date(form.estimatedStartDate) : undefined} setDate={
                            (date) => setForm({ ...form, estimatedStartDate: date ? format(date, 'yyyy-MM-dd') : "" })
                        }
                        />
                    </div>
                    {/* actualstartdate */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2">Actual Start Date:</span>
                        <DatePicker date={form?.actualStartDate ? new Date(form.actualStartDate) : undefined} setDate={
                            (date) => setForm({ ...form, actualStartDate: date ? format(date, 'yyyy-MM-dd') : "" })
                        }
                        />
                    </div>
                    {/* estimatedenddate */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2 after:content-['*'] after:ml-2 after:mr-2 after:text-red-400">Estimated End Date:</span>
                        <DatePicker date={form?.estimatedEndDate ? new Date(form.estimatedEndDate) : undefined} setDate={

                            (date) => setForm({ ...form, estimatedEndDate: date ? format(date, 'yyyy-MM-dd') : "" })
                        }
                        />
                    </div>
                    {/* actualenddate */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2">Actual End Date:</span>
                        <DatePicker date={form?.actualEndDate ? new Date(form.actualEndDate) : undefined} setDate={
                            (date) => setForm({ ...form, actualEndDate: date ? format(date, 'yyyy-MM-dd') : "" })
                        }
                        />
                    </div>
                    {/* estimatedworkinghours */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2 after:content-['*'] after:ml-2 after:mr-2 after:text-red-400">Estimated Working Hours:</span>
                        <Input type="number"
                            value={form?.estimatedWorkingHours}
                            onChange={(e) => setForm({ ...form, estimatedWorkingHours: Number(e.target.value), actualWorkingHours: Number(e.target.value) })}
                            placeholder="estimated working hours" />
                    </div>
                    {/* actualworkinghours */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2">Actual Working Hours:</span>
                        <Input type="number"
                            value={form?.actualWorkingHours}
                            onChange={(e) => setForm({ ...form, actualWorkingHours: Number(e.target.value) })}
                            placeholder="actual working hours" />
                    </div>
                    {/* status */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2 after:content-['*'] after:ml-2 after:mr-2 after:text-red-400">Status:</span>
                        <Select value={
                            statusOptions.find((status) => status.value === form?.status)?.label
                        } onValueChange={(value) => setForm({ ...form, status: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    statusOptions.map((status) => <SelectItem key={status.value} value={status.value}>
                                        <span className={
                                            cn(
                                                "flex flex-row items-center",
                                                getStatusColorClass(status.value)
                                            )
                                        }>
                                            {getStatusIcon(status.value)}
                                            <span className="ml-2">{status.label}</span>
                                        </span>
                                    </SelectItem>)
                                }
                            </SelectContent>
                        </Select>

                    </div>

                    {/* level */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2 after:content-['*'] after:ml-2 after:mr-2 after:text-red-400">Level:</span>
                        <Select value={
                            form.level?.toString()
                        }
                            onValueChange={(value) => {
                                setForm({ ...form, level: Number(value) })
                            }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a level" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    TaskLevel.map((level) => <SelectItem key={level.value} value={level.value.toString()}>
                                        <span className={
                                            cn(
                                                "flex flex-row items-center",
                                                getLevelColorClass(level.value)
                                            )
                                        }>
                                            {
                                                getLevelIcon(level.value)
                                            }
                                            <span className="ml-2">{level.label}</span>
                                        </span>
                                    </SelectItem>)
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    {/* progress */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2 after:content-['*'] after:ml-2 after:mr-2 after:text-red-400">Progress:</span>
                        <div className=" w-full flex flex-row items-center mx-6">
                            <Slider value={[form?.progress]} onValueChange={(value) => setForm({ ...form, progress: value[0] })} max={100} step={1} />
                            {
                                form?.progress ? <span className="ml-2">{form?.progress}%</span> : <span className="ml-2">0%</span>
                            }
                        </div>
                    </div>



                    {/* remarks */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2">Remarks:</span>
                        <Textarea value={form?.remarks}
                            onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Type your remarks here." />
                    </div>

                </div>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="submit" onClick={submit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>)
}