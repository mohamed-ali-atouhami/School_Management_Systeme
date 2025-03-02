"use client";

import React from "react";
import dynamic from 'next/dynamic';
import 'react-calendar/dist/Calendar.css';
import Image from "next/image";

const Calendar = dynamic(() => import('react-calendar'), {
    ssr: false,
    loading: () => (
        <div className="bg-white rounded-md p-4 w-full h-full flex items-center justify-center">
            Loading calendar...
        </div>
    )
});

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
//Temporary data
export const eventsData = [
    {
        id: 1,
        title: "Lake Trip",
        startTime: "10:00 pm - 11:00 pm",
        description: "Lorem ipsum dolor sit amet consectetur ",
    },
    {
        id: 2,
        title: "Picnic",
        startTime: "12:00 pm - 1:00 pm",
        description: "Lorem ipsum dolor sit amet consectetur ",
    },
    {
        id: 3,
        title: "Beach Trip",
        startTime: "1:00 pm - 2:00 pm",
        description: "Lorem ipsum dolor sit amet consectetur ",
    },
];

export default function EventCalender() {
    const [value, onChange] = React.useState<Value>(new Date());

    return (
        <div className="bg-white rounded-md p-4 w-full h-full">
            <Calendar onChange={onChange} value={value} />
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold my-4">Events</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className="flex flex-col gap-4">
                {eventsData.map((event) => (
                    <div key={event.id} className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-medaliSky even:border-t-medaliPurple">
                        <div className="flex items-center justify-between">
                            <h1 className="font-semibold">{event.title}</h1>
                            <span className="text-xs text-gray-300">{event.startTime}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
