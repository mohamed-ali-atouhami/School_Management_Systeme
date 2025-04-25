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
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from "@/components/ui/select"
import InputFields from "../InputFields"
import { resultSchema, ResultSchema} from "@/lib/FormValidationSchema"
import { useTransition, useEffect , useActionState} from "react"
import {createResult,updateResult } from "@/lib/Actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
export default function ResultForm({ type, data, setOpen , relatedData}: { type: "create" | "edit", data?: ResultSchema, setOpen: (open: boolean) => void , relatedData?: { students: { id: string; name: string ; surname:string}[] , exams: {id : number; title : string}[] , assignments: {id : number; title : string}[] }}) {
    const form = useForm<ResultSchema>({
        resolver: zodResolver(resultSchema),
        defaultValues: {
            id: data?.id,
            score: data?.score || "",
            studentId: data?.studentId || "",
            examId: data?.examId || undefined,
            assignmentId: data?.assignmentId || undefined,
        },
    })

    const [isPending, startTransition] = useTransition()
    const [state, formAction] = useActionState(type === "create" ? createResult : updateResult, { success: false, error: false })
    const router = useRouter()
    useEffect(() => {
        if (state?.success) {
            toast.success(`Result ${type === "create" ? "created" : "updated"} successfully!`)
            form.reset()
            setOpen(false)
            router.push("/list/results")
        } else if (state?.error) {
            toast.error(state.error || `Failed to ${type === "create" ? "create" : "update"} result!`)
        }
    }, [state, type, form, router, setOpen])
    function onSubmit(values: ResultSchema) {
        startTransition(() => {
            formAction(values)
        })
    }
    const students = relatedData?.students || []
    const exams = relatedData?.exams || []
    const assignments = relatedData?.assignments || []
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

                <span className="text-xs text-gray-400 font-medium">Result Details</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="Score" placeholder="score" control={form.control} name="score"  />
                </div>
                <div className="flex justify-between flex-wrap gap-4">
                    <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Students</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={data?.studentId}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select students" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {students?.map((student: {id:string, name:string, surname:string}) => (
                                            <SelectItem key={student.id} value={student.id}>
                                                {student.name} {student.surname}
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
                        name="examId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Exams</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={data?.examId?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Exams" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {exams?.map((exm :{id: number, title: string}) => (
                                            <SelectItem key={exm.id} value={exm.id.toString()}>
                                                {exm.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-2 w-full md:w-1/4">
                        <FormField
                            control={form.control}
                            name="assignmentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assignments</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={data?.assignmentId?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Assignments" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {assignments.map((asi : {id : number , title : string}) => (
                                                <SelectItem key={asi.id} value={asi.id.toString()}>
                                                    {asi.title}
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
                <Button type="submit" disabled={isPending}>{isPending ? type==="create" ? "Creating..." : "Updating..." : type === "create" ? "Create" : "Update"}</Button>
            </form>
        </Form>
    )
}