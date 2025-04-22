// ClassTracker.jsx
import { useState } from "react";

export default function ClassTracker() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [classesPerWeek, setClassesPerWeek] = useState(1);
    const [dates, setDates] = useState([]);
    const [attendance, setAttendance] = useState({});

    const generateDates = () => {
        if (!startDate || !endDate || classesPerWeek < 1) return;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalDays = (end - start) / (1000 * 60 * 60 * 24);
        const step = Math.floor(7 / classesPerWeek);

        const generated = [];
        let current = new Date(start);

        while (current <= end) {
            generated.push(current.toISOString().split("T")[0]);
            current.setDate(current.getDate() + step);
        }

        setDates(generated);
    };

    const mark = (date, type) => {
        setAttendance((prev) => ({ ...prev, [date]: type }));
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
        <div style={{ marginTop: "1rem" }}>
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
                            </li>
                        ))}
                    </ul>
                    <pre style={{ marginTop: "10px" }}>{getStats()}</pre>
                </div>
            )}
        </div>
    );
}
