import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import FormModal from "@/components/FormModal";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Assignment, Lesson, Prisma, Subject, Class, Teacher } from "@prisma/client";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type Assignments = Assignment & {
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
        header: "Due Date",
        accessor: "dueDate",
        className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher" ? [{
        header: "Actions",
        accessor: "actions",
    }] : []),

]
const renderRow = (role?: string) => (assignment: Assignments) => {
    return (
        <tr key={assignment.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
            <td className="flex items-center gap-4 p-4">
                {assignment.lesson.subject.name}
            </td>
            <td>{assignment.lesson.class.name}</td>
            <td className="hidden md:table-cell">{assignment.lesson.teacher.name} {assignment.lesson.teacher.surname}</td>
            <td className="hidden md:table-cell">{new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" || role === "teacher" &&
                    <>
                        <FormModal table="assignments" type="edit" data={assignment} />
                        <FormModal table="assignments" type="delete" id={assignment.id} />
                    </>
                    }
                </div>
            </td>
        </tr>
    )
}

export default async function AssignmentsListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { sessionClaims ,userId} = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId!;
    const { page, ...queryparams } = searchParams;
    const pageNumber = page ? Number(page) : 1;
    // URL PARAMS CONDITIONS
    const query: Prisma.AssignmentWhereInput = {};
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
                        id: currentUserId,
                    },
                },
            };
            break;
        case "parent":
            query.lesson.class = {
                students: {
                    some: {
                        parentId: currentUserId,
                    },
                },
            };
            break;
        default:
            break;
    }
    const [assignmentsData, count] = await prisma.$transaction([
        prisma.assignment.findMany({
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
        prisma.assignment.count({
            where: query,
        }),
    ]);
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 rounded-full bg-medaliYellow flex items-center justify-center p-2">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-medaliYellow flex items-center justify-center">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" || role === "teacher" &&
                        <>
                            <FormModal table="assignments" type="create" />
                        </>
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={getColumns(role)} renderRow={renderRow(role)} data={assignmentsData} />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}

