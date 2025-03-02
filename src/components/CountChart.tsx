"use client"
import { RadialBar, RadialBarChart ,ResponsiveContainer} from "recharts"
import Image from "next/image"

const chartData = [
    { name: "Total", count: 106, fill: "white" },
    { name: "Girls", count: 53, fill: "#FAE27C" },
    { name: "Boys", count: 53, fill: "#C3EBFA" },
]

export function CountChart() {
    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            {/*Title*/}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Students</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            {/*Chart*/}
            <div className="relative w-full h-[75%]">
                <ResponsiveContainer>
                    <RadialBarChart data={chartData} innerRadius={40} outerRadius={100}>
                        <RadialBar dataKey="count" background />
                    </RadialBarChart>
                </ResponsiveContainer>
                <Image src="/maleFemale.png" alt="" width={50} height={50} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            {/*Bottom*/}
            <div className="flex justify-center gap-16">
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-medaliSky rounded-full"></div>
                    <h1 className="font-bold">1,234</h1>
                    <p className="text-xs text-gray-300">Boys (55%)</p>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-medaliYellow rounded-full"></div>
                    <h1 className="font-bold">1,234</h1>
                    <p className="text-xs text-gray-300">Girls (45%)</p>
                </div>
            </div>
        </div>
    )
}
