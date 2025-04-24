import Announcement from "@/components/Announcement";
import Image from "next/image";
import Link from "next/link";
import { PerformanceChart } from "@/components/PerformanceChart";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import FormContainer from "@/components/Forms/FormContainer";
import { auth } from "@clerk/nextjs/server";
import BigCalendarContainer from "@/components/BigCalendarContainer";

interface Props {
  params: Promise<{ id: string }>
}

export default async function TeacherSinglePage({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const {sessionClaims} = await auth()
  const role = (sessionClaims?.metadata as {role?: string})?.role
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: id
    },
    include: {
      _count: {
        select: {
          classes: true,
          subjects: true,
          lessons: true
        }
      },
      lessons: true
    }
  })
  if (!teacher) {
    return notFound()
  }
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row ">
      {/* left */}
      <div className="w-full xl:w-2/3">
        {/* Top */}
        <div className="flex flex-col gap-4 lg:flex-row ">
          {/* left (User Card Info) */}
          <div className="flex-1 flex gap-4 lg:w-2/3 bg-medaliSky rounded-md p-4">
            
            <div className="w-1/3">
              <Image 
                src={teacher.image || "/noAvatar.png"} 
                alt="user" 
                width={144} 
                height={144} 
                className="w-36 h-36  rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{teacher.name} {teacher.surname}</h1>
                {
                  role === "admin" && (
                    <FormContainer table="teachers" type="edit" data={teacher} />
                  )
                }
              </div>
              <p className="text-sm text-gray-500">
                {teacher.address || "-"}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{teacher.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{teacher.birthday?.toLocaleDateString()}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{teacher.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{teacher.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* right (Small Cards) */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* card 1 */}
            <div className="bg-white rounded-md p-4 flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[47%] ">
              <div className="flex items-center gap-2">
                <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6"/>
                <div>
                  <h1 className="text-xl font-semibold">90%</h1>
                  <span className="text-sm text-gray-400">Attendance</span>
                </div>
              </div>
            </div>
            {/* card 2 */}
            <div className="bg-white rounded-md p-4 flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[47%] ">
              <div className="flex items-center gap-2">
                <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6"/>
                <div>
                  <h1 className="text-xl font-semibold">{teacher._count.subjects}</h1>
                  <span className="text-sm text-gray-400">Subjects</span>
                </div>
              </div>
            </div>
            {/* card 3 */}
            <div className="bg-white rounded-md p-4 flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[47%]">
              <div className="flex items-center gap-2">
                <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6"/>
                <div>
                  <h1 className="text-xl font-semibold">{teacher._count.lessons}</h1>
                  <span className="text-sm text-gray-400">Lessons</span>
                </div>
              </div>
            </div>
            {/* card 4 */}
            <div className="bg-white rounded-md p-4 flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[47%]">
              <div className="flex items-center gap-2">
                <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6"/>
                <div>
                  <h1 className="text-xl font-semibold">{teacher._count.classes}</h1>
                  <span className="text-sm text-gray-400">Classes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="text-lg font-semibold">Teacher&apos;s Schedule</h1>
          <BigCalendarContainer type="teacherId" id={teacher.id}/>

        </div>
      </div>
      {/* right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white rounded-md p-4">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-medaliSkyLight" href={`/list/classes?supervisorId=${teacher.id}`}>Teacher&apos;s Classes</Link>
            <Link className="p-3 rounded-md bg-medaliPurpleLight" href={`/list/students?teacherId=${teacher.id}`}>Teacher&apos;s Students</Link>
            <Link className="p-3 rounded-md bg-medaliYellowLight" href={`/list/exams?teacherId=${teacher.id}`}>Teacher&apos;s Exams</Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/list/lessons?teacherId=${teacher.id}`}>Teacher&apos;s Lessons</Link>
            <Link className="p-3 rounded-md bg-medaliSkyLight" href={`/list/assignments?teacherId=${teacher.id}`}>Teacher&apos;s Assignments</Link>
          </div>
        </div>
        <PerformanceChart/>
        <Announcement/>
      </div>
    </div>  
  )
}