"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { SunIcon } from '@radix-ui/react-icons'

export default function DarkMode() {
    const { theme, setTheme } = useTheme()
    return (
        <div>

            {
                theme === "light"
                    ?
                    <SunIcon className="cursor-pointer" onClick={() => setTheme(theme === "light" ? "dark" : "light")} />
                    :
                    <SunIcon className="cursor-pointer" onClick={() => setTheme(theme === "light" ? "dark" : "light")} />
            }

        </div>
    )
}