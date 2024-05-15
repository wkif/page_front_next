"use client"

import Calendar from "@/components/calendar/page"






export default function AdminPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Dashboard</h3>
            </div>
            <div>
                <>
                    <Calendar />
                </>
            </div>
        </div>
    )
}
