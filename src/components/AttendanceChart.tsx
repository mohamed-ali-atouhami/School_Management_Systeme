"use client"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function AttendanceChart({data}: {data: {Day: string, present: number, absent: number}[]}) {
  return (
      <div className="w-full h-[90%]">
        <ResponsiveContainer>
          <BarChart accessibilityLayer data={data} barSize={20} width={500} height={300}>
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
  )
}
