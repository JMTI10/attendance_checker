import { useState, useEffect } from "react";
import ClassTracker from "./ClassTracker";
import "./css/index.css";
import "./css/App.css";

export default function App() {
    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState("");
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState([]);

    useEffect(() => {
        const savedClasses = localStorage.getItem("attendance-classes");
        if (savedClasses) {
            setClasses(JSON.parse(savedClasses));
        }
    }, []);

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

    const manualSave = () => {
        try {
            const data = JSON.stringify(classes);
            localStorage.setItem("attendance-classes", data);
            console.log("Saved to localStorage:", data);
            alert("Saved manually! ✅");
        } catch (err) {
            console.error("Failed to save to localStorage", err);
        }
    };

    const exportToFile = () => {
        const blob = new Blob([JSON.stringify(classes, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "attendance_backup.json";
        link.click();
        URL.revokeObjectURL(url);
    };

    const importFromFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    setClasses(importedData);
                    alert("Backup imported successfully ✅");
                } else {
                    alert("Invalid file format ❌");
                }
            } catch (err) {
                alert("Failed to read file ❌");
                console.error(err);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <h1>Class Attendance Tracker</h1>

            {/* Controls */}
            <div className="button-panel">
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
                <button onClick={manualSave}>💾 Save</button>
                <button onClick={exportToFile}>📤 Export Backup</button>

                <label className="import-label">
                    📥 Import Backup
                    <input
                        type="file"
                        accept="application/json"
                        onChange={importFromFile}
                        style={{ display: "none" }}
                    />
                </label>
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
