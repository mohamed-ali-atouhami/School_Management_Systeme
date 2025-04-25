"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { lessonSchema, LessonSchema } from "@/lib/FormValidationSchema"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from "@/components/ui/select"
import InputFields from "../InputFields"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useTransition } from "react"
import { createLesson, updateLesson } from "@/lib/Actions"
import { toast } from "sonner"

export default function LessonForm({ type, data, setOpen, relatedData }: { type: "create" | "edit", data?: LessonSchema, setOpen: (open: boolean) => void, relatedData?: { subjects: { id: number, name: string }[], classes: { id: number, name: string }[], teachers: { id: string, name: string, surname: string }[] } }) {
    const form = useForm<LessonSchema>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            id: data?.id || undefined,
            name: data?.name || "",
            day: data?.day || "MONDAY",
            startTime: data?.startTime || undefined,
            endTime: data?.endTime || undefined,
            subjectId: data?.subjectId || 0,
            classId: data?.classId || 0,
            teacherId: data?.teacherId || undefined,
        },
    })

    const [isPending, startTransition] = useTransition()
    const [state, formAction] = useActionState(type === "create" ? createLesson : updateLesson, { success: false, error: false })
    const router = useRouter()
    useEffect(() => {
        if (state?.success === true) {
            toast.success(`Lesson ${type === "create" ? "created" : "updated"} successfully!`)
            form.reset()
            setOpen(false)
            router.push("/list/lessons")
        } else if (state?.error === true) {
            toast.error(state.error || `Failed to ${type === "create" ? "create" : "update"} lesson!`)
        }
    }, [state, type, form, router, setOpen])
    function onSubmit(values: LessonSchema) {
        startTransition(() => {
            formAction(values)
        })
    }
    const subjects = relatedData?.subjects || []
    const classes = relatedData?.classes || []
    const teachers = relatedData?.teachers || []
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

                <span className="text-xs text-gray-400 font-medium">Lesson Information</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="Name" placeholder="name" control={form.control} name="name" />
                    <FormField
                        control={form.control}
                        name="day"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Day</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={data?.day}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select day" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].map((day, index) => (
                                            <SelectItem key={index} value={day}>
                                                {day}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-between flex-wrap gap-4">
                    <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Start Time
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => {
                                            const date = new Date(e.target.value);
                                            field.onChange(date);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    End Time
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => {
                                            const date = new Date(e.target.value);
                                            field.onChange(date);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-2 w-full md:w-1/4">
                        <FormField
                            control={form.control}
                            name="subjectId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={data?.subjectId.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Subjects" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subjects.map((subject: { id: number, name: string }) => (
                                                <SelectItem key={subject.id} value={subject.id.toString()}>
                                                    {subject.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-1/4">
                        <FormField
                            control={form.control}
                            name="classId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={data?.classId.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {classes.map((clss: { id: number, name: string }) => (
                                                <SelectItem key={clss.id} value={clss.id.toString()}>
                                                    {clss.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-1/4">
                        <FormField
                            control={form.control}
                            name="teacherId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teacher</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={data?.teacherId}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Teachers" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {teachers.map((teacher: { id: string, name: string, surname: string }) => (
                                                <SelectItem key={teacher.id} value={teacher.id}>
                                                    {teacher.name} {teacher.surname}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={isPending}>{isPending ? type === "create" ? "Creating..." : "Updating..." : type === "create" ? "Create" : "Update"}</Button>
            </form>
        </Form>
    )
}
