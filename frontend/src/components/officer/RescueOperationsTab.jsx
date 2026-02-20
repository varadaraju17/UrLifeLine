import React, { useState, useEffect } from 'react';
import { rescueRequestService, emergencyTeamService, volunteerService } from '../../services/rescueService';
import './RescueOperationsTab.css';

const RescueOperationsTab = ({ userDistrict }) => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('PENDING');
    const [stats, setStats] = useState({ totalRequests: 0, pendingRequests: 0 });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);

    const statusOptions = ['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

    useEffect(() => {
        loadRequests();
        loadStats();
    }, [userDistrict]);

    useEffect(() => {
        if (filterStatus === 'ALL') {
            setFilteredRequests(requests);
        } else {
            setFilteredRequests(requests.filter(req => req.status === filterStatus));
        }
    }, [filterStatus, requests]);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await rescueRequestService.getRequestsByDistrict(userDistrict);
            setRequests(data);
            setFilteredRequests(data.filter(req => req.status === 'PENDING'));
        } catch (error) {
            console.error('Error loading requests:', error);
            alert('Failed to load rescue requests');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const data = await rescueRequestService.getDistrictStats(userDistrict);
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const getUrgencyColor = (level) => {
        switch (level) {
            case 'CRITICAL': return '#ef4444';
            case 'HIGH': return '#f59e0b';
            case 'MEDIUM': return '#eab308';
            case 'LOW': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#f59e0b';
            case 'ASSIGNED': return '#3b82f6';
            case 'IN_PROGRESS': return '#8b5cf6';
            case 'COMPLETED': return '#10b981';
            case 'CANCELLED': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const handleAssignClick = (request) => {
        setSelectedRequest(request);
        setShowAssignModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="loading-container">Loading rescue requests...</div>;
    }

    return (
        <div className="rescue-operations-tab">
            <div className="operations-header">
                <div className="header-content">
                    <h2>Rescue Operations - {userDistrict}</h2>
                    <div className="stats-row">
                        <div className="stat-card">
                            <span className="stat-label">Total Requests</span>
                            <span className="stat-value">{stats.totalRequests}</span>
                        </div>
                        <div className="stat-card pending">
                            <span className="stat-label">Pending</span>
                            <span className="stat-value">{stats.pendingRequests}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="filter-section">
                <label>Filter by Status:</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            <div className="requests-list">
                {filteredRequests.length === 0 ? (
                    <div className="no-requests">
                        <p>No {filterStatus.toLowerCase()} rescue requests in {userDistrict}</p>
                    </div>
                ) : (
                    filteredRequests.map(request => (
                        <div key={request.id} className="request-card">
                            <div className="request-header">
                                <div className="request-badges">
                                    <span
                                        className="urgency-badge"
                                        style={{ backgroundColor: getUrgencyColor(request.urgencyLevel) }}
                                    >
                                        {request.urgencyLevel}
                                    </span>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(request.status) }}
                                    >
                                        {request.status}
                                    </span>
                                </div>
                                <span className="request-id">#{request.id}</span>
                            </div>

                            <div className="request-body">
                                <div className="request-info">
                                    <div className="info-row">
                                        <span className="icon">👤</span>
                                        <div>
                                            <span className="label">Citizen:</span>
                                            <span className="value">{request.citizen?.name || 'Unknown'}</span>
                                        </div>
                                    </div>

                                    <div className="info-row">
                                        <span className="icon">📍</span>
                                        <div>
                                            <span className="label">Location:</span>
                                            <span className="value">{request.location}</span>
                                        </div>
                                    </div>

                                    <div className="info-row">
                                        <span className="icon">👥</span>
                                        <div>
                                            <span className="label">People:</span>
                                            <span className="value">{request.numberOfPeople}</span>
                                        </div>
                                    </div>

                                    {request.specialNeeds && (
                                        <div className="info-row">
                                            <span className="icon">⚠️</span>
                                            <div>
                                                <span className="label">Special Needs:</span>
                                                <span className="value">{request.specialNeeds}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="info-row">
                                        <span className="icon">🕐</span>
                                        <div>
                                            <span className="label">Requested:</span>
                                            <span className="value">{formatDate(request.createdAt)}</span>
                                        </div>
                                    </div>

                                    {request.description && (
                                        <div className="description">
                                            <strong>Description:</strong>
                                            <p>{request.description}</p>
                                        </div>
                                    )}
                                </div>

                                {request.status === 'PENDING' && (
                                    <div className="request-actions">
                                        <button
                                            className="btn-assign"
                                            onClick={() => handleAssignClick(request)}
                                        >
                                            Assign Teams & Volunteers
                                        </button>
                                    </div>
                                )}

                                {request.status !== 'PENDING' && request.assignedOfficer && (
                                    <div className="assignment-info">
                                        <p><strong>Assigned to:</strong> {request.assignedOfficer.name}</p>
                                        {request.respondedAt && (
                                            <p><strong>Responded at:</strong> {formatDate(request.respondedAt)}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showAssignModal && selectedRequest && (
                <AssignModal
                    request={selectedRequest}
                    district={userDistrict}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedRequest(null);
                    }}
                    onSuccess={() => {
                        loadRequests();
                        loadStats();
                        setShowAssignModal(false);
                        setSelectedRequest(null);
                    }}
                />
            )}
        </div>
    );
};

const AssignModal = ({ request, district, onClose, onSuccess }) => {
    const [teams, setTeams] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedVolunteers, setSelectedVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [district]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [teamsData, volunteersData] = await Promise.all([
                emergencyTeamService.getAvailableTeams(district),
                volunteerService.getVolunteersByDistrict(district)
            ]);
            setTeams(teamsData);
            setVolunteers(volunteersData);
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Failed to load teams and volunteers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedTeams.length === 0 && selectedVolunteers.length === 0) {
            alert('Please select at least one team or volunteer');
            return;
        }

        try {
            const assignmentData = {
                teamIds: selectedTeams.join(','),
                volunteerIds: selectedVolunteers.join(',')
            };

            await rescueRequestService.assignRequest(request.id, assignmentData);
            alert('Teams and volunteers assigned successfully!');
            onSuccess();
        } catch (error) {
            console.error('Error assigning:', error);
            alert('Failed to assign teams and volunteers');
        }
    };

    const toggleTeam = (teamId) => {
        setSelectedTeams(prev =>
            prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]
        );
    };

    const toggleVolunteer = (volunteerId) => {
        setSelectedVolunteers(prev =>
            prev.includes(volunteerId)
                ? prev.filter(id => id !== volunteerId)
                : [...prev, volunteerId]
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Assign Teams & Volunteers</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="request-summary">
                        <h3>Request #{request.id}</h3>
                        <p><strong>Location:</strong> {request.location}</p>
                        <p><strong>People:</strong> {request.numberOfPeople}</p>
                        <p><strong>Urgency:</strong> {request.urgencyLevel}</p>
                    </div>

                    {loading ? (
                        <div className="loading">Loading available resources...</div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="selection-section">
                                <h3>Available Emergency Teams ({teams.length})</h3>
                                <div className="selection-grid">
                                    {teams.length === 0 ? (
                                        <p className="no-items">No available teams</p>
                                    ) : (
                                        teams.map(team => (
                                            <label key={team.id} className="selection-item">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTeams.includes(team.id)}
                                                    onChange={() => toggleTeam(team.id)}
                                                />
                                                <div className="item-info">
                                                    <span className="item-name">{team.teamName}</span>
                                                    <span className="item-type">{team.teamType}</span>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="selection-section">
                                <h3>Available Volunteers ({volunteers.length})</h3>
                                <div className="selection-grid">
                                    {volunteers.length === 0 ? (
                                        <p className="no-items">No available volunteers</p>
                                    ) : (
                                        volunteers.map(volunteer => (
                                            <label key={volunteer.id} className="selection-item">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedVolunteers.includes(volunteer.id)}
                                                    onChange={() => toggleVolunteer(volunteer.id)}
                                                />
                                                <div className="item-info">
                                                    <span className="item-name">{volunteer.name}</span>
                                                    <span className="item-skills">{volunteer.volunteerSkills || 'No skills listed'}</span>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                                <button type="submit" className="btn-submit">
                                    Assign & Notify ({selectedTeams.length + selectedVolunteers.length} selected)
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RescueOperationsTab;
