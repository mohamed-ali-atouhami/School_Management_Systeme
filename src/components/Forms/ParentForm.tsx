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
import { parentSchema, ParentSchema } from "@/lib/FormValidationSchema"
import { useTransition, useEffect , useActionState} from "react"
import { createParent, updateParent } from "@/lib/Actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import MultiSelect, { MultiValue } from 'react-select';
export default function ParentForm({ type, data, setOpen, relatedData }: { type: "create" | "edit", data?: ParentSchema, setOpen: (open: boolean) => void, relatedData?: { students?: { id: string; name: string; surname: string }[] } }) {
    const form = useForm<ParentSchema>({
        resolver: zodResolver(parentSchema),
        defaultValues: {
            id: data?.id || undefined,
            username: data?.username || "",
            email: data?.email || "",
            password: data?.password || "",
            name: data?.name || "",
            surname: data?.surname || "",
            phone: data?.phone || "",
            address: data?.address || "",
            students: data?.students || [],
        },
    })

    const [isPending, startTransition] = useTransition()
    const [state, formAction] = useActionState(type === "create" ? createParent : updateParent, {
        success: false,
        error: false
    })
    const router = useRouter()

    useEffect(() => {
        if (state?.success === true) {
            toast.success(`Parent ${type === "create" ? "created" : "updated"} successfully!`)
            setOpen(false)
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error || `Failed to ${type === "create" ? "create" : "update"} parent`)
            //console.error("Form action error:", state.error)
        }
    }, [state, type, router, setOpen])

    async function onSubmit(values: ParentSchema) {
        try {
            startTransition(() => {
                formAction(values);
            });
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("An unexpected error occurred");
        }
    }
    const students = relatedData?.students || []
    const studentOptions = students?.map((student) => ({
        value: student.id,
        label: `${student.name} ${student.surname}`
    }))
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
                    {data && <InputFields label="Id" control={form.control} name="id" hidden />}
                    <InputFields type="text" label="First Name" placeholder="first name" control={form.control} name="name" />
                    <InputFields type="text" label="Last Name" placeholder="last name" control={form.control} name="surname" />
                    <InputFields type="text" label="Phone" placeholder="phone" control={form.control} name="phone" />
                    <InputFields type="text" label="Address" placeholder="address" control={form.control} name="address" />

                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="students"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Students</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={studentOptions}
                                            value={studentOptions.filter((option: { value: string, label: string }) =>
                                                field.value?.includes(option.value)
                                            )}
                                            onChange={(newValue: MultiValue<{ value: string, label: string }>) => {
                                                field.onChange(newValue.map((v: { value: string, label: string }) => v.value))
                                            }}
                                            isMulti
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            placeholder="students"
                                        />
                                    </FormControl>
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
{/* <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: { onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel htmlFor="image" className="text-xs text-gray-400 flex items-center gap-2 cursor-pointer">
                                        <Image src="/upload.png" alt="upload" width={28} height={28} />
                                        <span>Upload Image</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="image"
                                            className="hidden"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    onChange(file);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div> */}
