import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: "/teacher.png",
          label: "Teachers",
          href: "/list/teachers",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/student.png",
          label: "Students",
          href: "/list/students",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/parent.png",
          label: "Parents",
          href: "/list/parents",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/subject.png",
          label: "Subjects",
          href: "/list/subjects",
          visible: ["admin"],
        },
        {
          icon: "/class.png",
          label: "Classes",
          href: "/list/classes",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/lesson.png",
          label: "Lessons",
          href: "/list/lessons",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/exam.png",
          label: "Exams",
          href: "/list/exams",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/assignment.png",
          label: "Assignments",
          href: "/list/assignments",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/result.png",
          label: "Results",
          href: "/list/results",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/attendance.png",
          label: "Attendance",
          href: "/list/attendances",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/calendar.png",
          label: "Events",
          href: "/list/events",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/announcement.png",
          label: "Announcements",
          href: "/list/announcements",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
];
export default async function Menu() {
  const user = await currentUser()
  const role = user?.publicMetadata.role as string;
    return (
        <div className="mt-2 text-sm overflow-y-auto">
            {menuItems.map((item) => (
                <div className="flex flex-col gap-2" key={item.title}>
                  <span className="hidden lg:block font-light text-gray-400 my-2">{item.title}</span>
                  {item.items.map((i) => 
                  {
                    if(i.visible.includes(role))
                    {
                      return(
                        <Link 
                            href={i.href} 
                            key={i.label} 
                            className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 hover:bg-medaliSkyLight rounded-lg md:px-2"
                        >
                            <Image src={i.icon} alt={i.label} width={20} height={20} />
                            <span className="hidden lg:block">{i.label}</span>
                        </Link>
                      )
                    }
                  }
                  )}
                </div>
            ))}
        </div>
    );
}