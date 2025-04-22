// App.jsx
import { useState } from "react";
import "./index.css";
import ClassTracker from "./ClassTracker";

export default function App() {
    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState("");

    const addClass = () => {
        if (newClassName.trim()) {
            setClasses((prev) => [
                ...prev,
                { name: newClassName.trim(), expanded: false },
            ]);
            setNewClassName("");
        }
    };

    const toggleClass = (index) => {
        setClasses((prev) =>
            prev.map((cls, i) =>
                i === index ? { ...cls, expanded: !cls.expanded } : cls
            )
        );
    };

    return (
        <div>
            <h1>Class Attendance Tracker</h1>

            <div>
                <input
                    type="text"
                    value={newClassName}
                    placeholder="Enter class name"
                    onChange={(e) => setNewClassName(e.target.value)}
                />
                <button onClick={addClass}>➕ Add Class</button>
            </div>

            {classes.map((cls, index) => (
                <div key={index} style={{ marginTop: "1rem" }}>
                    <button onClick={() => toggleClass(index)}>
                        {cls.expanded ? "▼" : "▶"} {cls.name}
                    </button>
                    {cls.expanded && (
                        <div
                            style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}
                        >
                            {/* THIS is where we show what's inside the dropdown */}
                            <p>📅 Attendance goes here (per class)</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
