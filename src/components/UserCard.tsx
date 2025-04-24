import prisma from "@/lib/prisma";
import Image from "next/image";

type ModelCount = {
    admin: () => Promise<number>;
    student: () => Promise<number>;
    teacher: () => Promise<number>;
    parent: () => Promise<number>;
};

export default async function UserCard({ type }: { type: "admin" | "student" | "teacher" | "parent" }) {
  const modelMap: ModelCount = {
    admin: () => prisma.admin.count(),
    student: () => prisma.student.count(),
    teacher: () => prisma.teacher.count(),
    parent: () => prisma.parent.count(),
  };
  const data = await modelMap[type]();
  return (
    <div className="rounded-2xl odd:bg-medaliPurple even:bg-medaliYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">{new Date().toLocaleDateString()}</span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
}
