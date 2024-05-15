"use client"


import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import KifPagination from "@/components/kifPagination"

import { useEffect, useState } from "react";
import { CategoryType, LinkType } from "@/type";
import { apis } from "@/apis";
import useStore from "@/store/usestore";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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


import { PlusCircledIcon, MagnifyingGlassIcon, CrumpledPaperIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import AddDialogCom from "./edit";




export default function TableComp({
    catOptions
}: {
    catOptions: Array<CategoryType>
}) {

    const [links, setLinks] = useState<Array<LinkType>>();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [catId, setCatId] = useState(0);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState("");

    const getLinks = async (page = 1) => {
        setPage(page)
        const formData = {
            userId: useStore.getState().userInfo?.id,
            page: page,
            catId: catId,
            title: title,
            url: url,
            tags: tags
        }
        const { code, data, msg } = await apis.getLinkTableList(formData);
        if (code === 200) {
            setLinks(data?.links);
            setTotal(data?.total);
        } else {
            toast(msg)
        }

    }


    const deleteLink = async (id: number) => {
        const { code, data, msg } = await apis.deleteLink(
            {
                id,
                userId: useStore.getState().userInfo?.id
            }
        );
        if (code === 200) {
            getLinks(page)
        } else {
            toast(msg)
        }
    }

    const clear = () => {
        setTitle("")
        setUrl("")
        setTags("")
        setCatId(0)
    }
    useEffect(() => {
        getLinks(1)
    }, [])
    return (
        <>
            <Separator />
            <div className="flex flex-row flex-wrap items-center my-4">
                <Input className="max-w-[200px] mr-4" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input className="max-w-[200px] mr-4" placeholder="Url" value={url} onChange={(e) => setUrl(e.target.value)} />
                <Input className="max-w-[200px] mr-4" placeholder="Tag" value={tags} onChange={(e) => setTags(e.target.value)} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline"><PlusCircledIcon className="mr-2 h-4 w-4" />
                            {
                                catId ? catOptions?.find((item) => item.id === catId)?.typename : "Category"
                            }
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        {
                            catOptions?.map((item) => (
                                <DropdownMenuCheckboxItem
                                    key={item.id}
                                    checked={catId === item.id}
                                    onClick={() => setCatId(item.id)}
                                >
                                    {item.typename}
                                </DropdownMenuCheckboxItem>
                            ))
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button className="ml-4" variant="outline" onClick={() => getLinks(1)}>
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" /> Search
                </Button>
                <Button className="ml-4" variant="outline" onClick={() => clear()}>
                    <CrumpledPaperIcon className="h-4 w-4 mr-2" /> Clear
                </Button>
            </div>
            <Separator />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Url</TableHead>
                        <TableHead className="text-right">Github</TableHead>
                        <TableHead>Desc</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-center">Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {links?.map((link, index) => (
                        <TableRow key={link.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="font-medium">{link.title}</TableCell>
                            <TableCell className="font-medium">
                                <Badge> {link.category?.typename}</Badge>
                            </TableCell>
                            <TableCell>{link.url}</TableCell>
                            <TableCell className="text-right">{link.github}</TableCell>
                            <TableCell>{link.description}</TableCell>
                            <TableCell>
                                {
                                    link.tags && link.tags.split(",")?.map(
                                        tag => <Badge variant="outline" key={tag}>{tag}</Badge>
                                    )
                                }
                            </TableCell>
                            <TableCell>
                                <AlertDialog>
                                    <AlertDialogTrigger className="text-red-500">delete</AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure delete this link?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your link data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteLink(link.id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <KifPagination currentPage={page} total={total} changePage={getLinks} />
        </>
    )
}