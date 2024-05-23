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
        <div className={
            isCollapse ?
                "flex flex-col items-center justify-start h-screen border-r px-6 py-10 w-1/12"
                :
                "flex flex-col items-center justify-start h-screen border-r px-6 py-10 w-2/12"
        }>
            <div className="cursor-pointer absolute top-4">
                {
                    !isCollapse ? <DoubleArrowLeftIcon onClick={() => setIsCollapse(!isCollapse)} /> : <DoubleArrowRightIcon onClick={() => setIsCollapse(!isCollapse)} />}
            </div>
            <div className="border-b pb-4">
                <Image src={LogoImg} alt="kifnav Logo" />
            </div>
            {
                loginState ?
                    <div className="w-full flex flex-row items-center justify-evenly mt-6">
                        <div>
                            <Link href={`/admin/setting/account`}>
                                <Avatar>
                                    <AvatarImage src={userInfo?.avatar} />
                                    <AvatarFallback>kif</AvatarFallback>
                                </Avatar>
                            </Link>
                        </div>
                        {
                            !isCollapse ?
                                <span>{userInfo.username}</span> : ''
                        }
                    </div>
                    :
                    <div className="mt-5">
                        <Link href="/login">
                            <Button variant="ghost">Login</Button>
                        </Link>
                    </div>
            }
            {
                searchHistory.length > 0 && !isCollapse &&
                <div className="h-full w-full rounded-md m-4 p-3"
                >
                    <div className="flex flex-row items-center justify-between text-sm text-gray-500">
                        <div className="flex flex-row items-center justify-start"><TextAlignLeftIcon /> History</div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Cross2Icon className="cursor-pointer" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogDescription>
                                        清除全部历史记录?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => clearSearchHistory()}>确定</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </div>
                    <div className="flex flex-row items-start justify-start mt-3">
                        <div className="h-80 w-0.5 mr-1 bg-gray-200"></div>
                        <div className="h-80 p-1 overflow-auto">
                            {
                                searchHistory.map((item: any, index: number) => {
                                    return (
                                        <div className="my-2 flex flex-row items-center justify-start text-sm text-gray-500" key={index}>
                                            <Link className="hover:text-blue-500 hover:bg-slate-100 w-36 p-1 rounded-md overflow-hidden text-ellipsis whitespace-nowrap" href={`${searchEngine?.link}${item}`} >
                                                {item}
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                </div>
            }

            <div className={
                isCollapse
                    ?
                    "w-1/12 absolute bottom-5 border-t pt-4 flex flex-row items-center justify-evenly"
                    :
                    "w-2/12 absolute bottom-5 border-t pt-4 flex flex-row items-center justify-evenly"
            }>
                {
                    loginState?<Link href='/admin'><GearIcon className="cursor-pointer" /></Link>:''
                }
                {/* <GitHubLogoIcon className="cursor-pointer" /> */}
                <DarkMode />
                <ExitIcon className="cursor-pointer" onClick={logout} />
            </div>
        </div >
    )
}