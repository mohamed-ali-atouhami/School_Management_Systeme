import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function Announcement() {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const roleConditions = {
        teacher: { lessons: { some: { teacherId: userId! } } },
        student: { students: { some: { id: userId! } } },
        parent: { students: { some: { parentId: userId! } } },
    }
    const announcements = await prisma.announcement.findMany({
        where: {
            ...(role !== "admin" && {
                OR: [{classId: null}, {class: roleConditions[role as keyof typeof roleConditions]}]
            })
        },
        orderBy: {
            date: "desc"
        },
        take: 3
    });
    return (
        <div className="bg-white rounded-md p-4 ">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Announcements</h1>
                <span className="text-xs text-gray-400">View All</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {announcements[0] && (
                    <div className="bg-medaliSkyLight rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-medium">{announcements[0]?.title}</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1 ">{announcements[0]?.date.toLocaleDateString()}</span>
                    </div>
                        <p className="text-sm text-gray-400 mt-2">{announcements[0]?.description}</p>
                    </div>
                )}
                {announcements[1] && (
                    <div className="bg-medaliPurpleLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">{announcements[1]?.title}</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1 ">{announcements[1]?.date.toLocaleDateString()}</span>
                    </div>
                        <p className="text-sm text-gray-400 mt-2">{announcements[1]?.description}</p>
                    </div>
                )}
                {announcements[2] && (
                    <div className="bg-medaliYellowLight rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-medium">{announcements[2]?.title}</h2>
                            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1 ">{announcements[2]?.date.toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">{announcements[2]?.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
