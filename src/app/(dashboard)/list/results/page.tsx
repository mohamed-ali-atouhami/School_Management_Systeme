import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { role } from "@/lib/data";
import FormModal from "@/components/FormModal";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Prisma} from "@prisma/client";
import prisma from "@/lib/prisma";

type Results = {
    id:number,
    title:string,
    studentName:string,
    studentSurName:string,
    teacherName:string,
    teacherSurName:string,
    score:number,
    className:string,
    startTime:Date,
    type:string,
}
const Columns = [
    {
        header: "Title",
        accessor: "title",
    },
    {
        header: "Student",
        accessor: "student",
    },
    {
        header: "Score",
        accessor: "score",
        className: "hidden lg:table-cell",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden md:table-cell",
    },
    {
        header: "Class",
        accessor: "class",
        className: "hidden md:table-cell",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden lg:table-cell",
    },
    {
        header: "Type",
        accessor: "type",
        className: "hidden lg:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },

]
const renderRow = (result: Results) => {
    return (
        <tr key={result.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
            <td className="flex items-center gap-4 p-4">
                {result.title}
            </td>
            <td >{result.studentName} {result.studentSurName}</td>
            <td className="hidden lg:table-cell">{result.score}</td>
            <td className="hidden md:table-cell">{result.teacherName} {result.teacherSurName}</td>
            <td className="hidden md:table-cell">{result.className}</td>
            <td className="hidden lg:table-cell">{new Intl.DateTimeFormat("GMT").format(result.startTime)}</td>
            <td className="hidden lg:table-cell">{result.type}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" && 
                    <>
                        <FormModal table="results" type="edit" data={result} />
                        <FormModal table="results" type="delete" id={result.id} />
                    </>
                    }
                </div>
            </td>
        </tr>
    )
}

export default async function ResultsListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { page, ...queryparams } = searchParams;
    const pageNumber = page ? Number(page) : 1;
    // URL PARAMS CONDITIONS
    const query: Prisma.ResultWhereInput = {};
    if (queryparams) {
        for (const [key, value] of Object.entries(queryparams)) {
            switch (key) {
                case "studentId":
                    query.studentId = value
                    break;
                case "search":
                    query.OR=[
                        {student: {name: {contains: value, mode: "insensitive"}}},
                        {student: {surname: {contains: value, mode: "insensitive"}}},
                        {exam: {title: {contains: value, mode: "insensitive"}}},
                        {assignment: {title: {contains: value, mode: "insensitive"}}},
                    ]
                    break;
                default:
                    break;
            }
        }
    }
    const [resultsData, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: query,
            include: {
                student: {
                    select: {
                        name: true,
                        surname: true,   
                    },
                },
                exam: {
                    include: {
                        lesson: {
                            include: {
                                teacher: {select: {name: true, surname: true}},
                                class: {select: {name: true}},
                            },
                        },
                    },
                },
                assignment: {
                    include: {
                        lesson: {
                            include: {
                                teacher: {select: {name: true, surname: true}},
                                class: {select: {name: true}},
                            },
                        },
                    },
                },
            },
            take: ITEMS_PER_PAGE,
            skip: (pageNumber - 1) * ITEMS_PER_PAGE,
        }),
        prisma.result.count({
            where: query,
        }),
    ]);
    const data = resultsData.map(item =>{
        const assesment =  item.exam || item.assignment
        if(!assesment) return null
        const isExam = "startTime" in assesment
        return {
            id:item.id,
            title:assesment.title,
            studentName:item.student.name,
            studentSurName:item.student.surname,
            teacherName:assesment.lesson.teacher.name,
            teacherSurName:assesment.lesson.teacher.surname,
            className:assesment.lesson.class.name,
            date:isExam ? assesment.startTime : assesment.startDate,
            type:isExam ? "Exam" : "Assignment",
            score:item.score,
            
        }
    })
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
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
                            <FormModal table="results" type="create" />
                        </>
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={Columns} renderRow={renderRow} data={data} />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}

