import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { role } from "@/lib/data";
import FormModal from "@/components/FormModal";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Lesson, Exam, Prisma, Subject, Class, Teacher } from "@prisma/client";

type Exams = Exam & {
    lesson: Lesson & {
        subject: Subject;
        class: Class;
        teacher: Teacher;
    };
}
const Columns = [
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
    {
        header: "Actions",
        accessor: "actions",
    },

]
const renderRow = (exam: Exams) => {
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
                    {role === "admin" && 
                    <>
                        <FormModal table="exams" type="edit" data={exam} />
                        <FormModal table="exams" type="delete" id={exam.id} />
                    </>
                    }
                </div>
            </td>
        </tr>
    )
}

export default async function ExamsListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { page, ...queryparams } = searchParams;
    const pageNumber = page ? Number(page) : 1;
    // URL PARAMS CONDITIONS
    const query: Prisma.ExamWhereInput = {};
    if (queryparams) {
        for (const [key, value] of Object.entries(queryparams)) {
            switch (key) {
                case "classId":
                    query.lesson = {
                        classId: Number(value),
                    }
                    break;
                case "teacherId":
                    query.lesson = {
                        teacherId: value,
                    }
                    break;
                case "search":
                    query.lesson = {
                        subject: { name: { contains: value, mode: "insensitive" } }
                    }
                    break;
                default:
                    break;
            }
        }
    }
    const [examsData, count] = await prisma.$transaction([
        prisma.exam.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: {select: {name: true}},
                        class: {select: {name: true}},
                        teacher: {select: {name: true ,surname: true}},
                    },
                },
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
                        {role === "admin" && 
                        <>
                            <FormModal table="exams" type="create" />
                        </>
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={Columns} renderRow={renderRow} data={examsData} />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}

