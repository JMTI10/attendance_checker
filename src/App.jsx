// App.jsx
import { useState, useEffect } from "react";
import ClassTracker from "./ClassTracker";
import "./css/index.css";
import "./css/App.css";

export default function App() {
    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState("");
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState([]);

    // Load classes from localStorage on first render
    useEffect(() => {
        const saved = localStorage.getItem("attendance-classes");
        if (saved) {
            setClasses(JSON.parse(saved));
        }
    }, []);

    // Save classes to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("attendance-classes", JSON.stringify(classes));
    }, [classes]);

    const addClass = () => {
        if (newClassName.trim()) {
            const newClass = {
                name: newClassName.trim(),
                expanded: false,
                editing: false,
                trackerData: {
                    startDate: "",
                    endDate: "",
                    classesPerWeek: 1,
                    dates: [],
                    attendance: {},
                },
            };
            setClasses((prev) => [...prev, newClass]);
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

    const deleteSelected = () => {
        setClasses((prev) =>
            prev.filter((_, i) => !selectedToDelete.includes(i))
        );
        setSelectedToDelete([]);
        setDeleteMode(false);
    };

    // Update tracker data for a specific class
    const updateTrackerData = (index, updatedTrackerData) => {
        setClasses((prev) =>
            prev.map((cls, i) =>
                i === index ? { ...cls, trackerData: updatedTrackerData } : cls
            )
        );
    };

    const startEdit = (index) => {
        setClasses((prev) =>
            prev.map((cls, i) =>
                i === index ? { ...cls, editing: true } : cls
            )
        );
    };

    const cancelEdit = (index) => {
        setClasses((prev) =>
            prev.map((cls, i) =>
                i === index ? { ...cls, editing: false } : cls
            )
        );
    };

    const saveEdit = (index) => {
        setClasses((prev) =>
            prev.map((cls, i) =>
                i === index ? { ...cls, editing: false } : cls
            )
        );
    };

    const updateClassName = (index, newName) => {
        setClasses((prev) =>
            prev.map((cls, i) =>
                i === index ? { ...cls, name: newName } : cls
            )
        );
    };

    return (
        <div>
            <h1>Class Attendance Tracker</h1>

            {/* Controls */}
            <div className="class-list">
                <input
                    type="text"
                    value={newClassName}
                    placeholder="Enter class name"
                    onChange={(e) => setNewClassName(e.target.value)}
                />
                <button onClick={addClass}>➕ Add Class</button>
                <button onClick={() => setDeleteMode((prev) => !prev)}>
                    🗑️ {deleteMode ? "Cancel" : "Delete Classes"}
                </button>
                {deleteMode && selectedToDelete.length > 0 && (
                    <button onClick={deleteSelected}>❌ Delete Selected</button>
                )}
            </div>

            {/* Class list */}
            <div className="class-list">
                {classes.map((cls, index) => (
                    <div key={index} className="class-card">
                        <div className="class-controls">
                            {cls.editing ? (
                                <>
                                    <input
                                        type="text"
                                        value={cls.name}
                                        onChange={(e) =>
                                            updateClassName(
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button onClick={() => saveEdit(index)}>
                                        ✅
                                    </button>
                                    <button onClick={() => cancelEdit(index)}>
                                        ❌
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => toggleClass(index)}>
                                        {cls.expanded ? "▼" : "▶"} {cls.name}
                                    </button>
                                    <button onClick={() => startEdit(index)}>
                                        ✏️
                                    </button>
                                </>
                            )}

                            {deleteMode && (
                                <input
                                    type="checkbox"
                                    checked={selectedToDelete.includes(index)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedToDelete((prev) => [
                                                ...prev,
                                                index,
                                            ]);
                                        } else {
                                            setSelectedToDelete((prev) =>
                                                prev.filter((i) => i !== index)
                                            );
                                        }
                                    }}
                                />
                            )}
                        </div>

                        {cls.expanded && (
                            <div className="tracker-wrapper">
                                <ClassTracker
                                    trackerData={cls.trackerData}
                                    onUpdate={(newData) =>
                                        updateTrackerData(index, newData)
                                    }
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
