import Announcement from "@/components/Announcement";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalender from "@/components/EventCalender";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
export default async function ParentPage() {
  const { userId } = await auth();
  const studentRes = await prisma.student.findMany({
    where: {
      parentId: userId!
    },
    select: {
      name: true,
      surname: true,
      class: { select: { id: true, name: true } }
    }
  })
  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* left side */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({studentRes[0].name + " " + studentRes[0].surname}) [{studentRes[0].class.name}]</h1>
          <BigCalendarContainer type="classId" id={studentRes[0].class.id} />
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
