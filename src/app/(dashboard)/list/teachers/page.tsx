import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role } from "@/lib/data";
import FormModal from "@/components/FormModal";
import { Teacher, Subject, Class, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";

type Teachers = Teacher & {
    subjects: Subject[];
    classes: Class[];
}
const Columns = [
    {
        header: "Info",
        accessor: "info",
    },
    {
        header: "Teacher ID",
        accessor: "teacherId",
        className: "hidden md:table-cell",
    },
    {
        header: "Subjects",
        accessor: "subjects",
        className: "hidden md:table-cell",
    },
    {
        header: "Classes",
        accessor: "classes",
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
    {
        header: "Actions",
        accessor: "actions",
    },

]


const renderRow = (teacher: Teachers) => {
    return (
        <tr key={teacher.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
            <td className="flex items-center gap-4 p-4">
                <Image
                    src={teacher.image || "/noAvatar.png"}
                    alt={teacher.name}
                    width={40}
                    height={40}
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold">{teacher.name}</h3>
                    <p className="text-xs text-gray-500">{teacher.email}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{teacher.username}</td>
            <td className="hidden md:table-cell">{teacher.subjects.map(subject => subject.name).join(", ")}</td>
            <td className="hidden md:table-cell">{teacher.classes.map(cls => cls.name).join(", ")}</td>
            <td className="hidden lg:table-cell">{teacher.phone}</td>
            <td className="hidden lg:table-cell">{teacher.address}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/list/teachers/${teacher.id}`} >
                        <button className="w-7 h-7 rounded-full bg-medaliSky flex items-center justify-center">
                            <Image src="/view.png" alt="" width={16} height={16} />
                        </button>
                    </Link>
                    {role === "admin" &&
                        <FormModal table="teachers" type="delete" id={teacher.id} />
                    }
                </div>
            </td>
        </tr>
    )
}

export default async function TeachersListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { page, ...queryparams } = searchParams;
    const pageNumber = page ? Number(page) : 1;
    // URL PARAMS CONDITIONS
    const query: Prisma.TeacherWhereInput = {};
    if (queryparams) {
        for (const [key, value] of Object.entries(queryparams)) {
            switch (key) {
                case "classId":
                    query.lessons = {
                        some: { classId: Number(value) }
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
    const [teachersData, count] = await prisma.$transaction([
        prisma.teacher.findMany({
            where: query,
            include: {
                subjects: true,
                classes: true,
            },
            take: ITEMS_PER_PAGE,
            skip: (pageNumber - 1) * ITEMS_PER_PAGE,
        }),
        prisma.teacher.count({
            where: query,
        }),
    ]);
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All teachers</h1>
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
                            <FormModal table="teachers" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={Columns} renderRow={renderRow} data={teachersData} />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}

