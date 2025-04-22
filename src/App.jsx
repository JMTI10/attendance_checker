// App.jsx
import { useState } from "react";
import ClassTracker from "./ClassTracker";
import "./index.css";

export default function App() {
    // State to hold class list
    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState("");

    // State for deletion mode
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState([]);

    // Add new class with default expanded state false
    const addClass = () => {
        if (newClassName.trim()) {
            setClasses((prev) => [
                ...prev,
                { name: newClassName.trim(), expanded: false },
            ]);
            setNewClassName("");
        }
    };

    // Toggle dropdown expansion per class
    const toggleClass = (index) => {
        setClasses((prev) =>
            prev.map((cls, i) =>
                i === index ? { ...cls, expanded: !cls.expanded } : cls
            )
        );
    };

    // Delete all selected classes
    const deleteSelected = () => {
        setClasses((prev) =>
            prev.filter((_, i) => !selectedToDelete.includes(i))
        );
        setSelectedToDelete([]);
        setDeleteMode(false);
    };

    return (
        <div>
            <h1>Class Attendance Tracker</h1>

            {/* Controls for adding and deleting classes */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
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

            {/* Class cards shown as flex wrap layout */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {classes.map((cls, index) => (
                    <div
                        key={index}
                        style={{
                            border: "1px solid #444",
                            borderRadius: "8px",
                            padding: "1rem",
                            backgroundColor: "#1e1e1e",
                            minWidth: "250px",
                            flex: "1 1 250px",
                        }}
                    >
                        {/* Class title and delete-mode checkbox */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <button onClick={() => toggleClass(index)}>
                                {cls.expanded ? "▼" : "▶"} {cls.name}
                            </button>

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

                        {/* Expanded attendance tracker inside dropdown */}
                        {cls.expanded && (
                            <div style={{ marginTop: "0.5rem" }}>
                                <ClassTracker />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
