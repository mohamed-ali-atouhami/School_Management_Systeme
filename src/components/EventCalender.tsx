"use client";

import React, { useEffect } from "react";
import dynamic from 'next/dynamic';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from "next/navigation";
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


export default function EventCalender() {
    const [value, onChange] = React.useState<Value>(new Date());
    const router = useRouter();
    useEffect(() => {
        if (value instanceof Date) {
            router.push(`?date=${value}`); //.toISOString().split('T')[0]
        }   
    }, [value, router]);
    return <Calendar onChange={onChange} value={value} />;
}
