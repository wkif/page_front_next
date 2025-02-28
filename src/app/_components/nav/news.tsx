import { GearIcon } from "@radix-ui/react-icons"
import axios from "axios"

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
import Loading from "@/components/loading"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

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
        if (!useStore.getState().userInfo?.id) {
            setSetting(false)
            return
        }
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
        const newsTypes = useStore.getState().userInfo.newsTypes ? useStore.getState().userInfo.newsTypes : 'bilibili,weibo,zhihu,douyin,sspai,36kr,ithome,juejin,toutiao,douban-movie'
        const newsTypeList = newsTypes.split(",")
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
                                    <div className="flex justify-between items-center" key={item.id}>
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
                                    {item.check ? <NewList type={item.type} img={item.img} key={item.id} /> : ''}
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
    const [data, setData] = useState<NewResType>();
    const [loading, setLoading] = useState(false)
    const getData = async () => {
        setLoading(true)
        const res = await apis.getNewsApi({ type }) as unknown as NewResType
        setLoading(false)
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
        {loading && <div className="w-1/6 min-w-[250px] h-[350px] border m-1 p-4 rounded-lg dark:bg-zinc-800/50 dark:border-zinc-700 bg-white shadow-sm animate-pulse">
            <Loading loading={loading} />
        </div>}

        {
            !loading && data &&
            <div className="w-1/6 min-w-[250px] h-[350px] border m-1 rounded-lg dark:bg-zinc-800/90 dark:border-zinc-700 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-row items-center justify-between h-[40px] px-4 pt-3 border-b dark:border-zinc-700">
                    <div className="flex flex-row items-center">
                        <div className="bg-gray-50 dark:bg-zinc-700 p-1.5 rounded-md mr-2">
                            <Image src={img} className="w-5 h-5" alt={data.title} />
                        </div>
                        <span className="text-sm font-medium">{data.title}</span>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-700 rounded">{data.type}</span>
                </div>
                <div className="p-2 h-[260px] overflow-auto scrollbar-thin">
                    {
                        data.data.map((item, index) => {
                            return <>
                                <Link href={item.url} target="_blank" key={item.id || `news-item-${index}`}>
                                    <div className="px-3 py-2 my-1 flex items-center text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 rounded-md transition-colors group">
                                        <div className="w-5 h-5 mr-2 flex items-center justify-center bg-gray-100 dark:bg-zinc-700 rounded-full text-[10px] text-gray-500 dark:text-gray-300 font-medium">
                                            {index + 1}
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="truncate group-hover:text-blue-500 transition-colors max-w-full">
                                                        {item.title}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs text-xs">{item.title}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </Link>
                            </>
                        })
                    }
                </div>
                <div className="h-[50px] px-4 pt-2 flex justify-between items-center border-t dark:border-zinc-700">
                    <span className="text-xs text-gray-500">{getTime(data.updateTime)}更新</span>
                    <div className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors" onClick={() => getData()}>
                        <UpdateIcon className="w-4 h-4 text-gray-500" />
                    </div>
                </div>
            </div>
        }
    </>
}