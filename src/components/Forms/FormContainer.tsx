import prisma from "@/lib/prisma"
import FormModal from "../FormModal"
import { auth } from "@clerk/nextjs/server"
export type FormContainerProps = {
    table: "students" | "teachers" | "parents" | "classes" | "exams" | "assignments" | "results" | "events" | "announcements" | "attendance" | "lessons" | "subjects",
    type: "create" | "edit" | "delete",
    data?: any,
    id?: number | string,
    relatedData?: any
}

export default async function FormContainer({ table, type, data, id, relatedData }: FormContainerProps) {
    const { sessionClaims, userId } = await auth();
    const role = (sessionClaims?.metadata as { role?: "admin" | "teacher" | "student" | "parent" })?.role;
    const currentUserId = userId!;

    if (type === "delete" && (table === "students" || table === "teachers") && id) {
        // Fetch student data for deletion
        const studentData = await prisma.student.findUnique({
            where: { id: String(id) },
            select: {
                image: true
            }
        });
        const teacherData = await prisma.teacher.findUnique({
            where: { id: String(id) },
            select: {
                image: true
            }
        });

        data = studentData || teacherData;
    } else if (type !== "delete") {
        switch (table) {
            case "subjects":
                const subjectsTeachers = await prisma.teacher.findMany({
                    select: {
                        id: true,
                        name: true,
                        surname: true
                    }
                })
                relatedData = {
                    teachers: subjectsTeachers
                }
                break
            case "classes":
                const classesTeachers = await prisma.teacher.findMany({
                    select: {
                        id: true,
                        name: true,
                        surname: true
                    }
                })
                const classesGrades = await prisma.grade.findMany({
                    select: {
                        id: true,
                        level: true
                    }
                })
                relatedData = {
                    teachers: classesTeachers,
                    grades: classesGrades
                }
                break
            case "teachers":
                const teachersSubjects = await prisma.subject.findMany({
                    select: {
                        id: true,
                        name: true
                    }
                })
                const teachersClasses = await prisma.class.findMany({
                    select: {
                        id: true,
                        name: true,
                    }
                })
                relatedData = {
                    subjects: teachersSubjects,
                    classes: teachersClasses
                }
                break
            case "students":
                const studentsClasses = await prisma.class.findMany({
                    include: {
                        _count: {
                            select: {
                                students: true
                            }
                        }
                    }
                })
                const studentsGrades = await prisma.grade.findMany({
                    select: {
                        id: true,
                        level: true
                    }
                })
                const studentsParents = await prisma.parent.findMany({
                    select: {
                        id: true,
                        name: true,
                        surname: true
                    }
                })
                relatedData = {
                    classes: studentsClasses,
                    grades: studentsGrades,
                    parents: studentsParents
                }
                break
            case "exams":
                const examsLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId } : {}),
                    },
                    select: {
                        id: true,
                        name: true
                    }
                })
                relatedData = {
                    lessons: examsLessons
                }
                break
            case "parents":
                const parentsStudents = await prisma.student.findMany({
                    select: {
                        id: true,
                        name: true,
                        surname: true
                    }
                })
                relatedData = {
                    students: parentsStudents
                }
                break
            case "lessons":
                const lessonsSubjects = await prisma.subject.findMany({
                    select: {
                        id: true,
                        name: true
                    }
                })
                const lessonsClasses = await prisma.class.findMany({
                    select: {
                        id: true,
                        name: true
                    }
                })
                const lessonsTeachers = await prisma.teacher.findMany({
                    select: {
                        id: true,
                        name: true,
                        surname: true
                    }
                })
                // const lessonsExams = await prisma.exam.findMany({
                //     select: {
                //         id: true,
                //         title: true
                //     }
                // })
                // const lessonsAssignments = await prisma.assignment.findMany({
                //     select: {
                //         id: true,
                //         title: true
                //     }
                // })
                // const lessonsAttendances = await prisma.attendance.findMany({
                //     select: {
                //         id: true,
                //         date: true
                //     }
                // })
                relatedData = {
                    subjects: lessonsSubjects,
                    classes: lessonsClasses,
                    teachers: lessonsTeachers
                }
                break
            case "results" : 
                const resultsStudents = await prisma.student.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId } : {})
                    },
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                    }
                });
                const resultsExams = await prisma.exam.findMany({
                    where:{
                        ...(role === "teacher" ? {lesson:{teacherId: currentUserId}} : {})

                    },
                    select:{
                        id : true,
                        title: true
                    }
                });
                const resultsAssignments = await prisma.assignment.findMany({
                    where:{
                        ...(role === "teacher" ? {lesson:{teacherId : currentUserId}} : {})
                    }
                });
                relatedData = {
                    students: resultsStudents,
                    exams : resultsExams,
                    assignments : resultsAssignments
                }
                break;
        }
    }
    return (
        <div>
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    )
}
