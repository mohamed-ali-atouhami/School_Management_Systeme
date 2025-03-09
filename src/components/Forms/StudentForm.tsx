"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from "@/components/ui/select"
import InputFields from "../InputFields"
import Image from "next/image"


const formSchema = z.object({
    username: z.string().min(3, { message: "must be at least 3 characters." })
        .max(20, { message: "must be less than 20 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, { message: "  must be at least 8 characters." })
        .max(20, { message: " must be less than 20 characters." }),
    firstName: z.string().min(3, { message: "must be at least 3 characters." })
        .max(20, { message: "must be less than 20 characters." }),
    lastName: z.string().min(3, { message: "must be at least 3 characters." })
        .max(20, { message: "must be less than 20 characters." }),
    phone: z.string().min(10, { message: "must be at least 10 digits." })
        .max(15, { message: "must be less than 15 digits." }),
    bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], { message: "Invalid blood type." }),
    address: z.string().min(3, { message: "must be at least 3 characters." })
        .max(50, { message: "must be less than 50 characters." }),
    birthDate: z.date({ message: "Invalid birth date." }),
    sex: z.enum(["male", "female"], { message: "Invalid sex." }),
    image: z.instanceof(File, { message: "Invalid image." }),
})

export default function StudentForm({ type, data }: { type: "create" | "edit", data?: any }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phone: "",
            address: "",
            birthDate: new Date(),
            sex: "male",
            image: undefined,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                {/* <h1 className="text-2xl font-semibold">Student Form</h1> */}
                <span className="text-xs text-gray-400 font-medium">Authentication Credentials</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="Username" placeholder="username" control={form.control} name="username" defaultValue={data?.username} />
                    <InputFields type="email" label="Email" placeholder="email" control={form.control} name="email" defaultValue={data?.email} />
                    <InputFields type="password" label="Password" placeholder="password" control={form.control} name="password" defaultValue={data?.password} />
                </div>
                <span className="text-xs text-gray-400  font-medium">Personal Information</span>
                <div className="flex justify-between flex-wrap gap-4">
                    <InputFields type="text" label="First Name" placeholder="first name" control={form.control} name="firstName" defaultValue={data?.firstName} />
                    <InputFields type="text" label="Last Name" placeholder="last name" control={form.control} name="lastName" defaultValue={data?.lastName} />
                    <InputFields type="text" label="Phone" placeholder="phone" control={form.control} name="phone" defaultValue={data?.phone} />
                    <InputFields type="text" label="Address" placeholder="address" control={form.control} name="address" defaultValue={data?.address} />
                    <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Blood Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={data?.bloodType}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select blood type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type, index) => (
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
                            name="birthDate"
                            render={({ field: { onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel>
                                        Birth Date
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            onChange={onChange}
                                            //value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                            defaultValue={data?.birthDate ? new Date(data?.birthDate).toISOString().split('T')[0] : ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <div className="flex flex-col gap-2 w-full md:w-1/4">
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
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
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
                    </div>
                </div>
                <Button type="submit">{type === "create" ? "Create" : "Update"}</Button>
            </form>
        </Form>
    )
}
