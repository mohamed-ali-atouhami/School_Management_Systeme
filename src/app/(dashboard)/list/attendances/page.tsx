import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Prisma, Student, Lesson, Attendance } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/Forms/FormContainer";

type Attendances = Attendance & {
    student: Student;
    lesson: Lesson;
}

const getColumns = (role?: string) => [
    {
        header: "Student",
        accessor: "student",
    },
    {
        header: "Lesson",
        accessor: "lesson",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden lg:table-cell",
    },
    {
        header: "Status",
        accessor: "present",
    },
    ...((role === "admin" || role === "teacher") ? [{
        header: "Actions",
        accessor: "actions",
    }] : []),
];

const renderRow = (role?: string) => {
    const AttendanceRow = (attendance: Attendances) => {
        return (
            <tr key={attendance.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
                <td className="flex items-center gap-4 p-4">
                    {attendance.student.name} {attendance.student.surname}
                </td>
                <td>{attendance.lesson.name}</td>
                <td className="hidden lg:table-cell">{new Date(attendance.date).toLocaleString("GMT", { day: "2-digit", month: "2-digit", year: "numeric" })}</td>
                <td>{attendance.present === true ? "Present" : "Absent"}</td>
                <td>
                    <div className="flex items-center gap-2">
                        {(role === "admin" || role === "teacher") &&
                            <>
                                <FormContainer table="attendances" type="edit" data={attendance} />
                                <FormContainer table="attendances" type="delete" id={attendance.id} />
                            </>
                        }
                    </div>
                </td>
            </tr>
        )
    };
    AttendanceRow.displayName = 'AttendanceRow';
    return AttendanceRow;
};
interface Props {
    searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function AttendancesListPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const { sessionClaims, userId } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId!;

    const { page, ...queryparams } = resolvedParams;
    const pageNumber = page ? Number(page) : 1;

    // URL PARAMS CONDITIONS
    const query: Prisma.AttendanceWhereInput = {};
    if (queryparams) {
        for (const [key, value] of Object.entries(queryparams)) {
            switch (key) {
                case "search":
                    query.student = {
                        OR: [
                            { name: { contains: value, mode: "insensitive" } },
                            { surname: { contains: value, mode: "insensitive" } }
                        ]
                    }
                    break;
                default:
                    break;
            }
        }
    }

    // Role conditions
    const roleConditions = {
        admin: {},
        teacher: {
            lesson: {
                teacherId: currentUserId
            }
        },
        student: {
            studentId: currentUserId
        },
        parent: {
            student: {
                parentId: currentUserId
            }
        }
    }

    // Only apply role-based filtering for non-admin roles
    if (role !== "admin") {
        query.OR = [
            roleConditions[role as keyof typeof roleConditions]
        ]
    }

    const [attendancesData, count] = await prisma.$transaction([
        prisma.attendance.findMany({
            where: query,
            include: {
                student: true,
                lesson: true,
            },
            orderBy: {
                createdAt: "desc"
            },
            take: ITEMS_PER_PAGE,
            skip: (pageNumber - 1) * ITEMS_PER_PAGE,
        }),
        prisma.attendance.count({
            where: query,
        }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All Attendances</h1>
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
                                <FormContainer table="attendances" type="create" />
                            </>
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table
                columns={getColumns(role)}
                renderRow={renderRow(role)}
                data={attendancesData as Attendances[]}
            />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}

