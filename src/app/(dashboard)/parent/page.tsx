import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import EventCalender from "@/components/EventCalender";
export default function ParentPage() {
  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* left side */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (jhon doe)</h1>
          <BigCalendar />
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
