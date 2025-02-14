import UserCard from "@/components/UserCard";

export default function AdminPage() {
  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* left side */}
      <div className="w-full lg:w-2/3">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
      </div>
      {/* right side */}
      <div className="w-full lg:w-1/3">right Dashboard</div>
    </div>
  );
}
