"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { attendanceSchema, AttendanceSchema } from "@/lib/FormValidationSchema"
import { createAttendance, updateAttendance } from "@/lib/Actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect , useTransition , useActionState} from "react"

export default function AttendanceForm({ type, data, setOpen, relatedData }: { type: "create" | "edit", data?: AttendanceSchema, setOpen: (open: boolean) => void, relatedData?: { students: { id: number, name: string }[], lessons: { id: number, name: string }[] } }) {
    const form = useForm<AttendanceSchema>({
        resolver: zodResolver(attendanceSchema),
        defaultValues: {
            id: data?.id || undefined,
            studentId: data?.studentId || undefined,
            lessonId: data?.lessonId || undefined,
            date: data?.date,
            present: data?.present || "false",
        },
    })

    const [isPending, startTransition] = useTransition()
    const [state, formAction] = useActionState(type === "create" ? createAttendance : updateAttendance, {
        success: false,
        error: false
    })
    const router = useRouter()

    useEffect(() => {
        if (state?.success === true) {
            toast.success(`Attendance ${type === "create" ? "created" : "updated"} successfully!`)
            setOpen(false)
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error || `Failed to ${type === "create" ? "create" : "update"} attendance`)
            console.error("Form action error:", state.error)
        }
    }, [state, type, router, setOpen])

    async function onSubmit(values: AttendanceSchema) {
        try {
            startTransition(() => {
                formAction(values);
            });
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("An unexpected error occurred");
        }
    }
    const students = relatedData?.students
    const lessons = relatedData?.lessons
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

                <span className="text-xs text-gray-400 font-medium">Attendance Details</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={data?.studentId?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Students" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {students?.map((student: {id: number, name: string}) => (
                                                <SelectItem key={student.id} value={student.id.toString()}>
                                                    {student.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lessonId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lesson</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={data?.lessonId?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Students" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {lessons?.map((lesson: {id: number, name: string}) => (
                                                <SelectItem key={lesson.id} value={lesson.id.toString()}>
                                                    {lesson.name}
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
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Date
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
                        name="present"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Is Present</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={data?.present.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="true">Present</SelectItem>
                                        <SelectItem value="false">Absent</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={isPending}>{isPending ? type === "create" ? "Creating..." : "Updating..." : type === "create" ? "Create" : "Update"}</Button>
            </form>
        </Form>
    )
}
