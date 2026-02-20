import React, { useState, useEffect } from 'react';
import { rescueRequestService } from '../../services/rescueService';
import { Clock, MapPin, Users, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import './MyRescueRequests.css';

const MyRescueRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await rescueRequestService.getMyRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error loading requests:', error);
            alert('Failed to load your rescue requests');
        } finally {
            setLoading(false);
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <Clock size={18} />;
            case 'ASSIGNED': return <AlertCircle size={18} />;
            case 'IN_PROGRESS': return <AlertCircle size={18} />;
            case 'COMPLETED': return <CheckCircle size={18} />;
            case 'CANCELLED': return <XCircle size={18} />;
            default: return <Clock size={18} />;
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
        return <div className="loading-container">Loading your rescue requests...</div>;
    }

    return (
        <div className="my-requests-container">
            <div className="requests-header">
                <h2>My Rescue Requests</h2>
                <p>Track the status of your emergency rescue requests</p>
            </div>

            {requests.length === 0 ? (
                <div className="no-requests">
                    <AlertCircle size={48} className="no-requests-icon" />
                    <h3>No Rescue Requests</h3>
                    <p>You haven't submitted any rescue requests yet</p>
                </div>
            ) : (
                <div className="requests-list">
                    {requests.map(request => (
                        <div key={request.id} className="request-card">
                            <div className="request-card-header">
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
                                        {getStatusIcon(request.status)}
                                        {request.status}
                                    </span>
                                </div>
                                <span className="request-id">#{request.id}</span>
                            </div>

                            <div className="request-card-body">
                                <div className="request-detail">
                                    <MapPin size={18} className="detail-icon" />
                                    <div>
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{request.location}</span>
                                    </div>
                                </div>

                                <div className="request-detail">
                                    <Users size={18} className="detail-icon" />
                                    <div>
                                        <span className="detail-label">People:</span>
                                        <span className="detail-value">{request.numberOfPeople}</span>
                                    </div>
                                </div>

                                <div className="request-detail">
                                    <Clock size={18} className="detail-icon" />
                                    <div>
                                        <span className="detail-label">Submitted:</span>
                                        <span className="detail-value">{formatDate(request.createdAt)}</span>
                                    </div>
                                </div>

                                {request.description && (
                                    <div className="request-description">
                                        <strong>Description:</strong>
                                        <p>{request.description}</p>
                                    </div>
                                )}

                                {request.specialNeeds && (
                                    <div className="request-special-needs">
                                        <strong>Special Needs:</strong>
                                        <p>{request.specialNeeds}</p>
                                    </div>
                                )}

                                {/* Status Timeline */}
                                <div className="status-timeline">
                                    <div className={`timeline-step ${request.status !== 'CANCELLED' ? 'completed' : ''}`}>
                                        <div className="timeline-dot" />
                                        <div className="timeline-content">
                                            <div className="timeline-title">Submitted</div>
                                            <div className="timeline-date">{formatDate(request.createdAt)}</div>
                                        </div>
                                    </div>

                                    <div className={`timeline-step ${['ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].includes(request.status) ? 'completed' : ''}`}>
                                        <div className="timeline-dot" />
                                        <div className="timeline-content">
                                            <div className="timeline-title">Assigned</div>
                                            {request.respondedAt && (
                                                <div className="timeline-date">{formatDate(request.respondedAt)}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`timeline-step ${['IN_PROGRESS', 'COMPLETED'].includes(request.status) ? 'completed' : ''}`}>
                                        <div className="timeline-dot" />
                                        <div className="timeline-content">
                                            <div className="timeline-title">In Progress</div>
                                        </div>
                                    </div>

                                    <div className={`timeline-step ${request.status === 'COMPLETED' ? 'completed' : ''}`}>
                                        <div className="timeline-dot" />
                                        <div className="timeline-content">
                                            <div className="timeline-title">Completed</div>
                                        </div>
                                    </div>
                                </div>

                                {request.assignedOfficer && (
                                    <div className="assigned-officer">
                                        <strong>Assigned Officer:</strong>
                                        <p>{request.assignedOfficer.name}</p>
                                        {request.assignedOfficer.phone && (
                                            <p className="officer-contact">📞 {request.assignedOfficer.phone}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRescueRequests;
