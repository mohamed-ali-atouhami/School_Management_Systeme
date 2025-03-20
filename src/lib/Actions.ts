"use server"

import { clerkClient } from "@clerk/nextjs/server"
import { SubjectSchema, ClassSchema, TeacherSchema } from "./FormValidationSchema"
import prisma from "./prisma"
type CurrentState = {
    success: boolean,
    error: boolean
}
// Subject Actions
export async function createSubject(currentState: CurrentState, formData: SubjectSchema) {
    if (!formData || !formData.subjectName) {
        console.error('Invalid form data received:', formData)
        return { success: false, error: true }
    }

    try {
        await prisma.subject.create({
            data: {
                name: formData.subjectName,
                teachers: {
                    connect: (formData.teachers || []).map((teacher) => ({ id: teacher }))
                }
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.error(error)
        return { success: false, error: true }
    }
}
export async function updateSubject(currentState: CurrentState, formData: SubjectSchema) {
    if (!formData || !formData.id || !formData.subjectName) {
        console.error('Invalid form data received:', formData)
        return { success: false, error: true }
    }

    try {
        await prisma.subject.update({
            where: { id: formData.id },
            data: {
                name: formData.subjectName,
                teachers: {
                    set: (formData.teachers || []).map((teacher) => ({ id: teacher }))
                }
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.error(error)
        return { success: false, error: true }
    }
}
export async function deleteSubject(formData: FormData) {
    const id = formData.get("id")
    try {
        await prisma.subject.delete({
            where: { id: Number(id) },
        })
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}
// Class Actions
export async function createClass(currentState: CurrentState, formData: ClassSchema) {
    if (!formData || !formData.className) {
        console.error('Invalid form data received:', formData)
        return { success: false, error: true }
    }

    try {
        await prisma.class.create({
            data: {
                name: formData.className,
                capacity: formData.capacity,
                gradeId: formData.gradeId,
                supervisorId: formData.supervisorId
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.error(error)
        return { success: false, error: true }
    }
}
export async function updateClass(currentState: CurrentState, formData: ClassSchema) {
    if (!formData || !formData.id || !formData.className) {
        console.error('Invalid form data received:', formData)
        return { success: false, error: true }
    }

    try {
        await prisma.class.update({
            where: { id: formData.id },
            data: {
                name: formData.className,
                capacity: formData.capacity,
                gradeId: formData.gradeId,
                supervisorId: formData.supervisorId
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.error(error)
        return { success: false, error: true }
    }
}
export async function deleteClass(formData: FormData) {
    const id = formData.get("id")
    try {
        await prisma.class.delete({
            where: { id: Number(id) },
        })
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}
// Teacher Actions
export async function createTeacher(currentState: CurrentState, formData: TeacherSchema) {
    if (!formData || !formData.username || !formData.password || !formData.name || !formData.surname) {
        console.error('Invalid form data received:', formData)
        return { success: false, error: true }
    }

    try {
        const clerk = await clerkClient()
        const user = await clerk.users.createUser({
            username: formData.username,
            password: formData.password,
           // emailAddress: [formData.email || ''],
            firstName: formData.name,
            lastName: formData.surname,
        })
        await clerk.users.updateUser(user.id, {
            publicMetadata: {
                role: "teacher"
            }
        })
        await prisma.teacher.create({
            data: {
                id: user.id,
                username: formData.username,
                name: formData.name,
                surname: formData.surname,
                email: formData.email || '',
                phone: formData.phone || '',
                address: formData.address || '',
                bloodType: formData.bloodType,
                sex: formData.sex,
                birthday: formData.birthday,
                image: formData.img || '',
                subjects: {
                    connect: formData.subjects?.map((subjectId: string) => ({ id: parseInt(subjectId) })) || []
                },
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.error('Error creating teacher:', error)
        return { success: false, error: true }
    }
}
export async function updateTeacher(currentState: CurrentState, formData: TeacherSchema) {
    if (!formData || !formData.id || !formData.username || !formData.name || !formData.surname || !formData.email || !formData.phone || !formData.birthday || !formData.address || !formData.bloodType || !formData.sex) {
        console.error('Invalid form data received:', formData)
        return { success: false, error: true }
    }
    try {
        await prisma.teacher.update({
            where: { id: formData.id },
            data: {
                username: formData.username,
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                bloodType: formData.bloodType,
                sex: formData.sex,
                //image: formData.img,
                birthday: formData.birthday,
                subjects: {
                    set: formData.subjects?.map((subjectId: string) => ({ id: parseInt(subjectId) }))
                }
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.error(error)
        return { success: false, error: true }
    }
}
export async function deleteTeacher(formData: FormData) {
    const id = formData.get("id")
    try {
        // Delete from Prisma first
        await prisma.teacher.delete({
            where: { id: String(id) },
        })
        
        try {
            // Then try to delete from Clerk
            const clerk = await clerkClient()
            await clerk.users.deleteUser(String(id))
        } catch (clerkError) {
            // Log Clerk deletion error but don't fail the operation
            console.error('Error deleting Clerk user:', clerkError)
            // Optionally, you could add a cleanup or notification system here
        }
        
        return true
    } catch (error) {
        console.error('Error deleting teacher from database:', error)
        return false
    }
}

