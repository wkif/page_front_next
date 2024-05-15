import { Metadata } from "next"

import { SidebarNav } from "./_components/sidebar-nav";



export const metadata: Metadata = {
    title: "Setting",
    description: "Advanced form example using react-hook-form and Zod.",
}


interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <>
            <div className="px-10 pb-16 space-y-6 md:block">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Setting</h2>
                </div>
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        <SidebarNav />
                    </aside>
                    <div className="flex-1 lg:max-w-4xl">{children}</div>
                </div>
            </div>
        </>
    )
}
