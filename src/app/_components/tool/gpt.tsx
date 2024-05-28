import {
    Drawer,
    DrawerContent,
} from "@/components/ui/drawer"

import { useState } from "react"


export default function Gpt() {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Drawer open={open} onOpenChange={setOpen} direction="right">
                <DrawerContent className="h-[80vh]">
                    <iframe src="https://nextchatweb-kif.vercel.app/" style={{ width: '100%', height: '100%' }}></iframe>
                </DrawerContent>
            </Drawer>


            <div className="absolute right-14 bottom-14 w-10 h-10 bg-white dark:bg-zinc-900 rounded-full text-center line-height-10" onClick={() => setOpen(!open)}>
                Gpt
            </div>
        </>
    )
}