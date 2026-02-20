import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/`;

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to automatically add auth token
axios.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            }
        } catch (error) {
            console.error("Error parsing user token:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data?.error || error.message;

            if (status === 401) {
                console.error('Unauthorized: Invalid credentials or token expired');
                // Only clear and redirect if not already on login/register page
                // This prevents redirect loops during login
                if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                    localStorage.removeItem("user");
                    window.dispatchEvent(new Event('storage'));
                    window.location.href = '/login';
                }
            } else if (status === 403) {
                console.error('Forbidden: Access denied');
            } else if (status === 404) {
                console.error('Not Found: API endpoint not found');
            } else if (status >= 500) {
                console.error('Server Error: Please try again later');
            }

            return Promise.reject({
                ...error,
                message: message || `Request failed with status ${status}`
            });
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error: Unable to connect to server. Please check if the backend is running.');
            return Promise.reject({
                ...error,
                message: 'Network Error: Unable to connect to server. Please check if the backend is running on http://localhost:8080'
            });
        } else {
            // Something else happened
            console.error('Error:', error.message);
            return Promise.reject({
                ...error,
                message: error.message || 'An unexpected error occurred'
            });
        }
    }
);

const register = (name, email, password, role, phone, state, district, location, isVolunteer, volunteerSkills, volunteerAvailability) => {
    return axios.post(API_URL + "signup", {
        name,
        email,
        password,
        role,
        phone,
        state,
        district,
        location,
        isVolunteer,
        volunteerSkills,
        volunteerAvailability
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch((error) => {
        throw error;
    });
};

const login = (email, password) => {
    return axios
        .post(API_URL + "signin", {
            email,
            password,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (response.data && response.data.token) {
                // Store user data with role information
                const userData = {
                    ...response.data,
                    // Ensure full roles array is stored
                    roles: response.data.roles || [],
                    // Set primary role for convenience (fallback to first role or CITIZEN)
                    role: (response.data.roles && response.data.roles.length > 0)
                        ? response.data.roles[0]
                        : 'ROLE_CITIZEN'
                };
                localStorage.setItem("user", JSON.stringify(userData));
                // Trigger custom event to update App.jsx
                window.dispatchEvent(new Event('authChange'));
            }

            return response.data;
        })
        .catch((error) => {
            throw error;
        });
};

const logout = () => {
    localStorage.removeItem("user");
    // Trigger custom event to update App.jsx
    window.dispatchEvent(new Event('authChange'));
};

const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        const user = JSON.parse(userStr);
        // Validate that user has required fields
        if (user && user.token) {
            return user;
        }
        return null;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
