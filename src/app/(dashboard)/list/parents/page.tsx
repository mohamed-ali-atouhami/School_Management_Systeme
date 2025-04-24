import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Parent, Prisma, Student } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/Forms/FormContainer";
type Parents = Parent & {
    students: Student[];
}
const getColumns = (role?: string) => [
    {
        header: "Info",
        accessor: "info",
    },
    {
        header: "Student Name",
        accessor: "students",
        className: "hidden md:table-cell",
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden md:table-cell",
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
    const ParentRow = (parent: Parents) => {
        return (
            <tr key={parent.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
                <td className="flex items-center gap-4 p-4">
                    <div className="flex flex-col">
                        <h3 className="font-semibold">{parent.name}</h3>
                        <p className="text-xs text-gray-500">{parent.email}</p>
                    </div>
                </td>
                <td className="hidden md:table-cell">{parent.students.map(student => student.name).join(", ")}</td>
                <td className="hidden md:table-cell">{parent.phone}</td>
                <td className="hidden lg:table-cell">{parent.address}</td>
                <td>
                    <div className="flex items-center gap-2">
                        {role === "admin" &&
                            <>
                                <FormContainer table="parents" type="edit" data={parent} />
                                <FormContainer table="parents" type="delete" id={parent.id} />
                            </>
                        }
                    </div>
                </td>
            </tr>
        )
    };
    ParentRow.displayName = 'ParentRow';
    return ParentRow;
};
interface Props {
    searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function ParentsListPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const { page, ...queryparams } = resolvedParams;
    const pageNumber = page ? Number(page) : 1;
    // URL PARAMS CONDITIONS
    const query: Prisma.ParentWhereInput = {};
    if (queryparams) {
        for (const [key, value] of Object.entries(queryparams)) {
            switch (key) {
                case "search":
                    query.OR = [
                        { name: { contains: value, mode: "insensitive" } },
                        { email: { contains: value, mode: "insensitive" } },
                    ]
                    break;
                default:
                    break;
            }
        }
    }
    const [parentsData, count] = await prisma.$transaction([
        prisma.parent.findMany({
            where: query,
            include: {
                students: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: ITEMS_PER_PAGE,
            skip: (pageNumber - 1) * ITEMS_PER_PAGE,
        }),
        prisma.parent.count({
            where: query,
        }),
    ]);
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
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
                            <FormContainer table="parents" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={getColumns(role)} renderRow={renderRow(role)} data={parentsData as Parents[]} />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}

