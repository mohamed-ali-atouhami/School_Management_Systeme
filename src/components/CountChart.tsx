"use client"
import { RadialBar, RadialBarChart ,ResponsiveContainer} from "recharts"
import Image from "next/image"


export function CountChart({boys, girls}: {boys: number, girls: number}) {
    const chartData = [
        { name: "Total", count: boys + girls, fill: "white" },
        { name: "Girls", count: girls, fill: "#FAE27C" },
        { name: "Boys", count: boys, fill: "#C3EBFA" },
    ]
    return (
        <div className="relative w-full h-[75%]">
            <ResponsiveContainer>
                <RadialBarChart data={chartData} innerRadius={40} outerRadius={100}>
                    <RadialBar dataKey="count" background />
                </RadialBarChart>
            </ResponsiveContainer>
            <Image src="/maleFemale.png" alt="" width={50} height={50} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
    )
}
