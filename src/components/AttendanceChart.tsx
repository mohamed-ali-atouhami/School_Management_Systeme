"use client"

import Image from "next/image"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const chartData = [
  { Day: "Mon", present: 186, absent:  80 },
  { Day: "Tue", present: 305, absent: 60 },
  { Day: "Wed", present: 237, absent: 120 },
  { Day: "Thu", present:  73, absent: 190 },
  { Day: "Fri", present: 209, absent: 130 },
]

export function Component() {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      <div className="w-full h-[90%]">
        <ResponsiveContainer>
          <BarChart accessibilityLayer data={chartData} barSize={20} width={500} height={300}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd"/>
            <XAxis
              dataKey="Day"
              tickLine={false}
              axisLine={false}
              tick={{fill:"#d1d5db"}}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{fill:"#d1d5db"}}
            />
            <Tooltip contentStyle={{borderRadius: "10px" , borderColor: "#d1d5db"}} />
            <Legend align="left" verticalAlign="top" wrapperStyle={{paddingTop: "20px" , paddingBottom: "40px"}} />
            <Bar dataKey="present" fill="#C3EBFA" radius={[15,15,0,0]} legendType="circle"/>
            <Bar dataKey="absent" fill="#FAE27C" radius={[15,15,0,0]} legendType="circle"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
