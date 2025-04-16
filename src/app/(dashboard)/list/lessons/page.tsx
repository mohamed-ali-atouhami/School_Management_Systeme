import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Class, Lesson,Teacher, Prisma, Subject } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/Forms/FormContainer";

type Lessons = Lesson & {
    subject: Subject;
    class: Class;
    teacher: Teacher;
}
const getColumns = (role?: string) => [
    {
        header: "Subject Name",
        accessor: "subject",
    },
    {
        header: "Class",
        accessor: "class",
        className: "hidden md:table-cell",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden md:table-cell",
    },
    ...(role === "admin" ? [{
        header: "Actions",
        accessor: "actions",
    }] : []),

]

const renderRow = (role?: string) => (lesson: Lessons) => {
    return (
        <tr key={lesson.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
            <td className="flex items-center gap-4 p-4">
                {lesson.subject.name}
            </td>
            <td className="hidden md:table-cell">{lesson.class.name}</td>
            <td className="hidden md:table-cell">{lesson.teacher.name} {lesson.teacher.surname}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" && 
                    <>
                        <FormContainer table="lessons" type="edit" data={lesson} />
                        <FormContainer table="lessons" type="delete" id={lesson.id} />
                    </>
                    }
                </div>
            </td>
        </tr>
    )
}

export default async function LessonsListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { sessionClaims ,userId} = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId!;
    const { page, ...queryparams } = searchParams;
    const pageNumber = page ? Number(page) : 1;
    // URL PARAMS CONDITIONS
    const query: Prisma.LessonWhereInput = {};
    if (queryparams) {
        for (const [key, value] of Object.entries(queryparams)) {
            switch (key) {
                case "classId":
                    query.classId = Number(value);
                    break;
                case "teacherId":
                    query.teacherId = value;
                    break;
                case "search":
                    query.subject = { name: { contains: value, mode: "insensitive" } }
                    break;
                default:
                    break;
            }
        }
    }
    //Role conditions
    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.teacherId = currentUserId;
            break;
            query.class = { 
                students: {
                    some: {
                        parentId: currentUserId
                    }
                }
            };
            break;
        default:
            break;
    }
    const [lessonsData, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: query,
            include: {
                subject: {select: {name: true}},
                class: {select: {name: true}},
                teacher: {select: {name: true, surname: true}},
            },
            orderBy: {
                createdAt: "desc"
            },
            take: ITEMS_PER_PAGE,
            skip: (pageNumber - 1) * ITEMS_PER_PAGE,
        }),
        prisma.lesson.count({
            where: query,
        }),
    ]);
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 rounded-full bg-medaliYellow flex items-center justify-center p-2">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-medaliYellow flex items-center justify-center">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" && 
                        <>
                            <FormContainer table="lessons" type="create" />
                        </>
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={getColumns(role)} renderRow={renderRow(role)} data={lessonsData} />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}

