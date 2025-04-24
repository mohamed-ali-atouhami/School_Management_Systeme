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
import InputFields from "../InputFields"
import { createSubject, updateSubject } from "@/lib/Actions"
import { subjectSchema, SubjectSchema } from "@/lib/FormValidationSchema"
import { useActionState } from "react"
import { toast } from "sonner"
import { useTransition, useEffect } from 'react'
import { useRouter } from "next/navigation"
import Select from "react-select"

export default function SubjectForm({ type, data, setOpen, relatedData }: { type: "create" | "edit", data?: SubjectSchema, setOpen: (open: boolean) => void, relatedData?: { teachers?: { id: string, name: string, surname: string }[] } }) {
    const form = useForm<SubjectSchema>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            id: data?.id || undefined,
            subjectName: data?.subjectName || "",
            teachers: data?.teachers || [],
        },
    })
    const [isPending, startTransition] = useTransition()
    const [state, formAction] = useActionState(type === "create" ? createSubject : updateSubject, { success: false, error: false })
    const router = useRouter()
    useEffect(() => {
        if (state?.success === true) {
            toast.success(`Subject ${type === "create" ? "created" : "updated"} successfully!`)
            form.reset()
            setOpen(false)
            router.push("/list/subjects")
        } else if (state?.error === true) {
            toast.error(`Failed to ${type === "create" ? "create" : "update"} subject!`)
        }
    }, [state, type, form, router, setOpen])

    async function onSubmit(values: SubjectSchema) {
        // Ensure we're sending an object with all required fields
        const payload = {
            id: data?.id, // Include id for updates
            subjectName: values.subjectName,
            teachers: values.teachers || [] // Ensure teachers is always an array
        }
        
        startTransition(() => {
            formAction(payload)
        })
    }
    const teachers = relatedData?.teachers || []

    // Transform teacher options for react-select
    const teacherOptions = teachers.map((teacher: {id: string, name: string, surname: string}) => ({
        value: teacher.id,
        label: `${teacher.name} ${teacher.surname}`
    }))

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <span className="text-xs text-gray-400 font-medium">Subject Information</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="Subject Name" placeholder="subject name" control={form.control} name="subjectName" />
                    {data && <InputFields type="text" label="Id" placeholder="subject id" control={form.control} name="id" hidden/>}
                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="teachers"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teachers</FormLabel>
                                    <FormControl>
                                        <Select
                                            isMulti
                                            options={teacherOptions}
                                            value={teacherOptions.filter((option: {value: string, label: string}) => 
                                                field.value?.includes(option.value)
                                            )}
                                            onChange={(newValue) => {
                                                field.onChange(newValue ? newValue.map(v => v.value) : [])
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            placeholder="Select teachers..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={isPending}>
                    {isPending ? (type === "create" ? "Creating..." : "Updating...") : (type === "create" ? "Create" : "Update")}
                </Button>
            </form>
        </Form>
    )
}
