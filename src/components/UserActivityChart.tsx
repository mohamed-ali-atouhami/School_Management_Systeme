"use client"

import Image from "next/image"
import { CartesianGrid, Legend, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getUserLoginStatistics } from "@/lib/Actions"
import { useEffect, useState } from "react"

interface ChartData {
    month: string
    year: number
    signInCount: number
    activeCount: number
}

export function UserActivityChart() {
    const [chartData, setChartData] = useState<ChartData[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const result = await getUserLoginStatistics()
            if (result.success && result.data) {
                setChartData(result.data)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">User Activity</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className="w-full h-[90%]">
                <ResponsiveContainer>
                    <BarChart
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#d1d5db" }}
                            tickMargin={10}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#d1d5db" }}
                            tickMargin={20}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: "10px", 
                                borderColor: "#d1d5db",
                                backgroundColor: "white"
                            }} 
                        />
                        <Legend 
                            align="center" 
                            verticalAlign="top" 
                            wrapperStyle={{ 
                                paddingTop: "10px", 
                                paddingBottom: "30px" 
                            }}
                            iconType="circle"
                        />
                        <Bar
                            dataKey="signInCount"
                            name="Sign-ins"
                            fill="#C3EBFA"
                            radius={[10, 10, 0, 0]}
                        />
                        <Bar
                            dataKey="activeCount"
                            name="Active Sessions"
                            fill="#CFCEFF"
                            radius={[10, 10, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
