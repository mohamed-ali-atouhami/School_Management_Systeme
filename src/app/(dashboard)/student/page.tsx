import Announcement from "@/components/Announcement";
import { auth } from "@clerk/nextjs/server";
import EventCalender from "@/components/EventCalender";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
export default async function StudentPage() {
  const { userId } = await auth();
  const classRes = await prisma.class.findMany({
    where: {
      students: { some: { id: userId! }}
    },
    select: {
      id: true,
      name: true
    }
  })
  return (
    <div className="p-4 flex flex-col xl:flex-row gap-4">
      {/* left side */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({classRes[0].name})</h1>
          <BigCalendarContainer type="classId" id={classRes[0].id} />
        </div>
      </div>
      {/* right side */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalender />
        <Announcement />
      </div>

    </div>
  )
}
