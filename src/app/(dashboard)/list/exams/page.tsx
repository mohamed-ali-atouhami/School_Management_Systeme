import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Lesson, Exam, Prisma, Subject, Class, Teacher } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/Forms/FormContainer";
type Exams = Exam & {
    lesson: Lesson & {
        subject: Subject;
        class: Class;
        teacher: Teacher;
    };
}
const getColumns = (role?: string) => [
    {
        header: "Subject",
        accessor: "subject",
    },
    {
        header: "Class",
        accessor: "class",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden md:table-cell",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher" ? [{
        header: "Actions",
        accessor: "actions",
    }] : []),

]
const renderRow = (role?: string) => {
    const ExamRow = (exam: Exams) => {
        return (
            <tr key={exam.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
                <td className="flex items-center gap-4 p-4">
                    {exam.lesson.subject.name}
                </td>
                <td>{exam.lesson.class.name}</td>
                <td className="hidden md:table-cell">{exam.lesson.teacher.name} {exam.lesson.teacher.surname}</td>
                <td className="hidden md:table-cell">
                    {new Date(exam.startTime).toLocaleDateString('GMT', { day: '2-digit', month: '2-digit', year: 'numeric' })} {' '}
                    {new Date(exam.startTime).toLocaleTimeString('GMT', { hour: '2-digit', minute: '2-digit', hour12: false })} - {new Date(exam.endTime).toLocaleTimeString('GMT', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </td>
                <td>
                    <div className="flex items-center gap-2">
                        {(role === "admin" || role === "teacher") &&
                            <>
                                <FormContainer table="exams" type="edit" data={exam} />
                                <FormContainer table="exams" type="delete" id={exam.id} />
                            </>
                        }
                    </div>
                </td>
            </tr>
        )
    };
    ExamRow.displayName = 'ExamRow';
    return ExamRow;
};
interface Props {
    searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function ExamsListPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const { sessionClaims, userId } = await auth();
    const role = (sessionClaims?.metadata as { role?: "admin" | "teacher" | "student" | "parent" })?.role;
    const currentUserId = userId!;
    const { page, ...queryparams } = resolvedParams;
    const pageNumber = page ? Number(page) : 1;
    // URL PARAMS CONDITIONS
    const query: Prisma.ExamWhereInput = {};
    query.lesson = {};
    if (queryparams) {
        for (const [key, value] of Object.entries(queryparams)) {
            switch (key) {
                case "classId":
                    query.lesson.classId = Number(value);
                    break;
                case "teacherId":
                    query.lesson.teacherId = value;
                    break;
                case "search":
                    query.lesson.subject = { name: { contains: value, mode: "insensitive" } }
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
            query.lesson.teacherId = currentUserId;
            break;
        case "student":
            query.lesson.class = {
                students: {
                    some: {
                        id: currentUserId
                    }
                }
            };
            break;
        case "parent":
            query.lesson.class = {
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
    const [examsData, count] = await prisma.$transaction([
        prisma.exam.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        class: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: ITEMS_PER_PAGE,
            skip: (pageNumber - 1) * ITEMS_PER_PAGE,
        }),
        prisma.exam.count({
            where: query,
        }),
    ]);
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 rounded-full bg-medaliYellow flex items-center justify-center p-2">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-medaliYellow flex items-center justify-center">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {(role === "admin" || role === "teacher") &&
                            <>
                                <FormContainer table="exams" type="create" />
                            </>
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={getColumns(role)} renderRow={renderRow(role)} data={examsData as Exams[]} />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}