import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Attendance, Grade, Class, Parent, Prisma, Result, Student } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/Forms/FormContainer";
type Students = Student & {
    attendances: Attendance[];
    results: Result[];
    class: Class;
    grade: Grade;
    parent: Parent;
}
const getColumns = (role?: string) => [
    {
        header: "Info",
        accessor: "info",
    },
    {
        header: "Student ID",
        accessor: "studentId",
        className: "hidden md:table-cell",
    },
    {
        header: "Grade",
        accessor: "grade",
        className: "hidden md:table-cell",
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden lg:table-cell",
    },
    {
        header: "Address",
        accessor: "address",
        className: "hidden lg:table-cell",
    },
    ...(role === "admin" ? [{
        header: "Actions",
        accessor: "actions",
    }] : []),

]
const renderRow = (role?: string) => {
    const StudentRow = (student: Students) => {
        return (
            <tr key={student.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
                <td className="flex items-center gap-4 p-4">
                    <Image
                        src={student.image || "/noAvatar.png"}
                        alt={student.name}
                        width={40}
                        height={40}
                        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-xs text-gray-500">{student.class.name}</p>
                    </div>
                </td>
                <td className="hidden md:table-cell">{student.username}</td>
                <td className="hidden md:table-cell">{student.grade.level}</td>
                <td className="hidden lg:table-cell">{student.phone}</td>
                <td className="hidden lg:table-cell">{student.address}</td>
                <td>
                    <div className="flex items-center gap-2">
                        <Link href={`/list/students/${student.id}`} >
                            <button className="w-7 h-7 rounded-full bg-medaliSky flex items-center justify-center">
                                <Image src="/view.png" alt="" width={16} height={16} />
                            </button>
                        </Link>
                        {role === "admin" &&
                            <FormContainer table="students" type="delete" id={student.id} />
                        }
                    </div>
                </td>
            </tr>
        )
    };
    StudentRow.displayName = 'StudentRow';
    return StudentRow;
};
interface Props {
    searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function StudentsListPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const { sessionClaims, userId } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId!;
    const { page, ...queryparams } = resolvedParams;
    const pageNumber = page ? Number(page) : 1;
    // URL PARAMS CONDITIONS
    const query: Prisma.StudentWhereInput = {};
    if (queryparams) {
        for (const [key, value] of Object.entries(queryparams)) {
            switch (key) {
                case "teacherId":
                    query.class = {
                        lessons: {
                            some: { teacherId: value }
                        }
                    }
                    break;
                case "search":
                    query.OR = [
                        { name: { contains: value, mode: "insensitive" } },
                        { email: { contains: value, mode: "insensitive" } },
                        { username: { contains: value, mode: "insensitive" } },
                    ]
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
            query.class = {
                lessons: {
                    some: { teacherId: currentUserId }
                }
            }
            break;
        default:
            break;
    }
    const [studentsData, count] = await prisma.$transaction([
        prisma.student.findMany({
            where: query,
            include: {
                attendances: true,
                results: true,
                class: true,
                grade: true,
                parent: true,

            },
            take: ITEMS_PER_PAGE,
            skip: (pageNumber - 1) * ITEMS_PER_PAGE,
            orderBy: {
                createdAt: "desc"
            }
        }),
        prisma.student.count({
            where: query,
        }),
    ]);
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All students</h1>
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
                            <FormContainer table="students" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={getColumns(role)} renderRow={renderRow(role)} data={studentsData as Students[]} />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}