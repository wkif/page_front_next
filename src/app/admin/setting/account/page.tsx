"use client"

import useStore from "@/store/usestore"
import AccountForm from "./account_form"
export default function Page() {

    const userId = useStore.getState().userInfo?.id

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Account</h3>
                <AccountForm id={Number(userId)} />
            </div>
        </div>
    )
}