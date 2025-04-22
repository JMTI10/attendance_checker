import { useState, useEffect } from "react";
import "./css/ClassTracker.css";

export default function ClassTracker({ trackerData, onUpdate }) {
    const [startDate, setStartDate] = useState(trackerData.startDate || "");
    const [endDate, setEndDate] = useState(trackerData.endDate || "");
    const [classesPerWeek, setClassesPerWeek] = useState(
        trackerData.classesPerWeek || 1
    );
    const [dates, setDates] = useState(trackerData.dates || []);
    const [attendance, setAttendance] = useState(trackerData.attendance || {});

    useEffect(() => {
        onUpdate({
            startDate,
            endDate,
            classesPerWeek,
            dates,
            attendance,
        });
    }, [startDate, endDate, classesPerWeek, dates, attendance]);

    const generateDates = () => {
        if (!startDate || !endDate || classesPerWeek < 1) return;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const step = Math.floor(7 / classesPerWeek);

        const generated = [];
        const current = new Date(start);

        while (current <= end) {
            generated.push(current.toISOString().split("T")[0]);
            current.setDate(current.getDate() + step);
        }

        setDates(generated);
        setAttendance({});
    };

    const mark = (date, type) => {
        setAttendance((prev) => ({ ...prev, [date]: type }));
    };

    const clearMark = (date) => {
        setAttendance((prev) => {
            const updated = { ...prev };
            delete updated[date];
            return updated;
        });
    };

    const getStats = () => {
        const total = dates.length;
        const attended = Object.values(attendance).filter(
            (x) => x === "attended"
        ).length;
        const missed = Object.values(attendance).filter(
            (x) => x === "missed"
        ).length;
        const canceled = Object.values(attendance).filter(
            (x) => x === "canceled"
        ).length;
        return `Total: ${total}\n✅ Attended: ${attended}\n❌ Missed: ${missed}\n🚫 Canceled: ${canceled}`;
    };

    return (
        <div>
            <label>
                Start Date:
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </label>

            <label>
                End Date:
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </label>

            <label>
                Classes per Week:
                <input
                    type="number"
                    min="1"
                    max="7"
                    value={classesPerWeek}
                    onChange={(e) => setClassesPerWeek(e.target.value)}
                />
            </label>

            <button onClick={generateDates}>Generate Dates</button>

            {dates.length > 0 && (
                <div>
                    <h3>Dates:</h3>
                    <ul>
                        {dates.map((date) => (
                            <li key={date}>
                                {date}
                                <button onClick={() => mark(date, "attended")}>
                                    ✅
                                </button>
                                <button onClick={() => mark(date, "missed")}>
                                    ❌
                                </button>
                                <button onClick={() => mark(date, "canceled")}>
                                    🚫
                                </button>

                                {attendance[date] && (
                                    <button onClick={() => clearMark(date)}>
                                        📝
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                    <pre className="tracker-stats">{getStats()}</pre>
                </div>
            )}
        </div>
    );
}
