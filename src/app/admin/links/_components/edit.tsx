"use client"

import { apis } from "@/apis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useStore from "@/store/usestore";
import { CategoryType } from "@/type";

import { useState, useEffect } from "react";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


function ComboboComp({
    categoryId,
    catOptions,
    onChange,
    getCategoryList
}: {
    categoryId: string,
    catOptions: Array<CategoryType>,
    onChange: (value: string) => void,
    getCategoryList: () => void
}) {


    const [isEdit, setIsEdit] = useState(false);
    const [addCat, setAddCat] = useState('');

    const deleteCategory = async (id: number) => {
        const { code, data, msg } = await apis.deleteCategory(
            {
                id,
                userId: useStore.getState().userInfo?.id
            }
        )
        if (code === 200) {
            onChange(categoryId)
            getCategoryList()
        } else {
            toast(msg)
        }
    }
    const addCategory = async () => {
        if (!addCat) {
            return
        }
        const { code, data, msg } = await apis.addCategory(
            {
                userId: useStore.getState().userInfo?.id,
                name: addCat
            }
        )
        if (code === 200) {
            onChange(categoryId)
            setAddCat('')
            toast(msg)
            getCategoryList()
        } else {
            toast(msg)
        }
    }
    const handClick = async (id: number) => {
        if (isEdit) {
            await deleteCategory(id)
        } else {
            onChange(id.toString())
        }
    }
    return (
        <>
            <div className="w-full mb-4">
                {
                    catOptions.map((item) => {
                        return (
                            <Badge className="mx-1 cursor-pointer" key={item.id.toString()} variant={
                                item.id === parseInt(categoryId) && !isEdit ? 'default' : 'outline'
                            }
                                onClick={
                                    () => {
                                        handClick(item.id)
                                    }
                                }
                            >
                                <div className="w-full flex flex-row justify-between">
                                    {item.typename}
                                    {
                                        isEdit && <Cross2Icon className="w-4 h-4 ml-2" />
                                    }

                                </div>
                            </Badge>
                        )
                    })
                }
            </div>
            <Separator />
            <div className="w-full flex flex-row justify-end mt-2 items-center">
                <input className="border border-gray-300 rounded-md px-2" type="text" value={addCat} onChange={(e) => setAddCat(e.target.value)} />
                <span className="text-sm cursor-pointer mx-2" onClick={addCategory}>add</span>
                <span className="text-sm cursor-pointer mx-2" onClick={() => setIsEdit(!isEdit)}>edit</span>
            </div>
        </>
    )
}

export default function AddDialogCom(
    {
        catOptions,
        getCategoryList,
        getLinks,
        editType,
        selId
    }: {
        catOptions: Array<CategoryType>
        getCategoryList: () => void
        getLinks: (page: number) => void
        editType: number
        selId: number
    }
) {
    const [formData, setFormData] = useState<{
        title: string
        url: string
        categoryId: number
        description: string
        tags: string
        github: string
    }>({
        title: "",
        url: "",
        categoryId: 0,
        description: "",
        tags: "",
        github: "",
    })

    const submit = async () => {


        if (!formData.title || !formData.url || !formData.categoryId) {
            toast('title or url is empty')
            return
        }
        if (formData.tags.split(',').length > 3) {
            toast('tags is too many, max 3')
            return
        }
        if (editType == 1) {
            const { code, data, msg } = await apis.addLink(
                {
                    ...formData,
                    userId: useStore.getState().userInfo?.id
                }
            )
            if (code === 200) {
                toast(msg)
                getLinks(1)
            } else {
                toast(msg)
            }

        }
        if (editType === 2) {
            const { code, data, msg } = await apis.editLink(
                {
                    ...formData,
                    userId: useStore.getState().userInfo?.id,
                    id: selId
                }
            )
            if (code === 200) {
                toast(msg)
                getLinks(1)
            } else {
                toast(msg)
            }
        }


    }
    const getLinkById = async () => {
        const { code, data, msg } = await apis.getLinkById(
            {
                id: selId,
                userId: useStore.getState().userInfo?.id
            }
        )
        if (code === 200) {
            setFormData(data)
        } else {
            toast(msg)
        }
    }
    useEffect(() => {
        // 编辑
        if (editType === 2) {
            getLinkById()
        }
    }, [])

    return (
        <>
            <DialogHeader>
                <DialogTitle>{
                    editType === 1 ? 'Add' : 'Edit'}</DialogTitle>
                <DialogDescription>
                    {
                        editType === 1 ? 'Add' : 'Edit'
                    }a new link here.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                        Title
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="title"
                        className="col-span-3"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">
                        Url
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="url"
                        className="col-span-3"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                        Category
                        <span className="text-red-500">*</span>
                    </Label>
                    <div className="col-span-3">
                        <ComboboComp categoryId={formData.categoryId.toString()} catOptions={catOptions} onChange={(val) => setFormData({ ...formData, categoryId: parseInt(val) })} getCategoryList={getCategoryList} />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Description
                    </Label>
                    <Input
                        id="description"
                        className="col-span-3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="github" className="text-right">
                        Github
                    </Label>
                    <Input
                        id="github"
                        className="col-span-3"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tags" className="text-right">
                        Tags
                    </Label>
                    <Input
                        id="tags"
                        className="col-span-3"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="submit" onClick={() => submit()}>Save changes</Button>
                </DialogClose>
            </DialogFooter>
        </>
    )
}