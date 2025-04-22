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
import Image from "next/image"
import { studentSchema, StudentSchema } from "@/lib/FormValidationSchema"
import { UploadButton } from "@/lib/uploadthing"
import { toast } from "sonner"
import { useActionState, useEffect, useState, useTransition } from "react"
import { createStudent, updateStudent } from "@/lib/Actions"
import { useRouter } from "next/navigation"

export default function StudentForm({ type, data, setOpen, relatedData }: { type: "create" | "edit", data?: any, setOpen: (open: boolean) => void, relatedData?: { classes?: { id: number; name: string; capacity: number; _count: { students: number }}[], grades?: { id: number; level: string }[], parents?: { id: string; name: string; surname: string }[] } }) {
    const form = useForm<StudentSchema>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            id: data?.id || "",
            username: data?.username || "",
            email: data?.email || "",
            password: data?.password || "",
            name: data?.name || "",
            surname: data?.surname || "",
            phone: data?.phone || "",
            address: data?.address || "",
            bloodType: data?.bloodType || undefined,
            sex: data?.sex || undefined,
            birthday: data?.birthday || undefined,
            image: data?.image || "",
            gradeId: data?.gradeId || 0,
            classId: data?.classId || undefined,
            parentId: data?.parentId || "",
        },
    })
    const [isPending, startTransition] = useTransition()
    const [state, formAction] = useActionState(type === "create" ? createStudent : updateStudent, {
        success: false,
        error: false
    })
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (state?.success === true) {
            toast.success(`Student ${type === "create" ? "created" : "updated"} successfully!`)
            setOpen(false)
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error || `Failed to ${type === "create" ? "create" : "update"} student`)
            console.error("Form action error:", state.error)
        }
    }, [state, type, router, setOpen])

    async function onSubmit(values: StudentSchema) {
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
    const classes = relatedData?.classes || []
    const grades = relatedData?.grades || []
    const parents = relatedData?.parents || []
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <span className="text-xs text-gray-400 font-medium">Authentication Credentials</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="Username" placeholder="username" control={form.control} name="username" />
                    {data && <InputFields type="text" label="Id" control={form.control} name="id" hidden />}
                    <InputFields type="email" label="Email" placeholder="email" control={form.control} name="email" />
                    <InputFields type="password" label="Password" placeholder="password" control={form.control} name="password" />
                </div>
                <span className="text-xs text-gray-400  font-medium">Personal Information</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="Name" placeholder="name" control={form.control} name="name" />
                    <InputFields type="text" label="Surname" placeholder="surname" control={form.control} name="surname" />
                    <InputFields type="tel" label="Phone" placeholder="phone" control={form.control} name="phone" />
                    <InputFields type="text" label="Address" placeholder="address" control={form.control} name="address" />
                    <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sex</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={data?.sex}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sex" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Blood Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={data?.bloodType}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select blood" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {["A_PLUS", "A_MINUS", "B_PLUS", "B_MINUS", "AB_PLUS", "AB_MINUS", "O_PLUS", "O_MINUS"].map((type, index) => (
                                            <SelectItem key={index} value={type}>
                                                {type}
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
                        name="birthday"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Birth Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between flex-wrap gap-4">
                        <FormField
                            control={form.control}
                            name="classId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(value)} defaultValue={data?.classId?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {classes.map((clss: { id: number; name: string; capacity: number; _count: { students: number }}, index: number) => (
                                                <SelectItem key={index} value={clss.id.toString()}>
                                                    {clss.name} - {clss._count.students}/{clss.capacity} Capacity
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
                                    <Select onValueChange={(value) => field.onChange(value)} defaultValue={data?.gradeId?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select grade" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {grades.map((grade: { id: number, level: string }, index: number) => (
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
                    <div className="flex justify-between flex-wrap gap-4">
                        <FormField
                            control={form.control}
                            name="parentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(value)} defaultValue={data?.parentId}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select parent" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {parents.map((parent: { id: string, name: string, surname: string }, index: number) => (
                                                <SelectItem key={index} value={parent.id}>
                                                    {parent.name} {parent.surname}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                console.log(res)
                                                if (res?.[0]) {
                                                    onChange(res[0].url);
                                                    toast.success("Image uploaded successfully!");
                                                }
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast.error(`Upload failed: ${error.message}`);
                                            }}
                                        />
                                        {value && (
                                            <div className="relative w-20 h-20">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Image
                                                        src={value}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover rounded-md"
                                                        unoptimized
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
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
