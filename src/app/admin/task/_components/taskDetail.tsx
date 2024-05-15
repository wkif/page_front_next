"use client"

import { Badge } from "@/components/ui/badge"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { TaskType } from "@/type"
import { TaskLevel } from "@/lib/data"
import { ArrowDownIcon, ArrowLeftIcon, ArrowUpIcon, CheckCircledIcon, CrossCircledIcon, QuestionMarkCircledIcon, StopwatchIcon, ValueIcon } from "@radix-ui/react-icons";

export default function TaskDetail({ data }: { data: TaskType }) {
    const relativeDeviation = ((new Date(data.actualEndDate).getTime() - new Date(data.actualStartDate).getTime() - new Date(data.estimatedEndDate).getTime() + new Date(data.estimatedStartDate).getTime())
        / (
            new Date(data.estimatedEndDate).getTime() - new Date(data.estimatedStartDate).getTime() + 1
        )).toFixed(2);

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

    return (
        <>
            <DialogContent className="max-w-screen-lg">
                <DialogHeader>
                    <DialogTitle>Task Detail</DialogTitle>
                    <Separator />
                    <div className="grid w-full grid-cols-2 gap-4 my-6">
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Main title:</span>
                            <span>{data.mainTitle}</span>
                        </div>
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Title:</span>
                            <span>{data.title}</span>
                        </div>
                        {/* Date */}
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Date:</span>
                            <span>{data.date}</span>
                        </div>
                        {/* arranger */}
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Arranger:</span>
                            <span>{data.arranger}</span>
                        </div>
                        {/* estimatedstartdate */}
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Estimated start date:</span>
                            <span>{data.estimatedStartDate}</span>
                        </div>
                        {/* estimatedenddate */}
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Estimated end date:</span>
                            <span>{data.estimatedEndDate}</span>
                        </div>
                        {/* actualstartdate */}
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Actual start date:</span>
                            <span>{data.actualStartDate}</span>
                        </div>

                        {/* actualenddate */}
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Actual end date:</span>
                            <span>{data.actualEndDate}</span>
                        </div>
                        {/* estimatedworkinghours */}
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Estimated working hours:</span>
                            <span>{data.estimatedWorkingHours} h</span>
                        </div>
                        {/* actualworkinghours */}
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Actual working hours:</span>
                            <span>{data.actualWorkingHours} h</span>
                        </div>

                        {/* status */}
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Status:</span>
                            <span>{
                                <Badge variant="outline" className={
                                    getStatusColorClass(data.status)
                                }>
                                    {
                                        getStatusIcon(data.status)
                                    }
                                    <span className="ml-2">{data.status}</span></Badge>}</span>
                        </div>
                        {/* level */}
                        <div className="w-full flex flex-row items-center">
                            <span className="mr-2">Level:</span>
                            <span>
                                {
                                    <Badge variant="outline" className={
                                        getLevelColorClass(data.level)
                                    }>
                                        {
                                            getLevelIcon(data.level)
                                        }
                                        <span className="ml-2">{TaskLevel.find((item) => item.value === data.level)?.label}</span></Badge>}
                            </span>
                        </div>
                        {/* progress */}
                        <div className="flex flex-row items-center">
                            <span className="mr-2">Progress:</span>
                            <span>{data.progress} %</span>
                        </div>
                        {/* Relative deviation */}
                        <div className={
                            cn(
                                "flex flex-row items-center",
                                Number(relativeDeviation) != 0 ? "text-red-500" : "text-green-500"
                            )
                        }>
                            <span className="mr-2">Relative deviation:</span>
                            <span>
                                {
                                    relativeDeviation
                                }
                            </span>
                        </div>

                        {/* remarks */}
                        <div className="w-full flex flex-row items-center">
                            <span className="mr-2">Remarks:</span>
                            <span>{data.remarks}</span>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </>
    )
}