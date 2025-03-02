"use client"

import Image from "next/image"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const chartData = [
    { month: "Jan", income: 80, expense: 150 },
    { month: "Feb", income: 200, expense: 50 },
    { month: "Mar", income: 120, expense: 60 },
    { month: "Apr", income: 190, expense: 85 },
    { month: "May", income: 130, expense: 65 },
    { month: "Jun", income: 140, expense: 70 },
    { month: "Jul", income: 200, expense: 140 },
    { month: "Aug", income: 100, expense: 50 },
    { month: "Sep", income: 300, expense: 30 },
    { month: "Oct", income: 90, expense: 45 },
    { month: "Nov", income: 20, expense: 5 },
    { month: "Dec", income: 220, expense: 110 },
]


export function FinanceChart() {
    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Finance</h1>
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
                            dataKey="income"
                            type="monotone"
                            stroke="#C3EBFA"
                            strokeWidth={4}
                            dot={false}
                        />
                        <Line
                            dataKey="expense"
                            type="monotone"
                            stroke="#CFCEFF"
                            strokeWidth={4}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}
