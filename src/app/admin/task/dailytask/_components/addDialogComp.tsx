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
    const [date, setDate] = useState<string>('')
    const submit = async () => {
        if (!date) {
            toast("Please select date")
            return
        }
        const { code, data, msg } = await apis.exportDaily({
            date: date,
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
                    {/* date */}
                    <div className="flex flex-row items-center">
                        <span className="mr-2">Date:</span>
                        <DatePicker date={date ? new Date(date) : undefined} setDate={
                            (date) => setDate(date ? format(date, 'yyyy-MM-dd') : "")
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