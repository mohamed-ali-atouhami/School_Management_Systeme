import prisma from "@/lib/prisma";

export default async function EventList({dateParam}: {dateParam: string | undefined}) {
    const date = dateParam ? new Date(dateParam) : new Date();
    const events = await prisma.event.findMany({
        where: {
            startTime: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lte: new Date(date.setHours(23, 59, 59, 999))
            }
        }
    });
    return (
            events.map((event) => (
                <div key={event.id} className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-medaliSky even:border-t-medaliPurple">
                    <div className="flex items-center justify-between">
                        <h1 className="font-semibold">{event.title}</h1>
                        <span className="text-xs text-gray-300">{event.startTime.toLocaleString('GMT', { hour: 'numeric', minute: '2-digit', hour12: false })}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{event.description}</p>
            </div>
        ))
    )
}
