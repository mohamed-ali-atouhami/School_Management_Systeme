"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function TableSearch() {
    const router = useRouter();
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(window.location.search);
        params.set('search', e.target.value);
        router.push(`${window.location.pathname}?${params.toString()}`);
    }
    return (
        <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <Image src="/search.png" alt="search" width={14} height={14} />
            <input type="text" placeholder="Search..." className="w-full p-2 bg-transparent outline-none" onChange={handleSearch}/>
        </div>
    );
}
