"use client"

import Image from "next/image";
import Link from "next/link";
import LogoImg from "@/assets/logo.png"
import { ExitIcon, GitHubLogoIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon, Cross2Icon, TextAlignLeftIcon, GearIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useStore from '@/store/usestore'
import DarkMode from "../../../components/darkMode";
import { searchEngineList } from "@/lib/data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";


export default function NavAside() {
    const { isCollapse, setIsCollapse, searchEngineId, loginState, setLoginState, userInfo, setUserInfo, searchHistory, clearSearchHistory } = useStore()
    const logout = () => {
        setLoginState(false)
        setUserInfo({})
    }
    let searchEngine = searchEngineList.find((item) => item.id === searchEngineId);
    if (!searchEngine) {
        searchEngine = searchEngineList[0];
    }
    return (
        <div className={cn(
            "flex flex-col items-center h-screen border-r dark:border-gray-800 py-4 transition-all duration-300 ease-in-out relative",
            isCollapse ? "w-16" : "w-64"
        )}>
            {/* 折叠/展开按钮 */}
            <div className="absolute -right-3 top-8 z-10">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-6 w-6 p-0 shadow-md bg-background border-gray-200 dark:border-gray-700"
                    onClick={() => setIsCollapse(!isCollapse)}
                >
                    {!isCollapse ? 
                        <DoubleArrowLeftIcon className="h-3 w-3" /> : 
                        <DoubleArrowRightIcon className="h-3 w-3" />
                    }
                </Button>
            </div>
            
            {/* Logo区域 */}
            <div className={cn(
                "flex justify-center items-center py-4 w-full",
                isCollapse ? "px-2" : "px-6"
            )}>
                <Image 
                    src={LogoImg} 
                    alt="kifnav Logo" 
                    className={cn(
                        "transition-all duration-300",
                        isCollapse ? "max-w-[32px]" : ""
                    )}
                />
            </div>
            
            <div className="w-full h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
            
            {/* 用户信息/登录区域 */}
            {loginState ? (
                <div className={cn(
                    "w-full flex items-center py-4",
                    isCollapse ? "justify-center" : "px-6 justify-start space-x-3"
                )}>
                    <Link href={`/admin/setting/account`}>
                        <Avatar className="transition-transform hover:scale-105 border-2 border-transparent hover:border-primary">
                            <AvatarImage src={userInfo?.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {userInfo.username?.substring(0, 2) || "KF"}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    
                    {!isCollapse && (
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">{userInfo.username}</span>
                            <span className="text-xs text-muted-foreground">用户</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className={cn(
                    "w-full py-4",
                    isCollapse ? "flex justify-center" : "px-6"
                )}>
                    <Link href="/login" className={isCollapse ? "" : "w-full"}>
                        <Button 
                            variant="outline" 
                            className={cn(
                                "transition-all",
                                isCollapse ? "w-10 h-10 p-0" : "w-full"
                            )}
                        >
                            {isCollapse ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>登</span>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>登录</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : "登录"}
                        </Button>
                    </Link>
                </div>
            )}
            
            {/* 搜索历史区域 */}
            {searchHistory.length > 0 && !isCollapse && (
                <div className="flex-1 w-full px-4 py-3 overflow-hidden">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-2">
                            <TextAlignLeftIcon className="h-4 w-4" /> 
                            <span>搜索历史</span>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0 hover:bg-muted">
                                    <Cross2Icon className="h-3.5 w-3.5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>清除历史记录</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        确定要清除全部搜索历史记录吗?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => clearSearchHistory()}>确定</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    
                    <div className="relative h-[calc(100%-2rem)] flex space-x-2">
                        <div className="absolute left-1.5 top-0 h-full w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div className="pl-5 pr-1 h-full overflow-auto scrollbar-thin">
                            {searchHistory.map((item: string, index: number) => (
                                <Link 
                                    key={index}
                                    href={`${searchEngine?.link}${item}`}
                                    target="_blank"
                                    className="block mb-2.5 group"
                                >
                                    <div className="relative pl-2">
                                        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-primary"></div>
                                        <div className="py-1.5 px-2 text-sm truncate hover:text-primary transition-colors rounded-md hover:bg-muted group-hover:font-medium">
                                            {item}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* 底部工具栏 */}
            <div className={cn(
                "w-full border-t dark:border-gray-800 pt-3 pb-4 flex items-center gap-1 mt-auto",
                isCollapse ? "px-2 justify-center" : "px-4 justify-between"
            )}>
                {/* 设置按钮 - 只在展开状态显示 */}
                {loginState && !isCollapse && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href='/admin'>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                        <GearIcon className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>设置</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
                
                {/* 夜间模式切换 - 始终显示 */}
                <DarkMode />
                
                {/* 退出按钮 - 只在展开状态显示 */}
                {!isCollapse && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={logout}>
                                    <ExitIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>退出</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    )
}