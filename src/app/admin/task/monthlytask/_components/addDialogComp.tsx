import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DatePicker } from "@/components/DatePicker"
import { format } from "date-fns"
import { useState } from "react";
import { toast } from "sonner";
import { apis } from "@/apis";
import useStore from "@/store/usestore";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function AddDialogComp({
    open,
    setOpen,
    getList
}: {
    open: boolean
    setOpen: (open: boolean) => void
    getList: (page: number) => void
}) {
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const submit = async () => {
        if (!startDate || !endDate) {
            toast("Please select date")
            return
        }
        const { code, data, msg } = await apis.exportMonthly({
            startDate,
            endDate,
            userId: useStore.getState().userInfo?.id
        })
        if (code === 200) {
            toast(msg)
            setOpen(false)
            getList(1)
        } else {
            toast(msg)
        }
    }

    return <>

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-screen-sm">
                <DialogHeader>
                    <DialogTitle>
                        Export Task
                    </DialogTitle>
                    <Separator />
                </DialogHeader>
                <div className="grid w-full grid-cols-2 gap-4 my-6">
                    <div className="flex flex-row items-center">
                        <span className="mr-2">Start Date:</span>
                        <DatePicker date={startDate ? new Date(startDate) : undefined} setDate={
                            (date) => setStartDate(date ? format(date, 'yyyy-MM-dd') : "")
                        } />
                    </div>
                    {/* end date */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2">End Date:</span>
                        <DatePicker date={endDate ? new Date(endDate) : undefined} setDate={
                            (date) => setEndDate(date ? format(date, 'yyyy-MM-dd') : "")
                        } />
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