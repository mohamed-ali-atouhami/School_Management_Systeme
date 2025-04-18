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
import { eventSchema, EventSchema } from "@/lib/FormValidationSchema"
import { useTransition } from "react"
import { useActionState } from "react"
import { createEvent, updateEvent } from "@/lib/Actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function EventForm({ type, data, setOpen, relatedData }: { type: "create" | "edit", data?: any, setOpen: (open: boolean) => void, relatedData?: { classes: { id: number, name: string }[] } }) {
    const form = useForm<EventSchema>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            id: data?.id || "",
            title: data?.title || "",
            description: data?.description || "",
            startTime: data?.startTime,
            endTime: data?.endTime,
            classId: data?.classId || 0,
        },
    })

    const [isPending, startTransition] = useTransition()
    const [state, formAction] = useActionState(type === "create" ? createEvent : updateEvent, {
        success: false,
        error: false
    })
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (state?.success === true) {
            toast.success(`Event ${type === "create" ? "created" : "updated"} successfully!`)
            setOpen(false)
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error || `Failed to ${type === "create" ? "create" : "update"} event`)
            console.error("Form action error:", state.error)
        }
    }, [state, type, router, setOpen])

    async function onSubmit(values: EventSchema) {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            startTransition(() => {
                formAction(values);
            });
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    }
    const classes = relatedData?.classes
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

                <span className="text-xs text-gray-400 font-medium">Event Details</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="Title" placeholder="title" control={form.control} name="title"   />
                    <InputFields type="text" label="Description" placeholder="description" control={form.control} name="description"   />
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
                            name="classId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={data?.classId?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Classes" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {classes?.map((clss: {id: number, name: string}) => (
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
                    
                </div>
                <Button type="submit" disabled={isPending}>{isPending ? type === "create" ? "Creating..." : "Updating..." : type === "create" ? "Create" : "Update"}</Button>
            </form>
        </Form>
    )
}
