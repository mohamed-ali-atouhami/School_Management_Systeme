import prisma from "@/lib/prisma";
import { CountChart } from "./CountChart";
import Image from "next/image";
export default async function CountChartContainer() {
    const data = await prisma.student.groupBy({
        by: ["sex"],
        _count: true
    });
    const boys = data.find((item) => item.sex === "MALE")?._count || 0;
    const girls = data.find((item) => item.sex === "FEMALE")?._count || 0;
    const boysPercentage = ((boys / (boys + girls)) * 100) % 2 === 0 ? ((boys / (boys + girls)) * 100) : ((boys / (boys + girls)) * 100).toFixed(2);
    const girlsPercentage = ((girls / (boys + girls)) * 100) % 2 === 0 ? ((girls / (boys + girls)) * 100) : ((girls / (boys + girls)) * 100).toFixed(2);
    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            {/*Title*/}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Students</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            {/*Chart*/}
            <CountChart boys={boys} girls={girls} />
            {/*Bottom*/}
            <div className="flex justify-center gap-16">
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-medaliSky rounded-full"></div>
                    <h1 className="font-bold">{boys}</h1>
                    <p className="text-xs text-gray-300">Boys ({boysPercentage}%)</p>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-medaliYellow rounded-full"></div>
                    <h1 className="font-bold">{girls}</h1>
                    <p className="text-xs text-gray-300">Girls ({girlsPercentage}%)</p>
                </div>
            </div>
        </div>
    )
}

