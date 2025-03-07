"use client"
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

export default function FormModal({ table, type, data, id }:
    {
        table: "students" | "teachers" | "parents" | "classes" | "exams" | "assignments" | "results" | "events" | "announcements" | "attendance" | "lessons" | "subjects",
        type: "create" | "edit" | "delete",
        data?: any,
        id?: number
    }
) {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7"
    const bgColor = type === "create" ? "bg-medaliYellow" : type === "edit" ? "bg-medaliSky" : "bg-medaliPurple"
    const [open, setOpen] = useState(false)
    const Form = () => {
        return type === "delete" && id ? (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button className={`${size} rounded-full flex items-center justify-center ${bgColor}`}>
                        <Image src={`/${type}.png`} alt="" width={16} height={16} />
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the {table} from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        ) : (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {type === "create" ? "Create" : "Edit"} {table}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        {type === "create" ? "Create a new" : "Edit"} {table}
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        )
    }
    return (
        <>
            {type !== "delete" && (
                <button className={`${size} rounded-full flex items-center justify-center ${bgColor}`} onClick={() => setOpen(true)}>
                    <Image src={`/${type}.png`} alt="" width={16} height={16} />
                </button>
            )}
            <Form />
        </>
    )
}
