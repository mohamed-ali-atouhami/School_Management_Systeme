import Announcement from "@/components/Announcement";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import { auth } from "@clerk/nextjs/server";
interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function TeacherPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const { userId } = await auth();
  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* left side */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendarContainer type="teacherId" id={userId!} />
        </div>
      </div>
      {/* right side */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={resolvedParams} />
        <Announcement />
      </div>
    </div>
  )
}
