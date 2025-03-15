import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";
export default async function BigCalendarContainer({type, id}: {type: "teacherId" | "classId", id: string | number }) {
    const dataRes = await prisma.lesson.findMany({
        where: {
            ...(type === "teacherId"
                ? {teacherId: id as string }
                : {classId: id as number}
            )
        }
    })
    const data = dataRes.map((event) => ({
        title: event.name,
        start: event.startTime,
        end: event.endTime,
    }))
    const adjustedData = adjustScheduleToCurrentWeek(data)
    return (
        <BigCalendar data={adjustedData} />
    )
}
