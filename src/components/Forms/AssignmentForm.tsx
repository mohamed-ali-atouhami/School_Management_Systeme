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
import InputFields from "../InputFields"
import { assignmentSchema, AssignmentSchema } from "@/lib/FormValidationSchema"
import { createAssignment, updateAssignment } from "@/lib/Actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect, useActionState, useTransition } from "react"

export default function AssignmentForm({ type, data, setOpen, relatedData }: { type: "create" | "edit", data?: AssignmentSchema, setOpen: (open: boolean) => void, relatedData?: { lessons: { id: number, name: string }[] } }) {
    const form = useForm<AssignmentSchema>({
        resolver: zodResolver(assignmentSchema),
        defaultValues: {
            id: data?.id || undefined,
            title: data?.title || "",
            startDate: data?.startDate,
            dueDate: data?.dueDate,
            lessonId: data?.lessonId || 0,
        },
    })

    const [isPending, startTransition] = useTransition()
    const [state, formAction] = useActionState(type === "create" ? createAssignment : updateAssignment, {
        success: false,
        error: false
    })
    const router = useRouter()

    useEffect(() => {
        if (state?.success === true) {
            toast.success(`Assignment ${type === "create" ? "created" : "updated"} successfully!`)
            setOpen(false)
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error || `Failed to ${type === "create" ? "create" : "update"} assignment`)
            console.error("Form action error:", state.error)
        }
    }, [state, type, router, setOpen])

    async function onSubmit(values: AssignmentSchema) {
        try {
            startTransition(() => {
                formAction(values);
            });
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("An unexpected error occurred");
        }
    }
    const lessons = relatedData?.lessons
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

                <span className="text-xs text-gray-400 font-medium">Assignment Details</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="Title" placeholder="title" control={form.control} name="title" />
                </div>
                <div className="flex justify-between flex-wrap gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Start Date
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
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Due Date
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
                            name="lessonId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lesson</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={data?.lessonId?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Lessons" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {lessons?.map((lesson: { id: number, name: string }) => (
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

                </div>
                <Button type="submit" disabled={isPending}>{isPending ? type === "create" ? "Creating..." : "Updating..." : type === "create" ? "Create" : "Update"}</Button>
            </form>
        </Form>
    )
}
