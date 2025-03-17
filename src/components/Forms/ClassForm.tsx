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
import { classSchema, ClassSchema } from "@/lib/FormValidationSchema"
import { createClass, updateClass } from "@/lib/Actions"
import { useActionState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ClassForm({ type, data, setOpen, relatedData }: { type: "create" | "edit", data?: any, setOpen: (open: boolean) => void, relatedData?: any }) {
    const form = useForm<ClassSchema>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            className: data?.name || "",
            capacity: data?.capacity || "",
            gradeId: data?.gradeId || 0,
            supervisorId: data?.supervisorId || "",
        },
    })
    const [isPending, startTransition] = useTransition()
    const [state, formAction] = useActionState(type === "create" ? createClass : updateClass, { success: false, error: false })
    const router = useRouter()
    useEffect(() => {
        if (state?.success === true) {
            toast.success(`Class ${type === "create" ? "created" : "updated"} successfully!`)
            form.reset()
            setOpen(false)
            router.push("/list/classes")
        } else if (state?.error === true) {
            toast.error(`Failed to ${type === "create" ? "create" : "update"} class!`)
        }
    }, [state, type, form, router])
    function onSubmit(values: ClassSchema) {
        const payload = {
            id: data?.id, // Include id for updates
            className: values.className,
            capacity: values.capacity,
            gradeId: values.gradeId,
            supervisorId: values.supervisorId
        }
        startTransition(() => {
            formAction(payload)
        })
    }
    const teachers = relatedData?.teachers || []
    const grades = relatedData?.grades || []
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

                <span className="text-xs text-gray-400 font-medium">Class Information</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="Class Name" placeholder="class name" control={form.control} name="className" />
                    <InputFields type="number" label="Capacity" placeholder="capacity" control={form.control} name="capacity" />
                    <div className="flex justify-between flex-wrap gap-4">
                    {data && <InputFields label="Id" control={form.control} name="id" hidden />}
                   
                    <FormField
                        control={form.control}
                        name="supervisorId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Supervisor</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={data?.supervisorId}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select supervisor" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {teachers.map((teacher: {id: string, name: string, surname: string}, index: number) => (
                                            <SelectItem key={index} value={teacher.id}>
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
                <div className="flex justify-between flex-wrap gap-4">
                    <FormField
                        control={form.control}
                        name="gradeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Grade</FormLabel>
                                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={data?.gradeId?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select grade" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {grades.map((grade: {id: number, level: string}, index: number) => (
                                            <SelectItem key={index} value={grade.id.toString()}>
                                                {grade.level}
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
                
                <Button type="submit" disabled={isPending}>
                    {isPending ? (type === "create" ? "Creating..." : "Updating...") : (type === "create" ? "Create" : "Update")}
                </Button>
            </form>
        </Form>
    )
}
