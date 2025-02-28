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
import { Button } from "@/components/ui/button"
import { Separator } from "../../../components/ui/separator"

import { GPTlink, searchEngineList } from "@/lib/data";
import { useEffect, useState } from "react";
import Link from "next/link";

import { apis } from "@/apis";
import { CategoryType, LinkType } from "@/type";
import { toast } from "sonner";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../../../components/ui/command";

import News from "./news"
import Gpt from "../tool/gpt";

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
        setSearchList([])
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
        setSearchList([])
        searchEngine && window.open(searchEngine.link + val, "_blank");
    }


    useEffect(() => {
        getLinks()
    }, [])

    return (
        <div className="w-full h-screen p-6  flex flex-col items-center justify-start">
            <div className="w-full relative flex items-center justify-center mb-6">
                <div className="relative w-full max-w-3xl flex items-center">
                    <div className="absolute left-3 flex items-center z-10">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <Image 
                                        src={searchEngine.icon} 
                                        alt={searchEngine.name} 
                                        width={20} 
                                        height={20} 
                                        className="transition-all hover:scale-110"
                                    />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-52 p-2">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">选择搜索引擎</h4>
                                    <Separator />
                                    <RadioGroup defaultValue={searchEngineId.toString()} className="space-y-1">
                                        {searchEngineList.map((item) => (
                                            <div 
                                                key={item.id}
                                                className="flex items-center space-x-2 rounded-md px-2 py-1.5 hover:bg-muted cursor-pointer"
                                                onClick={() => changeSearchEngine(item.id)}
                                            >
                                                <RadioGroupItem value={item.id.toString()} id={item.id.toString()} />
                                                <Label htmlFor={item.id.toString()} className="flex items-center cursor-pointer">
                                                    <Image className="mr-2" src={item.icon} alt={item.name} width={14} height={14} />
                                                    <span className="text-sm">{item.name}</span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    
                    <div className="relative flex-1">
                        <input 
                            className="w-full h-10 pl-12 pr-10 py-2 border rounded-full outline-none transition-all dark:bg-gray-800/50 dark:border-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/30"
                            type="text" 
                            value={answer} 
                            onChange={(e) => searchAdvice(e.target.value)} 
                            placeholder="输入搜索内容 (按Enter键搜索)" 
                            onKeyDown={(e) => e.key === 'Enter' && search()} 
                        />
                        
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" 
                            onClick={search}
                        >
                            <MagnifyingGlassIcon className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
                
                {searchList?.length ? (
                    <div className="absolute top-full mt-1 w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-10 border dark:border-gray-700">
                        <div className="max-h-64 overflow-auto p-1">
                            {searchList.map((item, index) => (
                                <div 
                                    key={item} 
                                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors flex items-center"
                                    onClick={() => sel(item)}
                                >
                                    <span className="w-5 h-5 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-full text-xs text-gray-500 mr-2">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
            <div className="w-full mt-6">
                <Tabs defaultValue='news' className="w-full">
                    <div className="relative">
                        {/* 标签栏 */}
                        <TabsList className="w-full bg-transparent h-12 p-1 border-b dark:border-gray-800 rounded-none space-x-1">
                            <TabsTrigger 
                                value='gpt' 
                                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <span className="text-xl font-semibold">G</span>
                                    </div>
                                    <span>AI助手</span>
                                </div>
                            </TabsTrigger>
                            
                            <TabsTrigger 
                                value='news' 
                                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <span className="text-xl font-semibold">N</span>
                                    </div>
                                    <span>资讯</span>
                                </div>
                            </TabsTrigger>
                            
                            {categoryList?.map((item) => (
                                <TabsTrigger 
                                    key={item.id} 
                                    value={item.typename} 
                                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
                                >
                                    {item.typename}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                    
                    {/* 标签内容区域 - 修复滚动问题 */}
                    <div className="w-full h-[calc(100vh-220px)] overflow-hidden mt-2">
                        <TabsContent 
                            className="m-0 w-full h-full data-[state=active]:animate-in data-[state=active]:fade-in-0" 
                            value="home"
                        >
                            <div className="p-4 bg-background rounded-lg h-full">
                                home
                            </div>
                        </TabsContent>
                        
                        <TabsContent 
                            className="m-0 w-full h-full data-[state=active]:animate-in data-[state=active]:fade-in-0" 
                            value="gpt"
                        >
                            <div className="w-full h-[calc(100vh-250px)] bg-background rounded-lg overflow-hidden">
                                <iframe 
                                    src={GPTlink} 
                                    style={{ width: '100%', height: '100%' }} 
                                    className="border-none"
                                ></iframe>
                            </div>
                        </TabsContent>
                        
                        <TabsContent 
                            className="m-0 w-full h-full data-[state=active]:animate-in data-[state=active]:fade-in-0" 
                            value="news"
                        >
                            <div className="p-2 bg-background rounded-lg h-full overflow-auto">
                                <News />
                            </div>
                        </TabsContent>

                        {categoryList?.map((category) => (
                            <TabsContent 
                                className="m-0 w-full h-full data-[state=active]:animate-in data-[state=active]:fade-in-0" 
                                key={`tab-${category.id}`} 
                                value={category.typename}
                            >
                                <div className="p-4 bg-background rounded-lg h-full overflow-y-auto">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {links?.filter(link => link.category.typename === category.typename).map(item => (
                                            <Card className="h-full transition-all hover:shadow-md" key={item.id}>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-ellipsis overflow-hidden text-lg group">
                                                        <Link 
                                                            href={item.url.includes("http") ? item.url : "https://" + item.url} 
                                                            target="_blank" 
                                                            className="hover:text-blue-500 transition-colors flex items-center"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    </CardTitle>
                                                    <CardDescription className="line-clamp-2 text-xs h-10">
                                                        {item.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardFooter className="flex flex-col items-start justify-between pt-2">
                                                    <div className="flex flex-row flex-wrap items-center gap-1 min-h-8 w-full"> 
                                                        {item.tags ? item.tags.split(",").map((tag) => (
                                                            <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                                                                {tag}
                                                            </Badge>
                                                        )) : ''}
                                                    </div>
                                                    <Separator className="my-2 w-full" />
                                                    <div className="flex flex-row items-center justify-between w-full">
                                                        <div className="text-xs text-gray-500">
                                                            {(() => {
                                                                try {
                                                                    const fullUrl = item.url.includes("http") ? item.url : "https://" + item.url;
                                                                    const cleanUrl = fullUrl.replace(/\s+/g, '-');
                                                                    return new URL(cleanUrl).hostname.replace('www.', '');
                                                                } catch (e) {
                                                                    return item.url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
                                                                }
                                                            })()}
                                                        </div>
                                                        {item.github && (
                                                            <Link href={item.github} target="_blank" className="flex items-center hover:text-blue-500 transition-colors">
                                                                <GitHubLogoIcon className="w-5 h-5 mr-1" />
                                                                <span className="text-xs">源码</span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </div>
            {/* {
                links && <CommandMenu links={links} />
            } */}
        </div>
    )
}