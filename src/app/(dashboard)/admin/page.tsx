
import { CountChart } from "@/components/CountChart";
import UserCard from "@/components/UserCard";
import { Component as AttendanceChart } from "@/components/AttendanceChart";
import { FinanceChart } from "@/components/FinanceChart";
import EventCalender from "@/components/EventCalender";
import Announcement from "@/components/Announcement";
export default function AdminPage() {
  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* left side */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
        {/*Middle Chart*/}
        <div className="flex gap-4 flex-col lg:flex-row ">
          {/*Count Chart*/}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/*Attendance Chart*/}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        {/*Bottom Chart*/}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* right side */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalender />
        <Announcement />
      </div>
    </div>
  );
}
