"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UpdateIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { apis } from "@/apis"
import { useRouter } from 'next/navigation'
import useStore from "@/store/usestore"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const { setUserInfo, setLoginState, setToken } = useStore()
    const router = useRouter()

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        const { code, data, msg } = await apis.Login({ email, password })
        setIsLoading(false)
        if (code === 200) {
            toast(msg)
            setUserInfo(data.userInfo)
            setLoginState(true)
            setToken(data.token)
            setTimeout(() => {
                router.push('/')
            }, 3000)
        } else {
            toast(msg)
        }
    }

    return (
        <div className={className} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder="***"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect="off"
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Login with Email
                    </Button>
                </div>
            </form>
        </div>
    )
}
