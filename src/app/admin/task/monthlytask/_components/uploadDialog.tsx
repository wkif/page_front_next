import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { apis } from "@/apis";
import useStore from "@/store/usestore";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TemplateImg from "@/assets/template_2.png"
import Image from 'next/image'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function UploadDialogComp({
    open,
    setOpen,
}: {
    open: boolean
    setOpen: (open: boolean) => void
}) {
    const [file, setFile] = useState<any>()
    const submit = async () => {
        if (!file) {
            toast("Please select file")
            return
        }
        const form = new FormData()
        form.append('userId', useStore.getState().userInfo?.id.toString())
        form.append('type', '2')
        form.append('file', file)

        const { code, data, msg } = await apis.uploadTemplate(form)
        if (code === 200) {
            toast(msg)
            setOpen(false)
        } else {
            toast(msg)
        }
    }

    const TableData: Array<{
        Parameters: string
        Value: string
        Remarks: string
    }> = [
            {
                Parameters: "{{no}}",
                Value: "index number",
                Remarks: "Serial number"
            },
            {
                Parameters: "{{startDate}}",
                Value: "startDate",
                Remarks: "Start date"
            },
            {
                Parameters: "{{endDate}}",
                Value: "endDate",
                Remarks: "End date"
            },
            {
                Parameters: "{{username}}",
                Value: "username",
                Remarks: "User name"
            },
            {
                Parameters: "{{title}}",
                Value: "title",
                Remarks: "Task name"
            },
            {
                Parameters: "{{mainTitle}}",
                Value: "main title",
                Remarks: "the main title of the task"
            },
            {
                Parameters: "{fullTitle}}",
                Value: "mainTitle-title",
                Remarks: "The full title of the task"
            },
            {
                Parameters: "{{arranger}}",
                Value: "arranger",
                Remarks: "the arranger of the task"
            },
            {
                Parameters: "{{progress}}",
                Value: "progress",
                Remarks: "The progress of the task"
            },
            {
                Parameters: "{{estimatedWorkingHours}}",
                Value: "estimatedWorkingHours",
                Remarks: "The estimated working hours of the task"
            },
            {
                Parameters: "{{estimatedStartDate}}",
                Value: "estimatedStartDate",
                Remarks: "The estimated start date of the task"
            },
            {
                Parameters: "{{estimatedEndDate}}",
                Value: "estimatedEndDate",
                Remarks: "The estimated end date of the task"
            },
            {
                Parameters: "{{actualWorkingHours}}",
                Value: "actualWorkingHours",
                Remarks: "The actual working hours of the task"
            },
            {
                Parameters: "{{actualStartDate}}",
                Value: "actualStartDate",
                Remarks: "The actual start date of the task"
            },
            {
                Parameters: "{{actualEndDate}}",
                Value: "actualEndDate",
                Remarks: "The actual end date of the task"
            },
            {
                Parameters: "{{status}}",
                Value: "status",
                Remarks: "The status of the task"
            },
            {
                Parameters: "{{remarks}}",
                Value: "remarks",
                Remarks: "The remarks of the task"
            }
        ]

    return <>

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-screen-md">
                <DialogHeader>
                    <DialogTitle>
                        Task Report Template Manage
                    </DialogTitle>
                    <DialogDescription>
                        You can export the data by using the parameters of the following table in the excel form
                    </DialogDescription>
                    <Separator />
                </DialogHeader>
                <div className="w-full mb-6 flex flex-col ">
                    <div className="mb-6">
                        <span className="text-red-500">Tips: Please make sure that the uploaded template file is not encrypted. For more information, please see <a className="text-blue-500" href="https://github.com/wkif/ldDecrypt">ldDecrypt</a> , there is a template image:  </span>
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <span className="text-blue-500 text-sm cursor-pointer">template image</span>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-full">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Template Image</AlertDialogTitle>
                                </AlertDialogHeader>
                                <div className="w-full flex justify-center">
                                    <Image
                                        src={TemplateImg}
                                        alt="Picture of the author"
                                        width={1000}
                                        height={1000}
                                    />
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Return</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <Separator />
                    <div className="flex flex-row items-center mt-4">
                        <span className="mr-2">Monthly Template</span>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Input id="picture" type="file" onChange={(e) => setFile(e.target.files?.[0])} />
                        </div>
                        <div>
                        </div>
                    </div>
                    <div className="w-full mt-4">
                        <Separator />
                        <div className="max-h-[500px] overflow-auto">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Parameters</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Remarks</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        TableData.map((item, index) => {
                                            return <TableRow key={index}>
                                                <TableCell>
                                                    <span className="text-green-500">{item.Parameters}</span>
                                                </TableCell>
                                                <TableCell>{item.Value}</TableCell>
                                                <TableCell>{item.Remarks}</TableCell>
                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </div>
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
    </>
}