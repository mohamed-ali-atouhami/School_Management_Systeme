import UserCard from "@/components/UserCard";
import { FinanceChart } from "@/components/FinanceChart";
import Announcement from "@/components/Announcement";
import CountChartContainer from "@/components/CountChartContainer";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
export default function AdminPage({searchParams}: {searchParams: {[keys: string]: string | undefined}}) {
  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* left side */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" />
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
        </div>
        {/*Middle Chart*/}
        <div className="flex gap-4 flex-col lg:flex-row ">
          {/*Count Chart*/}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/*Attendance Chart*/}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>
        {/*Bottom Chart*/}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* right side */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcement />
      </div>
    </div>
  );
}
