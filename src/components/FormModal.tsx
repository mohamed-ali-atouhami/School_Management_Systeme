"use client"
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
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
import Image from "next/image"
import React, { useState, useTransition } from "react"
import dynamic from "next/dynamic"
import { Loader } from "lucide-react"
import { deleteSubject, deleteClass, deleteTeacher, deleteStudent } from "@/lib/Actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FormContainerProps } from "./Forms/FormContainer"
const TeacherForm = dynamic(() => import("./Forms/TeacherForm"), { ssr: false, loading: () => <span className=" text-center flex justify-center items-center"><Loader className="w-8 h-8 animate-spin" /></span> })
const StudentForm = dynamic(() => import("./Forms/StudentForm"), { ssr: false, loading: () => <span className=" text-center flex justify-center items-center"><Loader className="w-8 h-8 animate-spin" /></span> })
const AnnouncementForm = dynamic(() => import("./Forms/AnnouncementForm"), { ssr: false, loading: () => <span className=" text-center flex justify-center items-center"><Loader className="w-8 h-8 animate-spin" /></span> })
const ParentForm = dynamic(() => import("./Forms/ParentForm"), { ssr: false, loading: () => <span className=" text-center flex justify-center items-center"><Loader className="w-8 h-8 animate-spin" /></span> })
const ClassForm = dynamic(() => import("./Forms/ClassForm"), { ssr: false, loading: () => <span className=" text-center flex justify-center items-center"><Loader className="w-8 h-8 animate-spin" /></span> })
const ExamForm = dynamic(() => import("./Forms/ExamForm"), { ssr: false, loading: () => <span className=" text-center flex justify-center items-center"><Loader className="w-8 h-8 animate-spin" /></span> })
const AssignmentForm = dynamic(() => import("./Forms/AssignmentForm"), { ssr: false, loading: () => <span className=" text-center flex justify-center items-center"><Loader className="w-8 h-8 animate-spin" /></span> })
const ResultForm = dynamic(() => import("./Forms/ResultForm"), { ssr: false, loading: () => <span className=" text-center flex justify-center items-center"><Loader className="w-8 h-8 animate-spin" /></span> })
const EventForm = dynamic(() => import("./Forms/EventForm"), { ssr: false, loading: () => <span className=" text-center flex justify-center items-center"><Loader className="w-8 h-8 animate-spin" /></span> })
const LessonForm = dynamic(() => import("./Forms/LessonForm"), { ssr: false, loading: () => <span className=" text-center flex justify-center items-center"><Loader className="w-8 h-8 animate-spin" /></span> })
const SubjectForm = dynamic(() => import("./Forms/SubjectForm"), { ssr: false, loading: () => <span className=" text-center flex justify-center items-center"><Loader className="w-8 h-8 animate-spin" /></span> })

const formMap: Record<string, React.ComponentType<{ type: "create" | "edit", data?: any, setOpen: (open: boolean) => void, relatedData?: any }>> = {
    teachers: TeacherForm,
    students: StudentForm,
    parents: ParentForm,
    classes: ClassForm,
    exams: ExamForm,
    announcements: AnnouncementForm,
    assignments: AssignmentForm,
    results: ResultForm,
    events: EventForm,
    lessons: LessonForm,
    subjects: SubjectForm,
}

// First, let's define a type for our delete functions
type DeleteFunction = (formData: FormData) => Promise<boolean>;

// Then create a proper type for the deleteMap
const deleteMap: Partial<Record<"students" | "teachers" | "parents" | "classes" | "exams" | "assignments" | "results" | "events" | "announcements" | "attendance" | "lessons" | "subjects", DeleteFunction>> = {
    subjects: deleteSubject,
    classes: deleteClass,
    teachers: deleteTeacher,
    students: deleteStudent,
}

export default function FormModal({ table, type, data, id, relatedData }: FormContainerProps & { relatedData?: any }) {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7"
    const bgColor = type === "create" ? "bg-medaliYellow" : type === "edit" ? "bg-medaliSky" : "bg-medaliPurple"
    const [open, setOpen] = useState(false)

    const Form = () => {
        const [isPending, startTransition] = useTransition()
        const router = useRouter()

        const handleDelete = async () => {
            const formData = new FormData()
            formData.append('id', String(id))
            if (data?.image) {
                formData.append('image', data.image)
            }

            startTransition(async () => {
                const deleteAction = deleteMap[table]
                if (!deleteAction) {
                    toast.error(`Delete action not implemented for ${table}`)
                    return
                }
                const success = await deleteAction(formData)
                if (success) {
                    toast.success(`${table} deleted successfully!`)
                    setOpen(false)
                    router.refresh()
                } else {
                    toast.error(`Failed to delete ${table}!`)
                }
            })
        }

        return type === "delete" && id ? (
            <AlertDialog open={open} onOpenChange={setOpen}>
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
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? "Deleting..." : "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        ) : type === "create" || type === "edit" ? (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {type === "create" ? "Create" : "Edit"} {table}
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    {React.createElement(formMap[table], {
                        type,
                        data,
                        setOpen,
                        relatedData: relatedData // Make sure we're explicitly passing relatedData
                    })}
                </DialogContent>
            </Dialog>
        ) : null
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
