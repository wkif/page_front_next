import { Metadata } from "next"
import { NavigationMenuCom } from "./_components/NavigationMenuCom"

export const metadata: Metadata = {
    title: "Admin",
    description: "Advanced form example using react-hook-form and Zod.",
}



interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <>
            <div className="px-10 pb-16 space-y-6 md:block">
                <NavigationMenuCom />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </>
    )
}
