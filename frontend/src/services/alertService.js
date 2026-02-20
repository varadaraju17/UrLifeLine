import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Get officer's alert history
export const getMyAlerts = async () => {
    const response = await axios.get(`${API_URL}/api/alerts/my-alerts`);
    return response.data;
};

// Delete an alert
export const deleteAlert = async (alertId) => {
    const response = await axios.delete(`${API_URL}/api/alerts/${alertId}`);
    return response.data;
};

// Broadcast a new alert
export const broadcastAlert = async (alertData) => {
    const response = await axios.post(`${API_URL}/api/alerts/broadcast`, alertData);
    return response.data;
};

export default {
    getMyAlerts,
    deleteAlert,
    broadcastAlert
};
