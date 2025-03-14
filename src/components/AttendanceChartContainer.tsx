import prisma from "@/lib/prisma";
import { AttendanceChart } from "./AttendanceChart";
import Image from "next/image";
export default async function AttendanceChartContainer() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysSinceMonday);
    const data = await prisma.attendance.findMany({
        where: {
            date: {
                gte: lastMonday,
                lte: today
            }
        },
        select: {
            date: true,
            present: true
        }
    })
    const DaysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const attendanceMap : {[key: string]: {present: number, absent: number}} = {
        Mon:{present:0, absent:0}, 
        Tue:{present:0, absent:0}, 
        Wed:{present:0, absent:0}, 
        Thu:{present:0, absent:0}, 
        Fri:{present:0, absent:0}
    }
    data.forEach((item) => {
        const itemDate = new Date(item.date);
        if(dayOfWeek >= 1 && dayOfWeek <= 5){
           const dayName = DaysOfWeek[dayOfWeek - 1];
           if(item.present){
            attendanceMap[dayName].present++;
           }else{
            attendanceMap[dayName].absent++;
           }
        }
    })
    const attendanceData = DaysOfWeek.map((day) => ({
        Day: day,
        present: attendanceMap[day].present,
        absent: attendanceMap[day].absent
    }))
    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Attendance</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <AttendanceChart data={attendanceData} />
        </div>
    )
}
