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
    if(type !== "delete") {
        switch(table) {
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
                relatedData = {
                    subjects: teachersSubjects
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
