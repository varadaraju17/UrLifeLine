import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import axios from "axios";
import DropdownSelect from "./UI/DropdownSelect";

const AlertsPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [user, setUser] = useState(null);
    const [newAlert, setNewAlert] = useState({ disasterId: "", message: "" });
    const [disasters, setDisasters] = useState([]);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);

        const fetchData = async () => {
            try {
                if (currentUser && currentUser.roles && currentUser.roles.includes("ROLE_ADMIN")) {
                    const resp = await axios.get("http://localhost:8080/api/disasters/active", {
                        headers: { Authorization: `Bearer ${currentUser.token}` }
                    });
                    setDisasters(resp.data);
                }

                const endpoint = (currentUser && currentUser.roles && currentUser.roles.includes("ROLE_CITIZEN")) ? "/api/alerts/active" : "/api/alerts";
                const alertsResp = await axios.get(`http://localhost:8080${endpoint}`, {
                    headers: currentUser && currentUser.token ? { Authorization: `Bearer ${currentUser.token}` } : {}
                });
                setAlerts(alertsResp.data);
            } catch (error) {
                console.error("Error fetching alerts/disasters:", error);
            }
        };

        fetchData();
    }, []);

    const handleCreateAlert = (e) => {
        e.preventDefault();
        const currentUser = AuthService.getCurrentUser();
        axios.post("http://localhost:8080/api/alerts/create", newAlert, {
            headers: { Authorization: `Bearer ${currentUser.token}` }
        }).then(response => {
            alert("Alert created successfully!");
            setNewAlert({ disasterId: "", message: "" });
            // Refresh alerts
            window.location.reload();
        }).catch(error => {
            console.error("Error creating alert:", error);
        });
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case "High": return "bg-red-900/30 border-red-600 text-red-300";
            case "Moderate": return "bg-yellow-900/25 border-yellow-500 text-yellow-300";
            default: return "bg-green-900/25 border-green-500 text-green-300";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Alerts</h1>

            {user && user.roles.includes("ROLE_ADMIN") && (
                <div className="surface p-6 rounded-lg shadow-md mb-6 text-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-white">Create New Alert</h2>
                    <form onSubmit={handleCreateAlert} className="space-y-4">
                        <div>
                            <DropdownSelect
                                label="Disaster"
                                required
                                options={disasters.map(disaster => ({
                                  value: disaster.id,
                                  label: `${disaster.type} - ${disaster.region}`
                                }))}
                                value={newAlert.disasterId}
                                onChange={(value) => setNewAlert({...newAlert, disasterId: value})}
                                placeholder="Select a disaster"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <textarea
                                value={newAlert.message}
                                onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                                className="w-full p-2 border rounded"
                                rows="3"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Create Alert
                        </button>
                    </form>
                </div>
            )}

            <div className="surface p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-white">Active Alerts</h2>
                {alerts.length > 0 ? (
                    <div className="space-y-4">
                        {alerts.map(alert => (
                            <div key={alert.id} className={`p-4 border-l-4 rounded ${getSeverityColor(alert.disaster.severity)}`}>
                                <h3 className="font-bold text-white">{alert.disaster.type} Alert</h3>
                                <p className="mb-2 text-gray-300">{alert.message}</p>
                                <div className="text-sm text-gray-400">
                                    Region: {alert.disaster.region} | Severity: {alert.disaster.severity}
                                </div>
                                <div className="text-sm text-gray-400">
                                    Broadcast: {new Date(alert.broadcastTime).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">No active alerts.</p>
                )}
            </div>
        </div>
    );
};

export default AlertsPage;