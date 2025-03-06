export default function Pagination() {
    return (
        <div className="flex items-center justify-between text-gray-500 p-4">
            <button disabled className="bg-slate-200 rounded-md py-2 px-4 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
            <div className="flex items-center gap-2 text-sm">
                <button className="bg-medaliSky rounded-sm px-2">1</button>
                <button className="rounded-md px-2">2</button>
                <button className="rounded-md px-2">3</button>
                ...
                <button className="rounded-md px-2">10</button>
            </div>
            <button className="bg-slate-200 rounded-md py-2 px-4 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>
    );
}
