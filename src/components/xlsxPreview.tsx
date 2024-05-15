"use client"

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";


export default function XLSXPreview(
    {
        xlsxFile,
        open,
        setOpen,
        actionFunc,
        cancelFunc
    }: {
        xlsxFile: any,
        open: boolean,
        setOpen: (open: boolean) => void,
        actionFunc?: {
            name: string,
            func: () => void
        },
        cancelFunc?: {
            name: string,
            func: () => void
        }
    }
) {
    const [data, setData] = useState([]);
    const [mode, setMode] = useState("table");

    const toggleMode = () =>
        setMode((prev) => (prev === "table" ? "json" : "table"));

    useEffect(() => {
        if(!xlsxFile) return
        const getSheetData = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(xlsxFile);
            fileReader.onload = (e) => {
                if (!e.target) {
                    reject(e)
                }
                const bufferArray = e.target?.result;
                const sheetList = XLSX.read(bufferArray, { type: "buffer" });

                const sheetName = sheetList.SheetNames[0];
                const sheet = sheetList.Sheets[sheetName];

                const sheetData = XLSX.utils.sheet_to_json(sheet);
                resolve(sheetData);
            };

            fileReader.onerror = (e) => reject(e);
        });
        getSheetData.then((e) => setData(e as any));
    }, [xlsxFile])
    const Table = () => (
        <div className="bg-[#2e4052] text-white rounded-md text-center max-h-[70vh]">
            <table>
                <thead>
                    {data && Object.keys(data[0]).map((e) => (
                        <th className={
                            cn("py-[12px] border-2 border-white border-solid", {
                                "border-0": e.includes("EMPTY") || !e
                            })
                        } key={e}>{e.includes("EMPTY") || !e ? "" : e}</th>
                    ))}
                </thead>
                <tbody>
                    {data.map((row) => {
                        return (
                            <tr key={row}>
                                {Object.values(row).map((value: any) => (
                                    <td className="py-[4px] px-[8px] border-2 border-solid border-gray-200" key={value}>{value}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    const Json = () => (
        <pre className="bg-[#2e4052] text-white rounded-md p-[16px] text-left max-h-[70vh]">{JSON.stringify(data, null, 4)}</pre>
    );

    const cond = data.length === 0;
    return (<>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-screen-2xl">
                <DialogHeader>
                    <DialogTitle>XLSX Preview</DialogTitle>
                </DialogHeader>
                <div className="max-h-screen-[90vh] overflow-auto">
                    {!cond ? (
                        <Button onClick={toggleMode}>
                            Modo {mode}
                        </Button>
                    ) : null}
                    {cond ? <p>No hay datos 😔</p> : mode === "table" ? <Table /> : <Json />}
                </div>
                <DialogFooter>
                    {

                        cancelFunc ?
                            <Button variant={"destructive"} onClick={cancelFunc.func}>{cancelFunc.name}</Button>
                            : <Button variant={"destructive"} onClick={() => setOpen(false)}>Return</Button>
                    }
                    {
                        actionFunc && <Button onClick={actionFunc.func}>{
                            actionFunc.name
                        }</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </>)
}