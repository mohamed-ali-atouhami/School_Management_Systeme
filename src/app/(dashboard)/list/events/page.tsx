import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { role } from "@/lib/data";
import FormModal from "@/components/FormModal";
import { Class, Event, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";

type Events = Event & {
    class: Class;
}
const Columns = [
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
    {
        header: "Start Time",
        accessor: "startTime",
        className: "hidden md:table-cell",
    },
    {
        header: "End Time",
        accessor: "endTime",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },


]
const renderRow = (event: Events) => {
    return (
        <tr key={event.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
            <td className="flex items-center gap-4 p-4">
                {event.title}
            </td>
            <td >{event.class.name}</td>
            <td className="hidden lg:table-cell">{new Intl.DateTimeFormat("GMT").format(event.startTime)}</td>
            <td className="hidden lg:table-cell">{new Date(event.startTime).toLocaleString("GMT",{hour: "2-digit", minute: "2-digit" , hour12: false})}</td>
            <td className="hidden md:table-cell">{new Date(event.endTime).toLocaleString("GMT",{hour: "2-digit", minute: "2-digit" , hour12: false})}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" && 
                    <>
                        <FormModal table="events" type="edit" data={event} />
                        <FormModal table="events" type="delete" id={event.id} />
                    </>
                    }
                </div>
            </td>
        </tr>
    )
}

export default async function EventsListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { page, ...queryparams } = searchParams;
    const pageNumber = page ? Number(page) : 1;
    // URL PARAMS CONDITIONS
    const query: Prisma.EventWhereInput = {};
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
    const [eventsData, count] = await prisma.$transaction([
        prisma.event.findMany({
            where: query,
            include: {
                class: {select: {name: true}},
            },
            take: ITEMS_PER_PAGE,
            skip: (pageNumber - 1) * ITEMS_PER_PAGE,
        }),
        prisma.event.count({
            where: query,
        }),
    ]);
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
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
                            <FormModal table="events" type="create" />
                        </>
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={Columns} renderRow={renderRow} data={eventsData} />
            {/* pagination */}
            <Pagination page={pageNumber} totalCount={count} />
        </div>
    )
}

