import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Class, Announcement, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/Forms/FormContainer";
type Announcements = Announcement & {
    class: Class;
}

const getColumns = (role?: string) => [
    {
        header: "Title",
        accessor: "title",
    },
    {
        header: "Class",
        accessor: "class",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden lg:table-cell",
    },
    ...(role === "admin" ? [{
        header: "Actions",
        accessor: "actions",
    }] : []),
];

const renderRow = (role?: string) => (announcement: Announcements) => {
    return (
        <tr key={announcement.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
            <td className="flex items-center gap-4 p-4">
                {announcement.title}
            </td>
            <td>{announcement.class?.name || "-"}</td>
            <td className="hidden lg:table-cell">{new Date(announcement.date).toLocaleString("GMT", { day: "2-digit", month: "2-digit", year: "numeric" })}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" &&
                        <>
                            <FormContainer table="announcements" type="edit" data={announcement} />
                            <FormContainer table="announcements" type="delete" id={announcement.id} />
                        </>
                    }
                </div>
            </td>
        </tr>
    )
};

export default async function AnnouncementsListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { sessionClaims ,userId} = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId!;

    const { page, ...queryparams } = searchParams;
    const pageNumber = page ? Number(page) : 1;
    // URL PARAMS CONDITIONS
    const query: Prisma.AnnouncementWhereInput = {};
    if (queryparams) {
        for (const [key, value] of Object.entries(queryparams)) {
            switch (key) {
                case "search":
                    query.title = {
                        contains: value,
                        mode: "insensitive"
                    }
                    break;
                default:
                    break;
            }
        }
    }
    //Role conditions
    const roleConditions = {
        admin: {},
        teacher: {
            class: {
                lessons: {
                    some: {
                        teacherId: currentUserId
                    }
                }
            }
        },
        student: {
            class: {
                students: {
                    some: {
                        id: currentUserId
                    }
                }
            }
        },
        parent: {
            class: {
                students: {
                    some: {
                        parentId: currentUserId
                    }
                }
            }
        }
    }
    // Only apply role-based filtering for non-admin roles
    if (role !== "admin") {
    query.OR = [
        {
            classId: null
        },
            roleConditions[role as keyof typeof roleConditions]
        ]
    }
    const [announcementsData, count] = await prisma.$transaction([
        prisma.announcement.findMany({
            where: query,
            include: {
                class: { select: { name: true } },
            },
            orderBy: {
                createdAt: "desc"
            },
            take: ITEMS_PER_PAGE,
            skip: (pageNumber - 1) * ITEMS_PER_PAGE,
        }),
        prisma.announcement.count({
            where: query,
        }),
    ]);
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All Announcements</h1>
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
                                <FormContainer table="announcements" type="create" />
                            </>
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table
                columns={getColumns(role)}
                renderRow={renderRow(role)}
                data={announcementsData}
            />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}

