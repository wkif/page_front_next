import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function DownloadDialogComp({
    open,
    setOpen,
    link,
    getList
}: {
    open: boolean
    setOpen: (open: boolean) => void
    link: string
    getList: (page: number) => void
}) {

    return <>

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-screen-sm">
                <DialogHeader>
                    <DialogTitle>
                        Download Link
                    </DialogTitle>
                    <Separator />
                </DialogHeader>
                <div className="grid w-full my-6">
                    {/* date */}
                    <div className="flex flex-col items-center">
                        <div className="text-sm py-8 text-blue-400 break-all cursor-pointer" onClick={() => {
                            window.open(link)
                        }}>{link}</div>

                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button type="button" size="sm" onClick={() => { navigator.clipboard.writeText(link) }}>
                        Copy
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>

                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}