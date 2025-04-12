import prisma from "@/lib/prisma"
import FormModal from "../FormModal"

export type FormContainerProps = {
    table: "students" | "teachers" | "parents" | "classes" | "exams" | "assignments" | "results" | "events" | "announcements" | "attendance" | "lessons" | "subjects",
    type: "create" | "edit" | "delete",
    data?: any,
    id?: number | string,
    relatedData?: any
}

export default async function FormContainer({ table, type, data, id, relatedData }: FormContainerProps) {
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
                    select: {
                        id: true,
                        name: true
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
        }
    }
    return (
        <div>
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    )
}
