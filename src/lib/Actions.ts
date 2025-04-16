"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { SubjectSchema, ClassSchema, TeacherSchema, StudentSchema, ExamSchema, ParentSchema, LessonSchema } from "./FormValidationSchema"
import prisma from "./prisma"
import { UTApi } from "uploadthing/server"
type CurrentState = {
    success: boolean,
    error: boolean | string
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
    // Validate the incoming formData first
    if (!formData) {
        console.error('FormData is null')
        return { success: false, error: 'Invalid form data' }
    }

    // Validate required fields
    if (!formData.username || !formData.password || !formData.name || !formData.surname) {
        console.error('Missing required fields:', {
            username: !!formData.username,
            password: !!formData.password,
            name: !!formData.name,
            surname: !!formData.surname
        })
        return { success: false, error: 'Missing required fields' }
    }

    try {
        const clerk = await clerkClient()

        // Create user in Clerk
        let user;
        try {
            user = await clerk.users.createUser({
                username: formData.username,
                password: formData.password,
                firstName: formData.name,
                lastName: formData.surname,
            })
        } catch (clerkError) {
            console.error('Clerk user creation failed:', clerkError)
            await deleteImageFromUploadThing(formData.image, "Clerk creation failure")
            return { success: false, error: 'Failed to create user authentication' }
        }

        if (!user || !user.id) {
            console.error('Clerk user creation succeeded but no user ID returned')
            await deleteImageFromUploadThing(formData.image, "invalid Clerk response")
            return { success: false, error: 'Invalid user creation response' }
        }

        // Update user metadata
        try {
            await clerk.users.updateUser(user.id, {
                publicMetadata: { role: "teacher" }
            })
        } catch (metadataError) {
            console.error('Failed to update user metadata:', metadataError)
            // Clean up the created user in Clerk
            await clerk.users.deleteUser(user.id)
            await deleteImageFromUploadThing(formData.image, "metadata update failure")
            return { success: false, error: 'Failed to set user role' }
        }

        // Create teacher in database
        try {
            const teacherData = {
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
                image: formData.image || '',
                subjects: {
                    connect: formData.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId)
                    })) || []
                },
                classes: {
                    connect: formData.classes?.map((classId: string) => ({
                        id: parseInt(classId)
                    })) || []
                }
            }

            console.log('Creating teacher with data:', teacherData)

            const createdTeacher = await prisma.teacher.create({
                data: teacherData
            })

            if (!createdTeacher) {
                throw new Error('Teacher creation returned null')
            }

        } catch (dbError) {
            console.error('Database creation failed:', dbError)
            // Clean up the created user in Clerk
            await clerk.users.deleteUser(user.id)
            await deleteImageFromUploadThing(formData.image, "database creation failure")
            return { success: false, error: 'Failed to create teacher record' }
        }

        return { success: true, error: false }
    } catch (error) {
        console.error('Unexpected error creating teacher:', error)
        await deleteImageFromUploadThing(formData.image, "unexpected error")
        return { success: false, error: 'An unexpected error occurred' }
    }
}
export async function updateTeacher(currentState: CurrentState, formData: TeacherSchema) {
    if (!formData || !formData.id) {
        console.error('FormData is null')
        return { success: false, error: 'Invalid form data' }
    }
    try {
        // First get the current teacher data to check if image has changed
        const currentTeacher = await prisma.teacher.findUnique({
            where: { id: formData.id },
            select: { image: true }
        });

        const clerk = await clerkClient()
        let user;
        if (!formData.id) {
            return { success: false, error: 'Teacher not found' }
        }
        try {
            user = await clerk.users.updateUser(formData.id, {
                username: formData.username,
                ...(formData.password !== "" && { password: formData.password }),
                firstName: formData.name,
                lastName: formData.surname,
            })
        } catch (clerkError) {
            console.error('Clerk user update failed:', clerkError)
            return { success: false, error: 'Failed to update user authentication' }
        }

        if (!user || !user.id) {
            console.error('Clerk user update succeeded but no user ID returned')
            return { success: false, error: 'Invalid user update response' }
        }
        try {
            const updatedTeacher = await prisma.teacher.update({
                where: { id: formData.id },
                data: {
                    ...(formData.password !== "" && { password: formData.password }),
                    username: formData.username,
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email || '',
                    phone: formData.phone || '',
                    address: formData.address || '',
                    bloodType: formData.bloodType,
                    sex: formData.sex,
                    birthday: formData.birthday,
                    image: formData.image || '',
                    subjects: {
                        connect: formData.subjects?.map((subjectId: string) => ({
                            id: parseInt(subjectId)
                        })) || []
                    },
                    classes: {
                        connect: formData.classes?.map((classId: string) => ({
                            id: parseInt(classId)
                        })) || []
                    }
                }
            })

            if (!updatedTeacher) {
                throw new Error('Teacher update returned null')
            }

            // Delete old image from UploadThing if it exists and has changed
            if (currentTeacher?.image && currentTeacher.image !== formData.image) {
                await deleteImageFromUploadThing(currentTeacher.image, "image update")
            }

        } catch (dbError) {
            console.error('Database update failed:', dbError)
            // Clean up the created user in Clerk
            await clerk.users.deleteUser(user.id)
            return { success: false, error: 'Failed to update teacher record' }
        }

        return { success: true, error: false }
    } catch (error) {
        console.error('Unexpected error updating teacher:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}
export async function deleteTeacher(formData: FormData) {
    const id = formData.get("id");
    const imageUrl = formData.get("image") as string;

    try {
        // Delete from Prisma
        await prisma.teacher.delete({
            where: { id: String(id) },
        });

        // Delete from Clerk
        try {
            const clerk = await clerkClient();
            await clerk.users.deleteUser(String(id));
        } catch (clerkError) {
            console.error("Error deleting Clerk user:", clerkError);
        }

        // Delete image from UploadThing
        await deleteImageFromUploadThing(imageUrl, "teacher deletion");

        return true;
    } catch (error) {
        console.error("Error deleting teacher from database:", error);
        return false;
    }
}
// Helper function to delete image from UploadThing
async function deleteImageFromUploadThing(imageUrl: string | undefined, context: string) {
    if (!imageUrl) return;

    const fileKey = imageUrl.split("/f/")[1];
    if (!fileKey) return;

    const utapi = new UTApi();
    try {
        await utapi.deleteFiles(fileKey);
        console.log(`Successfully deleted image after ${context}:`, fileKey);
    } catch (e) {
        console.error(`Error deleting image after ${context}:`, e);
    }
}
// Student Actions
export async function createStudent(currentState: CurrentState, formData: StudentSchema) {
    // Validate the incoming formData first
    if (!formData) {
        console.error('FormData is null')
        return { success: false, error: 'Invalid form data' }
    }

    // Validate required fields
    if (!formData.username || !formData.password || !formData.name || !formData.surname) {
        console.error('Missing required fields:', {
            username: !!formData.username,
            password: !!formData.password,
            name: !!formData.name,
            surname: !!formData.surname
        })
        return { success: false, error: 'Missing required fields' }
    }

    try {
        const classItem = await prisma.class.findUnique({
            where: { id: formData.classId },
            include: { _count: { select: { students: true } } }
        })
        if (classItem && classItem.capacity === classItem._count.students) {
            return { success: false, error: 'Class is full' }
        }

        const clerk = await clerkClient()

        // Create user in Clerk
        let user;
        try {
            user = await clerk.users.createUser({
                username: formData.username,
                password: formData.password,
                firstName: formData.name,
                lastName: formData.surname,
            })
        } catch (clerkError) {
            console.error('Clerk user creation failed:', clerkError)
            await deleteImageFromUploadThing(formData.image, "Clerk creation failure")
            return { success: false, error: 'Failed to create user authentication' }
        }

        if (!user || !user.id) {
            console.error('Clerk user creation succeeded but no user ID returned')
            await deleteImageFromUploadThing(formData.image, "invalid Clerk response")
            return { success: false, error: 'Invalid user creation response' }
        }

        // Update user metadata
        try {
            await clerk.users.updateUser(user.id, {
                publicMetadata: { role: "student" }
            })
        } catch (metadataError) {
            console.error('Failed to update user metadata:', metadataError)
            // Clean up the created user in Clerk
            await clerk.users.deleteUser(user.id)
            await deleteImageFromUploadThing(formData.image, "metadata update failure")
            return { success: false, error: 'Failed to set user role' }
        }
        // Create student in database
        try {
            const studentData = {
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
                image: formData.image || '',
                parentId: formData.parentId,
                classId: formData.classId,
                gradeId: formData.gradeId
            }

            console.log('Creating student with data:', studentData)

            const createdStudent = await prisma.student.create({
                data: studentData
            })

            if (!createdStudent) {
                throw new Error('Student creation returned null')
            }

        } catch (dbError) {
            console.error('Database creation failed:', dbError)
            // Clean up the created user in Clerk
            await clerk.users.deleteUser(user.id)
            await deleteImageFromUploadThing(formData.image, "database creation failure")
            return { success: false, error: 'Failed to create student record' }
        }

        return { success: true, error: false }
    } catch (error) {
        console.error('Unexpected error creating student:', error)
        await deleteImageFromUploadThing(formData.image, "unexpected error")
        return { success: false, error: 'An unexpected error occurred' }
    }
}
export async function updateStudent(currentState: CurrentState, formData: StudentSchema) {
    if (!formData || !formData.id) {
        console.error('FormData is null')
        return { success: false, error: 'Invalid form data' }
    }
    try {
        // First get the current student data to check if image has changed
        const currentStudent = await prisma.student.findUnique({
            where: { id: formData.id },
            select: { image: true }
        });

        const clerk = await clerkClient()
        let user;
        if (!formData.id) {
            return { success: false, error: 'Student not found' }
        }
        try {
            user = await clerk.users.updateUser(formData.id, {
                username: formData.username,
                ...(formData.password !== "" && { password: formData.password }),
                firstName: formData.name,
                lastName: formData.surname,
            })
        } catch (clerkError) {
            console.error('Clerk user update failed:', clerkError)
            return { success: false, error: 'Failed to update user authentication' }
        }

        if (!user || !user.id) {
            console.error('Clerk user update succeeded but no user ID returned')
            return { success: false, error: 'Invalid user update response' }
        }
        try {
            const updatedStudent = await prisma.student.update({
                where: { id: formData.id },
                data: {
                    ...(formData.password !== "" && { password: formData.password }),
                    username: formData.username,
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email || '',
                    phone: formData.phone || '',
                    address: formData.address || '',
                    bloodType: formData.bloodType,
                    sex: formData.sex,
                    birthday: formData.birthday,
                    image: formData.image || '',
                    parentId: formData.parentId,
                    classId: formData.classId,
                    gradeId: formData.gradeId
                }
            })

            if (!updatedStudent) {
                throw new Error('Student update returned null')
            }

            // Delete old image from UploadThing if it exists and has changed
            if (currentStudent?.image && currentStudent.image !== formData.image) {
                await deleteImageFromUploadThing(currentStudent.image, "image update")
            }

        } catch (dbError) {
            console.error('Database update failed:', dbError)
            // Clean up the created user in Clerk
            await clerk.users.deleteUser(user.id)
            return { success: false, error: 'Failed to update student record' }
        }

        return { success: true, error: false }
    } catch (error) {
        console.error('Unexpected error updating student:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}
export async function deleteStudent(formData: FormData) {
    const id = formData.get("id");
    const imageUrl = formData.get("image") as string;
    console.log("this is the image url", imageUrl)

    try {
        // Delete from Prisma
        await prisma.student.delete({
            where: { id: String(id) },
        });

        // Delete from Clerk
        try {
            const clerk = await clerkClient();
            await clerk.users.deleteUser(String(id));
        } catch (clerkError) {
            console.error("Error deleting Clerk user:", clerkError);
        }

        // Delete image from UploadThing
        await deleteImageFromUploadThing(imageUrl, "student deletion")

        return true;
    } catch (error) {
        console.error("Error deleting student from database:", error);
        return false;
    }
}
// Parent Actions
export async function createParent(currentState: CurrentState, formData: ParentSchema) {
    if (!formData || !formData.username || !formData.password || !formData.name || !formData.surname || !formData.phone || !formData.address) {
        console.error('Invalid form data received:', formData)
        return { success: false, error: true }
    }
    try {
        const clerk = await clerkClient()

        // Create user in Clerk
        let user;
        try {
            user = await clerk.users.createUser({
                username: formData.username,
                password: formData.password,
                firstName: formData.name,
                lastName: formData.surname,
            })
        } catch (clerkError) {
            console.error('Clerk user creation failed:', clerkError)
            return { success: false, error: 'Failed to create user authentication' }
        }

        if (!user || !user.id) {
            console.error('Clerk user creation succeeded but no user ID returned')
            return { success: false, error: 'Invalid user creation response' }
        }

        // Update user metadata
        try {
            await clerk.users.updateUser(user.id, {
                publicMetadata: { role: "parent" }
            })
        } catch (metadataError) {
            console.error('Failed to update user metadata:', metadataError)
            // Clean up the created user in Clerk
            await clerk.users.deleteUser(user.id)
            return { success: false, error: 'Failed to set user role' }
        }
        // Create parent in database
        try {
            const parentData = {
                id: user.id,
                username: formData.username,
                name: formData.name,
                surname: formData.surname,
                email: formData.email || '',
                phone: formData.phone || '',
                address: formData.address || '',
                students: {
                    connect: formData.students?.map((studentId: string) => ({ id: studentId })) || []
                }
            }
            console.log('Creating parent with data:', parentData)

            const createdParent = await prisma.parent.create({
                data: parentData
            })
            if (!createdParent) {
                throw new Error('Parent creation returned null')
            }

        } catch (dbError) {
            console.error('Database creation failed:', dbError)
            // Clean up the created user in Clerk
            await clerk.users.deleteUser(user.id)
            return { success: false, error: 'Failed to create parent record' }
        }

        return { success: true, error: false }
    } catch (error) {
        console.error('Unexpected error creating parent:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}
export async function updateParent(currentState: CurrentState, formData: ParentSchema) {
    if (!formData || !formData.id) {
        console.error('FormData is null')
        return { success: false, error: 'Invalid form data' }
    }
    try {
        const clerk = await clerkClient()
        let user;
        if (!formData.id) {
            return { success: false, error: 'Parent not found' }
        }
        try {
            user = await clerk.users.updateUser(formData.id, {
                username: formData.username,
                ...(formData.password !== "" && { password: formData.password }),
                firstName: formData.name,
                lastName: formData.surname,
            })
        } catch (clerkError) {
            console.error('Clerk user update failed:', clerkError)
            return { success: false, error: 'Failed to update user authentication' }
        }

        if (!user || !user.id) {
            console.error('Clerk user update succeeded but no user ID returned')
            return { success: false, error: 'Invalid user update response' }
        }
        try {
            const updatedParent = await prisma.parent.update({
                where: { id: formData.id },
                data: {
                    ...(formData.password !== "" && { password: formData.password }),
                    username: formData.username,
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email || '',
                    phone: formData.phone || '',
                    address: formData.address || '',
                    students: {
                        connect: formData.students?.map((studentId: string) => ({ id: studentId })) || []
                    }
                }
            })

            if (!updatedParent) {
                throw new Error('Parent update returned null')
            }

        } catch (dbError) {
            console.error('Database update failed:', dbError)
            // Clean up the created user in Clerk
            await clerk.users.deleteUser(user.id)
            return { success: false, error: 'Failed to update teacher record' }
        }

        return { success: true, error: false }
    } catch (error) {
        console.error('Unexpected error updating teacher:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}
export async function deleteParent(formData: FormData) {
    const id = formData.get("id");

    try {
        // Delete from Prisma
        await prisma.parent.delete({
            where: { id: String(id) },
        });

        // Delete from Clerk
        try {
            const clerk = await clerkClient();
            await clerk.users.deleteUser(String(id));
        } catch (clerkError) {
            console.error("Error deleting Clerk user:", clerkError);
        }
        return true;
    } catch (error) {
        console.error("Error deleting parent from database:", error);
        return false;
    }
}
// Exam Actions
export async function createExam(currentState: CurrentState, formData: ExamSchema) {
    if (!formData || !formData.title || !formData.lessonId || !formData.startTime || !formData.endTime) {
        console.error('Invalid form data received:', formData)
        return { success: false, error: true }
    }
    const { sessionClaims, userId } = await auth();
    const role = (sessionClaims?.metadata as { role?: "admin" | "teacher" | "student" | "parent" })?.role;
    const currentUserId = userId!;
    try {
        if (role === "teacher") {
            const teacherLessons = await prisma.lesson.findFirst({
                where: {
                    id: formData.lessonId,
                    teacherId: currentUserId
                }
            })
            if (!teacherLessons) {
                return { success: false, error: 'Teacher does not teach this lesson' }
            }
        }
        await prisma.exam.create({
            data: {
                title: formData.title,
                startTime: formData.startTime,
                endTime: formData.endTime,
                lessonId: formData.lessonId
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.error(error)
        return { success: false, error: true }
    }
}
export async function updateExam(currentState: CurrentState, formData: ExamSchema) {
    if (!formData || !formData.id || !formData.title || !formData.lessonId || !formData.startTime || !formData.endTime) {
        console.error('Invalid form data received:', formData)
        return { success: false, error: true }
    }
    const { sessionClaims, userId } = await auth();
    const role = (sessionClaims?.metadata as { role?: "admin" | "teacher" | "student" | "parent" })?.role;
    const currentUserId = userId!;
    try {
        if (role === "teacher") {
            const teacherLessons = await prisma.lesson.findFirst({
                where: {
                    id: formData.lessonId,
                    teacherId: currentUserId
                }
            })
            if (!teacherLessons) {
                return { success: false, error: 'Teacher does not teach this lesson' }
            }
        }
        await prisma.exam.update({
            where: { id: formData.id },
            data: {
                title: formData.title,
                startTime: formData.startTime,
                endTime: formData.endTime,
                lessonId: formData.lessonId
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.error(error)
        return { success: false, error: true }
    }
}
export async function deleteExam(formData: FormData) {
    const id = formData.get("id")
    const { sessionClaims, userId } = await auth();
    const role = (sessionClaims?.metadata as { role?: "admin" | "teacher" | "student" | "parent" })?.role;
    const currentUserId = userId!;
    try {
        await prisma.exam.delete({
            where: {
                id: Number(id),
                ...(role === "teacher" ? { lesson: { teacherId: currentUserId } } : {})
            },
        })
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}
// Lesson Actions
export async function createLesson(currentState: CurrentState, formData: LessonSchema) {
    if (!formData || !formData.name) {
        console.error('Invalid form data received:', formData)
        return { success: false, error: true }
    }

    try {
        await prisma.lesson.create({
            data: {
                name: formData.name,
                day: formData.day,
                startTime: formData.startTime,
                endTime: formData.endTime,
                subjectId: formData.subjectId,
                classId: formData.classId,
                teacherId: formData.teacherId
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.error(error)
        return { success: false, error: true }
    }
}
export async function updateLesson(currentState: CurrentState, formData: LessonSchema) {
    if (!formData || !formData.id || !formData.name) {
        console.error('Invalid form data received:', formData)
        return { success: false, error: true }
    }

    try {
        await prisma.lesson.update({
            where: { id: formData.id },
            data: {
                name: formData.name,
                day: formData.day,
                startTime: formData.startTime,
                endTime: formData.endTime,
                subjectId: formData.subjectId,
                classId: formData.classId,
                teacherId: formData.teacherId
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.error(error)
        return { success: false, error: true }
    }
}
export async function deleteLesson(formData: FormData) {
    const id = formData.get("id")
    try {
        await prisma.lesson.delete({
            where: { id: Number(id) },
        })
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}