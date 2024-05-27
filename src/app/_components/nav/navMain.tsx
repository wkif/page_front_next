"use client"

import useStore from "@/store/usestore";
import Image from "next/image";
import { MagnifyingGlassIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"



import { searchEngineList } from "@/lib/data";
import { useEffect, useState } from "react";
import Link from "next/link";

import { apis } from "@/apis";
import { CategoryType, LinkType } from "@/type";
import { toast } from "sonner";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../../../components/ui/command";
import { Separator } from "../../../components/ui/separator";

import News from "./news"

function CommandMenu(
    {
        links
    }: {
        links: LinkType[]
    }
) {
    const [open, setOpen] = useState(false)
    const [searchValList, setSearchValList] = useState<LinkType[]>([])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])
    const filter = (e: string) => {
        const link = links.filter((item) => item.title.includes(e));
        setSearchValList(link)
    }
    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." onValueChange={(e) => {
                if (!e) {
                    setSearchValList([])
                    return
                }
                filter(e)
            }} />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Result">
                    {
                        searchValList?.map(
                            (item) =>
                                <CommandItem key={item.id}>
                                    <Link href={item.url.includes("http") ? item.url : "https://" + item.url}>
                                        {item.title}
                                    </Link>
                                </CommandItem>
                        )
                    }
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}


export default function NavMain() {

    const { searchEngineId, setSearchEngineId, searchHistory, addSearchHistory } = useStore();

    let searchEngine = searchEngineList.find((item) => item.id === searchEngineId);
    if (!searchEngine) {
        setSearchEngineId(searchEngineList[0].id)
        searchEngine = searchEngineList[0];
    }
    const changeSearchEngine = (id: number) => {
        setSearchEngineId(id)
    }
    const [answer, setAnswer] = useState('');
    const search = () => {
        if (!answer) return;
        addSearchHistory(answer);
        searchEngine && window.open(searchEngine.link + answer, "_blank");
    }

    const [categoryList, setCategoryList] = useState<Array<CategoryType>>();
    const [links, setLinks] = useState<Array<LinkType>>();
    const [defaultTab, setDefaultTab] = useState('');

    const getLinks = async () => {
        const { code, data, msg } = await apis.getLinks({ id: useStore.getState().userInfo.id });
        if (code === 200) {
            setLinks(data?.links);
            setCategoryList(data?.categoryList);
            setDefaultTab(data?.categoryList[0]?.typename);
        } else {
            toast(msg)
        }
    }

    const [searchList, setSearchList] = useState<Array<string>>();

    // 搜索联想
    const searchAdvice = async (val: string) => {
        if (!val) {
            setAnswer('')
            setSearchList([])
            return
        }
        setAnswer(val)
        const { code, data } = await apis.searchAdvice({
            keyword: val
        })
        if (code === 200) {
            setSearchList(data)
        } else {
            setSearchList([])
        }

    }
    const sel = (val: string) => {
        setAnswer(val);
        addSearchHistory(val);
        searchEngine && window.open(searchEngine.link + val, "_blank");
    }


    useEffect(() => {
        getLinks()
    }, [])

    return (
        <div className="w-full h-screen p-6  flex flex-col items-center justify-start">
            <div className="w-full flex flex-row items-center justify-center h-10">
                <div className="mr-4">
                    <Popover>
                        <PopoverTrigger>
                            <Image src={searchEngine.icon} alt={searchEngine.name} width={20} height={20} />
                        </PopoverTrigger>
                        <PopoverContent>
                            <RadioGroup defaultValue="0">
                                {
                                    searchEngineList.map((item) => {
                                        return <div className="flex items-center space-x-2" key={item.id}>
                                            <RadioGroupItem value={item.id.toString()} id={item.id.toString()} onClick={() => changeSearchEngine(item.id)} />
                                            <Label htmlFor={item.id.toString()}>
                                                <div className="flex items-center space-x-2 cursor-pointer"><Image className="mr-2" src={item.icon} alt={item.name} width={10} height={10} />{item.name}</div>
                                            </Label>
                                        </div>
                                    })
                                }
                            </RadioGroup>
                        </PopoverContent>
                    </Popover>

                </div>
                <div className="border rounded w-1/2 h-10">
                    <input className="w-full h-full px-4 border-none outline-none dark:bg-gray-900" type="text" value={answer} onChange={(e) => searchAdvice(e.target.value)} placeholder="请输入搜索内容" onKeyDown={(e) => e.key === 'Enter' && search()} />
                </div>

                <div className="ml-4">
                    <MagnifyingGlassIcon className="cursor-pointer w-5 h-5" onClick={search} />
                </div>
            </div>
            {searchList?.length ? <div className="absolute top-16 mt-2 py-2 w-1/3 text-center max-h-48 overflow-auto bg-slate-100 dark:bg-gray-900 opacity-60">
                {
                    searchList?.map((item) => {
                        return <div key={item} className="w-full mt-4" onClick={() => sel(item)}>
                            <Badge variant="secondary">
                                {item}
                            </Badge>
                        </div>
                    })
                }

            </div>
                : ''
            }
            <div className="w-full mt-6">
                <Tabs defaultValue='home'>
                    <TabsList className="w-full bg-transparent h-10">
                        <TabsTrigger value='home'>Home</TabsTrigger>
                        {
                            categoryList?.map((item) => {
                                return <TabsTrigger key={item.id} value={item.typename}>{item.typename}</TabsTrigger>
                            })
                        }
                    </TabsList>
                    <Separator className="my-2" />
                    <div className="w-full h-full max-h-[calc(100vh-180px)] overflow-auto flex flex-row items-center justify-start flex-wrap">
                        <TabsContent className="m-3 w-full" value="home">
                            <News />
                        </TabsContent>
                        {
                            links?.map((item) => {
                                return <TabsContent className="m-3 w-1/6" key={item.id} value={item.category.typename}>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-ellipsis text-nowrap text-lg">
                                                <Link href={item.url.includes("http") ? item.url : "https://" + item.url} target="_blank">{item.title}</Link>
                                            </CardTitle>
                                            <CardDescription className="text-ellipsis text-nowrap text-xs">{item.description}</CardDescription>
                                        </CardHeader>
                                        <CardFooter className="flex flex-col items-center justify-start">
                                            <div className="flex flex-row items-center justify-start h-8"> <p>
                                                {
                                                    item.tags ? item.tags.split(",").map((tag) => {
                                                        return <Badge key={tag} variant="secondary">{tag}</Badge>
                                                    }) : ''
                                                }
                                            </p></div>
                                            <Separator className="my-2" />
                                            <div className="flex flex-row items-center justify-start h-8">
                                                {
                                                    item.github ? <GitHubLogoIcon className="cursor-pointer w-5 h-5" onClick={() => window.open(item.github, "_blank")} /> : ''
                                                }
                                            </div>
                                        </CardFooter>
                                    </Card>

                                </TabsContent>
                            })
                        }
                    </div>
                </Tabs>
            </div>
            {/* {
                links && <CommandMenu links={links} />
            } */}

        </div>
    )
}