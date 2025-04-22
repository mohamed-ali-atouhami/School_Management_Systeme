"use client"

import Image from "next/image"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getUserLoginStatistics } from "@/lib/Actions"
import { useEffect, useState } from "react"

interface ChartData {
    month: string
    year: number
    loginCount: number
}

export function FinanceChart() {
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
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
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
                        <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "#d1d5db" }} />

                        <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }} />
                        <Line
                            dataKey="loginCount"
                            name="Logins"
                            type="monotone"
                            stroke="#C3EBFA"
                            strokeWidth={4}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
