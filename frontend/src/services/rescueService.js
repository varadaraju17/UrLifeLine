import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Emergency Teams API
export const emergencyTeamService = {
    getTeamsByDistrict: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/emergency-teams/district/${district}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getAvailableTeams: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/emergency-teams/district/${district}/available`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    createTeam: async (teamData) => {
        const response = await axios.post(`${API_BASE_URL}/api/emergency-teams`, teamData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateTeam: async (id, teamData) => {
        const response = await axios.put(`${API_BASE_URL}/api/emergency-teams/${id}`, teamData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateTeamStatus: async (id, status) => {
        const response = await axios.put(`${API_BASE_URL}/api/emergency-teams/${id}/status`,
            { status },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        return response.data;
    },

    deleteTeam: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/api/emergency-teams/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getDistrictStats: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/emergency-teams/district/${district}/stats`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

// Volunteers API
export const volunteerService = {
    getVolunteersByDistrict: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/volunteers/district/${district}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getVolunteerCount: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/volunteers/district/${district}/count`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

// Rescue Requests API
export const rescueRequestService = {
    createRequest: async (requestData) => {
        const response = await axios.post(`${API_BASE_URL}/api/rescue-requests`, requestData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getRequestsByDistrict: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/rescue-requests/district/${district}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getPendingRequests: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/rescue-requests/district/${district}/pending`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getMyRequests: async () => {
        const response = await axios.get(`${API_BASE_URL}/api/rescue-requests/my-requests`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    assignRequest: async (id, assignmentData) => {
        const response = await axios.put(`${API_BASE_URL}/api/rescue-requests/${id}/assign`,
            assignmentData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await axios.put(`${API_BASE_URL}/api/rescue-requests/${id}/status`,
            { status },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        return response.data;
    },

    getDistrictStats: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/rescue-requests/district/${district}/stats`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

// Rescue Operations API
export const rescueOperationService = {
    createOperation: async (operationData) => {
        const response = await axios.post(`${API_BASE_URL}/api/rescue-operations`, operationData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getOperationsByDistrict: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/rescue-operations/district/${district}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateOperation: async (id, operationData) => {
        const response = await axios.put(`${API_BASE_URL}/api/rescue-operations/${id}`, operationData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await axios.put(`${API_BASE_URL}/api/rescue-operations/${id}/status`,
            { status },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        return response.data;
    },

    getDistrictStats: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/rescue-operations/district/${district}/stats`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

// Shelters API
export const shelterService = {
    getSheltersByDistrict: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/shelters/district/${district}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getNearbyShelters: async (latitude, longitude, radiusKm = 50) => {
        const response = await axios.get(`${API_BASE_URL}/api/shelters/nearby`, {
            params: { latitude, longitude, radiusKm }
        });
        return response.data;
    },

    createShelter: async (shelterData) => {
        const response = await axios.post(`${API_BASE_URL}/api/shelters`, shelterData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateShelter: async (id, shelterData) => {
        const response = await axios.put(`${API_BASE_URL}/api/shelters/${id}`, shelterData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateOccupancy: async (id, currentOccupancy) => {
        const response = await axios.put(`${API_BASE_URL}/api/shelters/${id}/occupancy`,
            { currentOccupancy },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        return response.data;
    },

    getDistrictStats: async (district) => {
        const response = await axios.get(`${API_BASE_URL}/api/shelters/district/${district}/stats`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};
