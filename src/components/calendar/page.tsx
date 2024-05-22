import React from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import WeekComp from "./_components/WeekComp"
import DayComp from "./_components/DayComp"
import MonthComp from "./_components/MonthComp"





export default function Calendar() {
    const currentDate = new Date()
    // 当前周日期
    const currentWeek = currentDate.getDate()
    const [currentMode, setCurrentMode] = React.useState(1)
    const changeMode = (mode: number) => {
        setCurrentMode(mode)
    }
    return (<>
        <Card>
            <CardHeader>
                <CardTitle>

                    <div className="flex flex-row items-center">
                        <Button variant="ghost" className={
                            currentMode === 1 ? "bg-gray-300" : ""
                        } onClick={() => changeMode(1)}>Month</Button>
                        <Button disabled variant="ghost" className={
                            currentMode === 2 ? "bg-gray-300" : ""
                        } onClick={() => changeMode(2)}>Week</Button>
                        <Button variant="ghost" className={
                            currentMode === 3 ? "bg-gray-300" : ""
                        } onClick={() => changeMode(3)}>Day</Button>
                        <div className="ml-auto">
                            <span className="text-sm mr-4">Tips: </span>
                            <Badge className="bg-[#aa96da] text-sm" variant="outline">Estimate</Badge>
                            <Badge className="bg-[#fcbad3] text-sm" variant="outline">Actual</Badge>
                        </div>
                    </div>

                </CardTitle>
            </CardHeader>
            <CardContent>
                {
                    currentMode === 1 ? <MonthComp /> :
                        currentMode === 2 ? <WeekComp /> :
                            <DayComp />
                }
            </CardContent>
            {/* <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
        </Card>

        {/* <div className="border-2 rounded-md p-2">
        </div> */}
    </>)
}