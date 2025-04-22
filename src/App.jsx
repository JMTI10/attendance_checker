// App.jsx
import { useState } from "react";
import "./index.css";

export default function App() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [classesPerWeek, setClassesPerWeek] = useState(1);
    const [status, setStatus] = useState("No data yet");

    const markAttendance = (type) => {
        setStatus(`Marked: ${type.toUpperCase()} ✔️`);
        // TODO: add full logic here later
    };

    return (
        <div>
            <h1>Class Attendance Tracker</h1>

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

            <div>
                <button onClick={() => markAttendance("attended")}>
                    ✅ Attended
                </button>
                <button onClick={() => markAttendance("missed")}>
                    ❌ Missed
                </button>
                <button onClick={() => markAttendance("canceled")}>
                    🚫 Canceled
                </button>
            </div>

            <h2>Status</h2>
            <p id="stats">{status}</p>
        </div>
    );
}
