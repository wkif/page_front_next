import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function SettingsLinkPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                    Customize the appearance of the app. Automatically switch between day and night themes.
                </p>
            </div>
        </div>
    )
}
