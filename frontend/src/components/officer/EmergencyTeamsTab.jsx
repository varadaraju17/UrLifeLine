import React, { useState, useEffect } from 'react';
import { emergencyTeamService } from '../../services/rescueService';
import './EmergencyTeamsTab.css';

const EmergencyTeamsTab = ({ userDistrict }) => {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterType, setFilterType] = useState('ALL');
    const [stats, setStats] = useState({ totalTeams: 0, availableTeams: 0 });

    const teamTypes = ['ALL', 'AMBULANCE', 'FIRE', 'NDRF', 'POLICE', 'MEDICAL', 'SEARCH_RESCUE', 'CIVIL_DEFENSE', 'OTHER'];
    const teamStatuses = ['AVAILABLE', 'DEPLOYED', 'UNAVAILABLE', 'MAINTENANCE'];

    useEffect(() => {
        loadTeams();
        loadStats();
    }, [userDistrict]);

    useEffect(() => {
        if (filterType === 'ALL') {
            setFilteredTeams(teams);
        } else {
            setFilteredTeams(teams.filter(team => team.teamType === filterType));
        }
    }, [filterType, teams]);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const data = await emergencyTeamService.getTeamsByDistrict(userDistrict);
            setTeams(data);
            setFilteredTeams(data);
        } catch (error) {
            console.error('Error loading teams:', error);
            alert('Failed to load emergency teams');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const data = await emergencyTeamService.getDistrictStats(userDistrict);
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleStatusChange = async (teamId, newStatus) => {
        try {
            await emergencyTeamService.updateTeamStatus(teamId, newStatus);
            loadTeams();
            loadStats();
            alert('Team status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update team status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE': return '#10b981';
            case 'DEPLOYED': return '#f59e0b';
            case 'UNAVAILABLE': return '#ef4444';
            case 'MAINTENANCE': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getTeamTypeIcon = (type) => {
        switch (type) {
            case 'AMBULANCE': return '🚑';
            case 'FIRE': return '🚒';
            case 'NDRF': return '🛡️';
            case 'POLICE': return '🚓';
            case 'MEDICAL': return '⚕️';
            case 'SEARCH_RESCUE': return '🔍';
            case 'CIVIL_DEFENSE': return '🏛️';
            default: return '🚨';
        }
    };

    if (loading) {
        return <div className="loading-container">Loading emergency teams...</div>;
    }

    return (
        <div className="emergency-teams-tab">
            <div className="teams-header">
                <div className="header-content">
                    <h2>Emergency Teams - {userDistrict}</h2>
                    <div className="stats-row">
                        <div className="stat-card">
                            <span className="stat-label">Total Teams</span>
                            <span className="stat-value">{stats.totalTeams}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Available</span>
                            <span className="stat-value available">{stats.availableTeams}</span>
                        </div>
                    </div>
                </div>
                <button className="btn-add" onClick={() => setShowAddModal(true)}>
                    + Add Team
                </button>
            </div>

            <div className="filter-section">
                <label>Filter by Type:</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    {teamTypes.map(type => (
                        <option key={type} value={type}>{type.replace('_', ' ')}</option>
                    ))}
                </select>
            </div>

            <div className="teams-grid">
                {filteredTeams.length === 0 ? (
                    <div className="no-teams">
                        <p>No emergency teams found for {userDistrict}</p>
                        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                            Add First Team
                        </button>
                    </div>
                ) : (
                    filteredTeams.map(team => (
                        <div key={team.id} className="team-card">
                            <div className="team-header">
                                <div className="team-icon">{getTeamTypeIcon(team.teamType)}</div>
                                <div className="team-info">
                                    <h3>{team.teamName}</h3>
                                    <span className="team-type">{team.teamType.replace('_', ' ')}</span>
                                </div>
                                <div
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(team.status) }}
                                >
                                    {team.status}
                                </div>
                            </div>

                            <div className="team-details">
                                <div className="detail-row">
                                    <span className="label">Contact Person:</span>
                                    <span className="value">{team.contactPerson}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Phone:</span>
                                    <span className="value">{team.phoneNumber}</span>
                                </div>
                                {team.email && (
                                    <div className="detail-row">
                                        <span className="label">Email:</span>
                                        <span className="value">{team.email}</span>
                                    </div>
                                )}
                                <div className="detail-row">
                                    <span className="label">Base Location:</span>
                                    <span className="value">{team.baseLocation}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Vehicles:</span>
                                    <span className="value">{team.vehicleCount || 0}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Personnel:</span>
                                    <span className="value">{team.personnelCount || 0}</span>
                                </div>
                            </div>

                            <div className="team-actions">
                                <select
                                    className="status-select"
                                    value={team.status}
                                    onChange={(e) => handleStatusChange(team.id, e.target.value)}
                                >
                                    {teamStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <button className="btn-alert">Alert Team</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showAddModal && (
                <AddTeamModal
                    district={userDistrict}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        loadTeams();
                        loadStats();
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
};

const AddTeamModal = ({ district, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        teamName: '',
        teamType: 'AMBULANCE',
        district: district,
        contactPerson: '',
        phoneNumber: '',
        email: '',
        vehicleCount: 0,
        personnelCount: 0,
        baseLocation: '',
        latitude: null,
        longitude: null,
        notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await emergencyTeamService.createTeam(formData);
            alert('Team added successfully!');
            onSuccess();
        } catch (error) {
            console.error('Error adding team:', error);
            alert('Failed to add team');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'vehicleCount' || name === 'personnelCount' ? parseInt(value) || 0 : value
        }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Emergency Team</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="team-form">
                    <div className="form-group">
                        <label>Team Name *</label>
                        <input
                            type="text"
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Team Type *</label>
                        <select name="teamType" value={formData.teamType} onChange={handleChange} required>
                            <option value="AMBULANCE">Ambulance</option>
                            <option value="FIRE">Fire Brigade</option>
                            <option value="NDRF">NDRF</option>
                            <option value="POLICE">Police</option>
                            <option value="MEDICAL">Medical Team</option>
                            <option value="SEARCH_RESCUE">Search & Rescue</option>
                            <option value="CIVIL_DEFENSE">Civil Defense</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Contact Person *</label>
                            <input
                                type="text"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Vehicle Count</label>
                            <input
                                type="number"
                                name="vehicleCount"
                                value={formData.vehicleCount}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Personnel Count</label>
                            <input
                                type="number"
                                name="personnelCount"
                                value={formData.personnelCount}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Base Location *</label>
                        <input
                            type="text"
                            name="baseLocation"
                            value={formData.baseLocation}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">Add Team</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmergencyTeamsTab;
