import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import axios from "axios";
import DropdownSelect from "./UI/DropdownSelect";

const RescueTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [responders, setResponders] = useState([]);
    const [disasters, setDisasters] = useState([]);
    const [newTask, setNewTask] = useState({ responderId: "", disasterId: "", description: "" });
    const [report, setReport] = useState({ disasterId: "", details: "" });

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);

        if (currentUser.roles.includes("ROLE_ADMIN")) {
            // Fetch responders and disasters for admin
            axios.get("http://localhost:8080/api/users/responders", {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            }).then(response => {
                setResponders(response.data);
            }).catch(error => {
                console.error("Error fetching responders:", error);
            });

            axios.get("http://localhost:8080/api/disasters/active", {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            }).then(response => {
                setDisasters(response.data);
            }).catch(error => {
                console.error("Error fetching disasters:", error);
            });
        }

        // Fetch tasks
        const endpoint = currentUser.roles.includes("ROLE_RESPONDER") ? "/api/rescue/tasks" : "/api/rescue/all";
        axios.get(`http://localhost:8080${endpoint}`, {
            headers: { Authorization: `Bearer ${currentUser.token}` }
        }).then(response => {
            setTasks(response.data);
        }).catch(error => {
            console.error("Error fetching tasks:", error);
        });
    }, []);

    const handleAssignTask = (e) => {
        e.preventDefault();
        const currentUser = AuthService.getCurrentUser();
        axios.post("http://localhost:8080/api/rescue/assign", newTask, {
            headers: { Authorization: `Bearer ${currentUser.token}` }
        }).then(response => {
            alert("Task assigned successfully!");
            setNewTask({ responderId: "", disasterId: "", description: "" });
            window.location.reload();
        }).catch(error => {
            console.error("Error assigning task:", error);
        });
    };

    const handleUpdateStatus = (taskId, status) => {
        const currentUser = AuthService.getCurrentUser();
        axios.put(`http://localhost:8080/api/rescue/update/${taskId}`, { status }, {
            headers: { Authorization: `Bearer ${currentUser.token}` }
        }).then(response => {
            alert("Task status updated!");
            window.location.reload();
        }).catch(error => {
            console.error("Error updating task:", error);
        });
    };

    const handleSubmitReport = (e) => {
        e.preventDefault();
        const currentUser = AuthService.getCurrentUser();
        axios.post("http://localhost:8080/api/reports/submit", report, {
            headers: { Authorization: `Bearer ${currentUser.token}` }
        }).then(response => {
            alert("Report submitted successfully!");
            setReport({ disasterId: "", details: "" });
        }).catch(error => {
            console.error("Error submitting report:", error);
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING": return "bg-yellow-900/25 text-yellow-300";
            case "ONGOING": return "bg-indigo-900/25 text-indigo-300";
            case "COMPLETED": return "bg-green-900/25 text-green-300";
            default: return "bg-gray-800 text-gray-300";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                {user && user.roles.includes("ROLE_ADMIN") ? "Assign Rescue Tasks" : "My Rescue Tasks"}
            </h1>

            {user && user.roles.includes("ROLE_ADMIN") && (
                <div className="surface p-6 rounded-lg shadow-md mb-6 text-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-white">Assign New Task</h2>
                    <form onSubmit={handleAssignTask} className="space-y-4">
                        <div>
                            <DropdownSelect
                                label="Responder"
                                required
                                options={responders.map(responder => ({
                                  value: responder.id,
                                  label: `${responder.name} - ${responder.region}`
                                }))}
                                value={newTask.responderId}
                                onChange={(value) => setNewTask({...newTask, responderId: value})}
                                placeholder="Select a responder"
                            />
                        </div>
                        <div>
                            <DropdownSelect
                                label="Disaster"
                                required
                                options={disasters.map(disaster => ({
                                  value: disaster.id,
                                  label: `${disaster.type} - ${disaster.region}`
                                }))}
                                value={newTask.disasterId}
                                onChange={(value) => setNewTask({...newTask, disasterId: value})}
                                placeholder="Select a disaster"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                className="w-full p-2 border rounded"
                                rows="3"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Assign Task
                        </button>
                    </form>
                </div>
            )}

            <div className="surface p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Tasks</h2>
                {tasks.length > 0 ? (
                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div key={task.id} className="p-4 border rounded bg-transparent">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-white">{task.disaster.type} - {task.disaster.region}</h3>
                                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(task.taskStatus)}`}>
                                        {task.taskStatus}
                                    </span>
                                </div>
                                <p className="mb-2 text-gray-300">{task.description}</p>
                                <div className="text-sm text-gray-400 mb-2">
                                    Assigned to: {task.responder.name}
                                </div>
                                {user && user.roles.includes("ROLE_RESPONDER") && task.taskStatus !== "COMPLETED" && (
                                    <div className="flex gap-2">
                                        {task.taskStatus === "PENDING" && (
                                            <button
                                                onClick={() => handleUpdateStatus(task.id, "ONGOING")}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                            >
                                                Start Task
                                            </button>
                                        )}
                                        {task.taskStatus === "ONGOING" && (
                                            <button
                                                onClick={() => handleUpdateStatus(task.id, "COMPLETED")}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                            >
                                                Complete Task
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No tasks available.</p>
                )}
            </div>

            {user && user.roles.includes("ROLE_RESPONDER") && (
                <div className="surface p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-white">Submit Incident Report</h2>
                    <form onSubmit={handleSubmitReport} className="space-y-4">
                        <div>
                            <DropdownSelect
                                label="Disaster"
                                required
                                options={disasters.map(disaster => ({
                                  value: disaster.id,
                                  label: `${disaster.type} - ${disaster.region}`
                                }))}
                                value={report.disasterId}
                                onChange={(value) => setReport({...report, disasterId: value})}
                                placeholder="Select a disaster"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Report Details</label>
                            <textarea
                                value={report.details}
                                onChange={(e) => setReport({...report, details: e.target.value})}
                                className="w-full p-2 border rounded"
                                rows="4"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                            Submit Report
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default RescueTasks;