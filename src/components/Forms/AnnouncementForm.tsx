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
import { announcementSchema, AnnouncementSchema } from "@/lib/FormValidationSchema"
import { useActionState , useEffect , useTransition} from "react"
import { createAnnouncement, updateAnnouncement } from "@/lib/Actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AnnouncementForm({ type, data, setOpen, relatedData }: { type: "create" | "edit", data?: AnnouncementSchema, setOpen: (open: boolean) => void, relatedData?: { classes: { id: number, name: string }[] } }) {
    const form = useForm<AnnouncementSchema>({
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            id: data?.id || undefined,
            title: data?.title || "",
            description: data?.description || "",
            date: data?.date,
            classId: data?.classId || 0,
        },
    })

    const [isPending, startTransition] = useTransition()
    const [state, formAction] = useActionState(type === "create" ? createAnnouncement : updateAnnouncement, {
        success: false,
        error: false
    })
    const router = useRouter()

    useEffect(() => {
        if (state?.success === true) {
            toast.success(`Announcement ${type === "create" ? "created" : "updated"} successfully!`)
            setOpen(false)
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error || `Failed to ${type === "create" ? "create" : "update"} announcement`)
            console.error("Form action error:", state.error)
        }
    }, [state, type, router, setOpen])

    async function onSubmit(values: AnnouncementSchema) {
        try {
            startTransition(() => {
                formAction(values);
            });
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("An unexpected error occurred");
        }
    }
    const classes = relatedData?.classes
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

                <span className="text-xs text-gray-400 font-medium">Announcement Details</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="Title" placeholder="title" control={form.control} name="title"   />
                    <InputFields type="text" label="Description" placeholder="description" control={form.control} name="description"   />
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
                    <div className="flex flex-col gap-2 w-full md:w-1/2">
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
