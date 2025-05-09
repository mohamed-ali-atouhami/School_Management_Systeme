import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Prisma, Subject, Teacher } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/Forms/FormContainer";
type Subjects = Subject & {
    teachers: Teacher[];
}
const getColumns = (role?: string) => [
    {
        header: "Subject Name",
        accessor: "name",
    },
    {
        header: "Teachers",
        accessor: "teachers",
        className: "hidden md:table-cell",
    },
    ...(role === "admin" ? [{
        header: "Actions",
        accessor: "actions",
    }] : []),
]

getColumns.displayName = 'getColumns';

const renderRow = (role?: string) => {
    const SubjectRow = (subject: Subjects) => {
        return (
            <tr key={subject.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
                <td className="flex items-center gap-4 p-4">
                    {subject.name}
                </td>
                <td className="hidden md:table-cell">{subject.teachers.map(teacher => teacher.name).join(", ")}</td>
                <td>
                    <div className="flex items-center gap-2">
                        {role === "admin" &&
                            <>
                                <FormContainer table="subjects" type="edit" data={subject} />
                                <FormContainer table="subjects" type="delete" id={subject.id} />
                            </>
                        }
                    </div>
                </td>
            </tr>
        )
    };
    SubjectRow.displayName = 'SubjectRow';
    return SubjectRow;
};
interface Props {
    searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function SubjectsListPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const { page, ...queryparams } = resolvedParams;
    const pageNumber = page ? Number(page) : 1;
    // URL PARAMS CONDITIONS
    const query: Prisma.SubjectWhereInput = {};
    if (queryparams) {
        for (const [key, value] of Object.entries(queryparams)) {
            switch (key) {
                case "search":
                    query.name = { contains: value, mode: "insensitive" }
                    break;
                default:
                    break;
            }
        }
    }
    const [subjectsData, count] = await prisma.$transaction([
        prisma.subject.findMany({
            where: query,
            include: {
                teachers: true,
            },
            take: ITEMS_PER_PAGE,
            skip: (pageNumber - 1) * ITEMS_PER_PAGE,
            orderBy: {
                //name: "desc",
                createdAt: "desc",
            },
        }),
        prisma.subject.count({
            where: query,
        }),
    ]);
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
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
                                <FormContainer table="subjects" type="create" />
                            </>
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={getColumns(role)} renderRow={renderRow(role)} data={subjectsData as Subjects[]} />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}