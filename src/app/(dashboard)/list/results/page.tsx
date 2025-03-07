import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role, resultsData } from "@/lib/data";
import FormModal from "@/components/FormModal";

type Results = {
    id: number;
    subject: string;
    class: string;
    teacher: string;
    student: string;
    date: string;
    type: "exam" | "assignment";
    score: number;
}
const Columns = [
    {
        header: "Subject",
        accessor: "subject",
    },
    {
        header: "Student",
        accessor: "student",
    },
    {
        header: "Score",
        accessor: "score",
        className: "hidden lg:table-cell",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden md:table-cell",
    },
    {
        header: "Class",
        accessor: "class",
        className: "hidden md:table-cell",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden lg:table-cell",
    },
    {
        header: "Type",
        accessor: "type",
        className: "hidden lg:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },

]
export default function ResultsListPage() {
    const renderRow = (result: Results) => {
        return (
            <tr key={result.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-medaliPurpleLight">
                <td className="flex items-center gap-4 p-4">
                    {result.subject}
                </td>
                <td >{result.student}</td>
                <td className="hidden lg:table-cell">{result.score}</td>
                <td className="hidden md:table-cell">{result.teacher}</td>
                <td className="hidden md:table-cell">{result.class}</td>
                <td className="hidden lg:table-cell">{result.date}</td>
                <td className="hidden lg:table-cell">{result.type}</td>
                <td>
                    <div className="flex items-center gap-2">
                        {role === "admin" && 
                        <>
                            <FormModal table="results" type="edit" data={result} />
                            <FormModal table="results" type="delete" id={result.id} />
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
                <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
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
                            <FormModal table="results" type="create" />
                        </>
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={Columns} renderRow={renderRow} data={resultsData} />
            {/* pagination */}
            <Pagination />
        </div>
    )
}

