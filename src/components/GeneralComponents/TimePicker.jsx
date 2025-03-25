import React, { useState, useEffect } from "react";

const TimePicker = ({ selectedTime, onChange }) => {
    const [hour, setHour] = useState("12");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");

    useEffect(() => {
        if (selectedTime === null) {
            setHour("12");
            setMinute("00");
            setPeriod("AM");
        }
    }, [selectedTime]);

    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
    const minutes = ["00", "15", "30", "45"];
    const periods = ["AM", "PM"];

    return (
        <div className="mb-4">
            <div className="flex space-x-2">
                <select value={hour} onChange={(e) => setHour(e.target.value)} className="border p-2 rounded-md bg-white">
                    {hours.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>

                <select value={minute} onChange={(e) => setMinute(e.target.value)} className="border p-2 rounded-md bg-white">
                    {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>

                <select value={period} onChange={(e) => setPeriod(e.target.value)} className="border p-2 rounded-md bg-white">
                    {periods.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
        </div>
    );
};

export default TimePicker;
