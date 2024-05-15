
"use client"

import { Button } from "@/components/ui/button"
import TableComp from "./_components/table"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import AddDialogCom from "./_components/edit"
import { useEffect, useState } from "react"
import { CategoryType } from "@/type"
import { apis } from "@/apis"
import useStore from "@/store/usestore"
import { toast } from "sonner"

export default function LinkPage() {
    const [catOptions, setCatOptions] = useState<Array<CategoryType>>([]);
    const getCategoryList = async () => {
        const { code, data, msg } = await apis.getCategoryList(
            {
                id: useStore.getState().userInfo?.id
            }
        );
        if (code === 200) {
            setCatOptions(data.categoryList)
            console.log('catOptions', catOptions, data.categoryList)
        } else {
            toast(msg)
        }
    }
    useEffect(() => {
        getCategoryList()
    }, [])
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Links</h3>
                    <p className="text-sm text-muted-foreground">
                        This is link manage page.
                    </p>
                </div>
                <div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <PlusCircledIcon className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                            <AddDialogCom catOptions={catOptions} getCategoryList={getCategoryList} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="px-5">
                <TableComp catOptions={catOptions} />
            </div>
        </div>
    )
}