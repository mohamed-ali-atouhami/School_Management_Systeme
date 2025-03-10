"use client";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";
export default function Pagination({page, totalCount}: {page: number, totalCount: number}) {
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const router = useRouter();
    const handlePageClick = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set('page', page.toString());
        router.push(`${window.location.pathname}?${params.toString()}`);
    }
    return (
        <div className="flex items-center justify-between text-gray-500 p-4">
            <button disabled={page === 1} className="bg-slate-200 rounded-md py-2 px-4 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handlePageClick(page - 1)}>Prev</button>
            <div className="flex items-center gap-2 text-sm">
                {Array.from(
                    {length: totalPages},
                    (_, i) => (
                    <button key={i} className={`rounded-sm px-2 ${page === i + 1 ? 'bg-medaliSky' : 'bg-slate-50'}`} onClick={() => handlePageClick(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>
            <button disabled={page === totalPages} className="bg-slate-200 rounded-md py-2 px-4 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handlePageClick(page + 1)}>Next</button>
        </div>
    );
}
