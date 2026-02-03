import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [disasters, setDisasters] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = () => {
            const currentUser = AuthService.getCurrentUser();
            
            if (!currentUser || !currentUser.token) {
                // Only redirect if we're sure there's no user (not just loading)
                setTimeout(() => {
                    const retryUser = AuthService.getCurrentUser();
                    if (!retryUser || !retryUser.token) {
                        navigate('/login', { replace: true });
                    } else {
                        setUser(retryUser);
                        fetchDisasters();
                    }
                }, 500);
                return;
            }
            
            setUser(currentUser);
            fetchDisasters();
        };

        const fetchDisasters = async () => {
            try {
                // Token is automatically added by axios interceptor
                const response = await axios.get("http://localhost:8080/api/disasters/active");
                setDisasters(response.data || []);
            } catch (error) {
                console.error("Error fetching disasters:", error);
                // Don't redirect on 401 if it's just a data fetch issue
                // The interceptor will handle authentication errors
            }
        };

        // Check immediately
        checkUser();
        
        // Also listen for auth changes
        const handleAuthChange = () => {
            const currentUser = AuthService.getCurrentUser();
            if (currentUser && currentUser.token) {
                setUser(currentUser);
            }
        };
        
        window.addEventListener('authChange', handleAuthChange);
        
        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, [navigate]);

    const renderRoleSpecificContent = () => {
        if (!user) return null;

        const isAdmin = user.role === 'ROLE_ADMIN';
        const isOfficer = user.role === 'ROLE_OFFICER';
        const isCitizen = user.role === 'ROLE_CITIZEN';

        if (isAdmin) {
            return (
                <div className="mt-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <QuickActionCard 
                            title="Create Officer" 
                            icon="👮" 
                            onClick={() => navigate('/admin/create-officer')}
                        />
                        <QuickActionCard 
                            title="Create Disaster" 
                            icon="🌪️" 
                            onClick={() => navigate('/admin/create-disaster')}
                        />
                        <QuickActionCard 
                            title="Create Tasks" 
                            icon="✓" 
                            onClick={() => navigate('/admin/tasks')}
                        />
                        <QuickActionCard 
                            title="Manage Resources" 
                            icon="📦" 
                            onClick={() => navigate('/admin/resources')}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficer) {
            return (
                <div className="mt-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        <QuickActionCard 
                            title="My Tasks" 
                            icon="📋" 
                            onClick={() => navigate('/officer/tasks')}
                        />
                        <QuickActionCard 
                            title="Update Affected Areas" 
                            icon="🗺️" 
                            onClick={() => navigate('/officer/affected-areas')}
                        />
                        <QuickActionCard 
                            title="Shelters & Resources" 
                            icon="🏠" 
                            onClick={() => navigate('/officer/shelters')}
                        />
                    </div>
                </div>
            );
        }

        if (isCitizen) {
            return (
                <div className="mt-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        <QuickActionCard 
                            title="View Alerts" 
                            icon="🔔" 
                            onClick={() => navigate('/citizen/alerts')}
                        />
                        <QuickActionCard 
                            title="Find Shelters" 
                            icon="🏠" 
                            onClick={() => navigate('/citizen/shelters')}
                        />
                        <QuickActionCard 
                            title="Raise Query" 
                            icon="❓" 
                            onClick={() => navigate('/citizen/query')}
                        />
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 text-gray-200">
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome, {user ? user.name || user.email : 'Guest'}!
                </h1>
                <p className="text-gray-400">Role: {user ? user.role : 'N/A'}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="surface p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-white">🌍 Active Disasters</h2>
                    {disasters.length > 0 ? (
                        <ul className="space-y-3">
                            {disasters.map(disaster => (
                                <li key={disaster.id} className="p-3 bg-red-500/20 rounded border-l-4 border-red-500">
                                    <div className="font-medium text-white">{disaster.type}</div>
                                    <div className="text-sm text-gray-300">{disaster.region} - Severity: {disaster.severity}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No active disasters at the moment.</p>
                    )}
                </div>

                <div className="surface p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-white">📊 System Status</h2>
                    <div className="space-y-2 text-gray-300">
                        <div className="flex justify-between pb-2 border-b border-gray-600">
                            <span>Active Officers:</span> <span className="font-bold text-green-400">--</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-gray-600">
                            <span>Pending Queries:</span> <span className="font-bold text-yellow-400">--</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-gray-600">
                            <span>Shelters Active:</span> <span className="font-bold text-blue-400">--</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Resources Deployed:</span> <span className="font-bold text-purple-400">--</span>
                        </div>
                    </div>
                </div>
            </div>

            {renderRoleSpecificContent()}
        </div>
    );
};

const QuickActionCard = ({ title, icon, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="surface p-4 rounded-lg cursor-pointer hover:bg-opacity-80 transition transform hover:scale-105"
        >
            <div className="text-3xl mb-2">{icon}</div>
            <p className="text-white font-semibold text-sm">{title}</p>
        </div>
    );
};

export default Dashboard;
