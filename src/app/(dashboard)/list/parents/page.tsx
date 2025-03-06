import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role, parentsData } from "@/lib/data";

type Parents = {
    id: number;
    name: string;
    students: string[];
    email?: string;
    phone: string;
    address: string;
}
const Columns = [
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
    {
        header: "Actions",
        accessor: "actions",
    },

]
export default function ParentsListPage() {
    const renderRow = (parent: Parents) => {
        return (
            <tr key={parent.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
                <td className="flex items-center gap-4 p-4">
                    <div className="flex flex-col">
                        <h3 className="font-semibold">{parent.name}</h3>
                        <p className="text-xs text-gray-500">{parent.email}</p>
                    </div>
                </td>
                <td className="hidden md:table-cell">{parent.students.join(", ")}</td>
                <td className="hidden md:table-cell">{parent.phone}</td>
                <td className="hidden lg:table-cell">{parent.address}</td>
                <td>
                    <div className="flex items-center gap-2">
                        <Link href={`/list/parents/${parent.id}`} >
                            <button className="w-7 h-7 rounded-full bg-medaliSky flex items-center justify-center">
                                <Image src="/edit.png" alt="" width={16} height={16} />
                            </button>
                        </Link>
                        {role === "admin" && <button className="w-7 h-7 rounded-full bg-medaliPurple flex items-center justify-center">
                            <Image src="/delete.png" alt="" width={16} height={16} />
                        </button>}
                    </div>
                </td>
            </tr>
        )
    }
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
                        {role === "admin" && <button className="w-8 h-8 rounded-full bg-medaliYellow flex items-center justify-center">
                            <Image src="/plus.png" alt="" width={14} height={14} />
                        </button>}
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={Columns} renderRow={renderRow} data={parentsData} />
            {/* pagination */}
            <Pagination />
        </div>
    )
}

