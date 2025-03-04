import TableSearch from "@/components/TableSearch";
import Image from "next/image";

export default function TeachersListPage() {
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
                    <button className="w-8 h-8 rounded-full bg-medaliYellow flex items-center justify-center">
                        <Image src="/plus.png" alt="" width={14} height={14} />
                    </button>
                </div>
            </div>
        </div>
        {/* list */}
        <div></div>
        {/* pagination */}
        <div></div>
    </div>
  )
}

