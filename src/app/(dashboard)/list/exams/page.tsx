import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role, examsData } from "@/lib/data";
import FormModal from "@/components/FormModal";

type Exams = {
    id: number;
    subject: string;
    class: string;
    teacher: string;
    date: string;
}
const Columns = [
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
        header: "Date",
        accessor: "date",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },

]
export default function ExamsListPage() {
    const renderRow = (exam: Exams) => {
        return (
            <tr key={exam.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
                <td className="flex items-center gap-4 p-4">
                    {exam.subject}
                </td>
                <td>{exam.class}</td>
                <td className="hidden md:table-cell">{exam.teacher}</td>
                <td className="hidden md:table-cell">{exam.date}</td>
                <td>
                    <div className="flex items-center gap-2">
                        {role === "admin" && 
                        <>
                            <FormModal table="exams" type="edit" data={exam} />
                            <FormModal table="exams" type="delete" id={exam.id} />
                        </>
                        }
                    </div>
                </td>
            </tr>
        )
    }
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex justify-between items-center">
                <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
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
                            <FormModal table="exams" type="create" />
                        </>
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={Columns} renderRow={renderRow} data={examsData} />
            {/* pagination */}
            <Pagination />
        </div>
    )
}

