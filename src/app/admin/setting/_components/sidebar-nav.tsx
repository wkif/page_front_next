"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import useStore from "@/store/usestore";




export function SidebarNav() {
    const pathname = usePathname()
    const { userInfo } = useStore()

    const sidebarNavItems = [
        {
            title: "Appearance",
            href: "/admin/setting",
        },
        {
            title: "Account",
            href: `/admin/setting/account`,
        },
        // {
        //     title: "Appearance",
        //     href: "/admin/setting/appearance",
        // },
    ]

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
            )}
        >
            {sidebarNavItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        pathname === item.href
                            ? "bg-muted hover:bg-muted"
                            : "hover:bg-transparent hover:underline",
                        "justify-start"
                    )}
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    )
}
