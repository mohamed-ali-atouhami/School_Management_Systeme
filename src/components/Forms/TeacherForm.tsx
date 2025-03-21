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
import { teacherSchema, TeacherSchema } from "@/lib/FormValidationSchema"
import { toast } from "sonner"
import { useTransition, useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createTeacher } from "@/lib/Actions"
import { UploadButton } from "@/lib/uploadthing"
import Image from "next/image"

export default function TeacherForm({ type, data, setOpen, relatedData }: { type: "create" | "edit", data?: any, setOpen: (open: boolean) => void, relatedData?: any }) {
    const form = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            username: data?.username || "",
            email: data?.email || "",
            password: data?.password || "",
            name: data?.name || "",
            surname: data?.surname || "",
            phone: data?.phone || "",
            address: data?.address || "",
            bloodType: data?.bloodType || "",
            sex: data?.sex || "",
            birthday: data?.birthday || "",
            image: data?.image || "",
            subjects: data?.subjects || [],
        },
    })
    const [isPending, startTransition] = useTransition()
    const [state, formAction] = useActionState(createTeacher, { success: false, error: false })
    const router = useRouter()
    useEffect(() => {
        if (state?.success === true) {
            toast.success(`Teacher ${type === "create" ? "created" : "updated"} successfully!`)
            form.reset()
            setOpen(false)
            router.push("/list/teachers")
        } else if (state?.error === true) {
            toast.error(`Failed to ${type === "create" ? "create" : "update"} teacher!`)
        }
    }, [state, type, form, router])

    function onSubmit(values: TeacherSchema) {
        console.log("form submitted: ",values)
        // const payload = {
        //     id: data?.id,
        //     username: values.username,
        //     email: values.email,
        //     password: values.password,
        //     name: values.name,
        //     surname: values.surname,
        //     phone: values.phone,
        //     address: values.address,
        //     bloodType: values.bloodType,
        //     sex: values.sex,
        //     birthday: values.birthday,
        //     image: values.image || '',
        //     subjects: values.subjects || [],
        // }
        //console.log("payload with image: ",payload)
        startTransition(() => {
            formAction(values)
        })
    }
    const subjects = relatedData?.subjects || []
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <span className="text-xs text-gray-400 font-medium">Authentication Credentials</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="Username" placeholder="username" control={form.control} name="username" />
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
                    <div className="flex flex-col gap-2 w-full md:w-1/4">
                        <FormField
                            control={form.control}
                            name="subjects"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subjects</FormLabel>
                                    <FormControl>
                                        <select
                                            multiple
                                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                                            value={field.value || []}
                                            onChange={(e) => {
                                                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                                field.onChange(selectedOptions);
                                            }}
                                        >
                                            {subjects.map((subject: { id: number, name: string }) => (
                                                <option key={subject.id} value={subject.id.toString()}>
                                                    {subject.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                    </div>
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
                                        <div className="relative w-20 h-20 hover:opacity-80 transition-opacity">
                                            <Image
                                                src={value}
                                                alt="Preview"
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>{isPending ? type === "create" ? "Creating..." : "Updating..." : type === "create" ? "Create" : "Update"}</Button>
            </form>
        </Form>
    )
}
