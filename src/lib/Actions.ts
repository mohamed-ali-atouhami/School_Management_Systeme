"use server"

import { SubjectSchema } from "./FormValidationSchema"
import prisma from "./prisma"
type CurrentState = {
    success: boolean,
    error: boolean
}
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


