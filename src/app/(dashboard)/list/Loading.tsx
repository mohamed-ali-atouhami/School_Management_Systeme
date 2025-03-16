import { Loader } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-10 h-10 flex flex-col items-center justify-center gap-2 animate-pulse">
                <Loader className="w-8 h-8 animate-spin" />
                <span className="text-black">Loading...</span>
            </div>
        </div>
    )
}
