import { GearIcon } from "@radix-ui/react-icons"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import useStore from "@/store/usestore"
import { apis } from "@/apis"
import { toast } from "sonner"
import { StaticImageData } from "next/image"
import { typeData } from "@/lib/data"
import Image from "next/image"
import Link from "next/link";
import { UpdateIcon } from "@radix-ui/react-icons"
export default function News() {
    const [setting, setSetting] = useState(false)
    const [typeList, setTypeList] = useState<Array<{
        id: number
        name: string
        type: string
        img: StaticImageData
        check: boolean
    }>>(
        typeData
    )
    const onChange = (id: number) => {
        const newList = typeList.map((item) => {
            if (item.id === id) {
                item.check = !item.check
            }
            return item
        })
        setTypeList(newList)
    }
    const submit = async () => {
        const list = typeList
        const newsTypeList = list
            .filter((item) => item.check)
            .map((item) => item.type)
        const { data, code, msg } = await apis.updateNewsTypes({
            id: useStore.getState().userInfo?.id,
            newsTypes: newsTypeList.join(",")
        })
        if (code === 200) {
            const userInfo = useStore.getState().userInfo
            userInfo.newsTypes = newsTypeList.join(",")
            useStore.setState({ userInfo })
            setSetting(false)
            toast(msg)
        } else {
            toast(msg)
        }

    }
    useEffect(() => {
        const newsTypeList = useStore.getState().userInfo.newsTypes.split(",");
        const list = typeList;
        newsTypeList.forEach((item) => {
            list.find((type) => {
                if (type.type === item) {
                    type.check = true;
                }
            })
        })
        setTypeList(list)
    }, [])
    return (
        <>
            <Dialog open={setting} onOpenChange={setSetting}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select which news to show</DialogTitle>
                    </DialogHeader>
                    <Separator className="my-2" />
                    <div className="space-y-6 px-10">
                        {
                            typeList.map((item) => {
                                return <>
                                    <div className="flex justify-between items-center">
                                        {item.name}
                                        <Switch
                                            checked={item.check}
                                            onCheckedChange={() => onChange(item.id)}
                                        />
                                    </div>
                                </>
                            })
                        }
                    </div>
                    <Separator className="my-2" />
                    <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button type="button" variant="secondary" onClick={submit}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="space-y-6 w-full">
                <div>
                    <div className="text-sm flex justify-end">
                        <GearIcon onClick={() => setSetting(true)} />
                    </div>
                    <div className="flex justify-center mt-4 flex-row flex-wrap">
                        {
                            typeList.map((item) => {
                                return <>
                                    {item.check ? <NewList type={item.type} img={item.img} /> : ''}
                                </>
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

function NewList(
    {
        type,
        img
    }: {
        type: string
        img: StaticImageData
    }
) {
    interface NewResType {
        code: number
        data: any[]
        title: string
        type: string
        total: number
        updateTime: string
    }
    const [data, setData] = useState<NewResType>()
    const getData = async () => {
        const res = await apis.getNewsApi({ type }) as unknown as NewResType
        if (res.code === 200) {
            setData(res)
        } else {
        }
    }

    useEffect(() => {
        getData()
    }, [])
    const getTime = (time: string) => {
        // 2024-05-23T06:44:37.089Z
        // 距现在多少秒
        const now = new Date().getTime() / 1000
        const diff = Number((now - new Date(time).getTime() / 1000).toFixed(2))
        if (diff < 60) {
            return `${diff}秒前`
        }
        if (diff < 3600) {
            return `${Math.floor(diff / 60)}分钟前`
        }
        if (diff < 86400) {
            return `${Math.floor(diff / 3600)}小时前`
        }
        if (diff < 2592000) {
            return `${Math.floor(diff / 86400)}天前`
        }
        if (diff < 31536000) {
            return `${Math.floor(diff / 2592000)}月前`
        }
    }
    if (!data) {
        return <></>
    }
    return <>


        <div className="w-1/6 h-[350px] border m-1 p-4 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 bg-white hover:shadow-lg">
            <div className="flex flex-row items-center justify-between h-[30px]">
                <div className="flex flex-row items-center">
                    <Image src={img} className="w-5 h-5 mr-3" alt={data.title} />
                    <span className="text-sm">{data.title}</span>
                </div>
                <span className="text-xs">{data.type}</span>
            </div>
            <div className="mt-4 h-[240px] overflow-auto">
                {
                    data.data.map((item, index) => {
                        return <>
                            <Link href={item.url} target="_blank">
                                <div className="p-2 flex items-center  text-xs text-gray-500 ">
                                    <div className="w-2 h-2 mr-3">{index + 1}</div>
                                    <span className="truncate">{item.title}</span>
                                </div>
                            </Link>
                        </>
                    })
                }
            </div>
            <div className="h-[30px] pt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">{getTime(data.updateTime)}更新</span>
                <UpdateIcon className="w-4 h-4 text-gray-500 cursor-pointer" onClick={() => getData()} />
            </div>
        </div>
    </>
}