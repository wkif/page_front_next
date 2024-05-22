"use client"

import { apis } from "@/apis"
import KifPagination from "@/components/kifPagination"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useStore from "@/store/usestore"
import { TaskHistoryType, UserinfoType } from "@/type"
import { PlusCircledIcon, UploadIcon, DownloadIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


import AddDialogComp from "./_components/addDialogComp"
import UploadDialogComp from "./_components/uploadDialog"

export default function DailyTaskPage() {
    const [page, setPage] = useState(1)
    const [list, setList] = useState<Array<TaskHistoryType>>([])
    const [total, setTotal] = useState(0)
    const getList = async (page = 1) => {
        setPage(page)
        const formData = {
            page: page,
            userId: useStore.getState().userInfo?.id,
            type: 1
        }
        const { code, data, msg } = await apis.getHistoryList(formData)
        if (code === 200) {
            setList(data?.list)
            setTotal(data?.total)
        } else {
            toast(msg)
        }
    }
    const [userInfo, setUserInfo] = useState<UserinfoType>()
    const getUserInfo = async () => {
        const { code, data, msg } = await apis.getUserInfo(
            {
                id: useStore.getState().userInfo?.id
            }
        )
        if (code === 200) {
            setUserInfo(data)
        } else {
            toast(msg)
        }
    }
    useEffect(() => {
        getList(1);
        getUserInfo()

    }, [])
    const [open, setOpen] = useState(false)
    const deleteHistoryFile = async (id: number) => {
        const { code, data, msg } = await apis.deleteHistoryFile({
            hisId:id,
            userId: useStore.getState().userInfo?.id
        })
        if (code === 200) {
            toast(msg)
            getList(1)
        } else {
            toast(msg)
        }
    }
    const downloadHistoryFile = async (id: number, name: string) => {
        const {code,data,msg} = await apis.downloadHistoryFile({
            hisId: id,
            userId: useStore.getState().userInfo?.id
        })
        if (code==200) {
            const a = document.createElement('a')
            a.href = data.url
            a.download = name;
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        } else {
            toast('Download failed')
        }
    }
    const sendDailyEmail = async (id: number, hasSend: boolean) => {
        const { code, data, msg } = await apis.sendDailyEmail({
            hisId: id,
            userId: useStore.getState().userInfo?.id,
        })
        if (code === 200) {
            toast(msg)
            getList(1)
        } else {
            toast(msg)
        }
    }
    const downloadTemplate = async () => {
        const {code,data,msg} = await apis.downloadTemplate({
            userId: useStore.getState().userInfo?.id,
            type: 1
        })
        if (code==200) {
            const a = document.createElement('a')
            a.href = data.url
            a.download = data.name;
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        } else {
            toast('Download failed:'+msg)
        }
    }
    const [upload, setUpload] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex flex-row justify-between">
                <div>
                    <h3 className="text-lg font-medium">Daily Task Report</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your daily task report.
                    </p>
                </div>
                <div className="flex flex-row justify-between">
                    {
                        userInfo?.dailyTemplate ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button variant="outline" size="icon" onClick={downloadTemplate}>
                                            <DownloadIcon className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Download daily template file.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : ''
                    }
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button className="ml-2" variant="outline" size="icon" onClick={() => {
                                    setUpload(true)
                                }}>
                                    <UploadIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Upload daily template file.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button className="ml-2" variant="outline" size="icon" onClick={() => {
                                    setOpen(true)
                                }}>
                                    <PlusCircledIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Generate daily files.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>




                </div>
            </div>
            <>
                <Separator />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead className="font-medium text-center w-[240px]">File Name</TableHead>
                            <TableHead className="text-center w-[180px]">Create Time</TableHead>
                            <TableHead className="font-medium text-center w-[140px]">File Hash</TableHead>
                            <TableHead className="font-medium text-center w-[140px]">Report Date</TableHead>
                            <TableHead className="font-medium text-center w-[140px]">Send Email</TableHead>
                            <TableHead className="font-medium text-center w-[140px]">File Exist</TableHead>
                            <TableHead>Option</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            list?.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="font-medium text-center w-[240px]">{item.fileName}</TableCell>
                                    <TableCell className="font-medium text-center w-[180px]">{item.createTime}</TableCell>
                                    <TableCell className="font-medium text-center w-[140px]">{item.fileHash}</TableCell>
                                    <TableCell className="font-medium text-center w-[140px]">{item.reportDate}</TableCell>
                                    <TableCell className="font-medium text-center w-[140px]">{
                                        item.hasSendEmail ? 'Yes' : 'No'
                                    }</TableCell>
                                    <TableCell className="font-medium text-center w-[140px]">{
                                        item.fileExist ? 'Yes' : 'No'
                                    }</TableCell>
                                    <TableCell className="font-medium text-center">
                                        {
                                            item.fileExist ?
                                                <>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Button variant="ghost" className="h-8 mr-4 text-blue-500" onClick={() => downloadHistoryFile(item.id, item.fileName)}>Download</Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Download this daily file.</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    {
                                                        item.hasSendEmail
                                                            ?
                                                            <AlertDialog>
                                                                <AlertDialogTrigger>
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger>
                                                                                <Button variant="ghost" className="h-8 text-purple-500">Send Email</Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>Send the current daily newspaper</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            The email has been sent. This will permanently send your daily task email again!
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => sendDailyEmail(item.id, item.hasSendEmail)}>Continue</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                            :
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Button variant="ghost" className="h-8 mr-4 text-purple-500" onClick={() => sendDailyEmail(item.id, item.hasSendEmail)}>Send Email</Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Send this daily file.</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                    }
                                                    <AlertDialog>
                                                        <AlertDialogTrigger>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Button variant="ghost" className="h-8 text-red-500">Delete</Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Delete this daily file.</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>

                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete your task export file!
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => deleteHistoryFile(item.id)}>Continue</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                                : ''
                                        }



                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <KifPagination currentPage={page} total={total} changePage={getList} />
                <AddDialogComp open={open} setOpen={setOpen} getList={getList} />
                <UploadDialogComp open={upload} setOpen={setUpload} />
            </>
        </div>
    )
}