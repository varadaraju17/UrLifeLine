import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/rescueService';
import './VolunteersTab.css';

const VolunteersTab = ({ userDistrict }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ count: 0 });

    useEffect(() => {
        loadVolunteers();
        loadStats();
    }, [userDistrict]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredVolunteers(
                volunteers.filter(v =>
                    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (v.volunteerSkills && v.volunteerSkills.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );
        } else {
            setFilteredVolunteers(volunteers);
        }
    }, [searchTerm, volunteers]);

    const loadVolunteers = async () => {
        try {
            setLoading(true);
            const data = await volunteerService.getVolunteersByDistrict(userDistrict);
            setVolunteers(data);
            setFilteredVolunteers(data);
        } catch (error) {
            console.error('Error loading volunteers:', error);
            alert('Failed to load volunteers');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const data = await volunteerService.getVolunteerCount(userDistrict);
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleAlertVolunteer = (volunteer) => {
        alert(`Alert sent to ${volunteer.name}!\n\nThis feature will send notifications to volunteers for rescue missions.`);
    };

    const handleAlertAll = () => {
        if (volunteers.length === 0) {
            alert('No volunteers available to alert');
            return;
        }
        if (window.confirm(`Send alert to all ${volunteers.length} volunteers in ${userDistrict}?`)) {
            alert(`Alert sent to all ${volunteers.length} volunteers!`);
        }
    };

    if (loading) {
        return <div className="loading-container">Loading volunteers...</div>;
    }

    return (
        <div className="volunteers-tab">
            <div className="volunteers-header">
                <div className="header-content">
                    <h2>Volunteers - {userDistrict}</h2>
                    <div className="stats-row">
                        <div className="stat-card">
                            <span className="stat-label">Total Volunteers</span>
                            <span className="stat-value">{stats.count}</span>
                        </div>
                    </div>
                </div>
                <button className="btn-alert-all" onClick={handleAlertAll}>
                    📢 Alert All Volunteers
                </button>
            </div>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search by name or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="volunteers-grid">
                {filteredVolunteers.length === 0 ? (
                    <div className="no-volunteers">
                        <p>
                            {searchTerm
                                ? `No volunteers found matching "${searchTerm}"`
                                : `No volunteers registered in ${userDistrict} yet`
                            }
                        </p>
                    </div>
                ) : (
                    filteredVolunteers.map(volunteer => (
                        <div key={volunteer.id} className="volunteer-card">
                            <div className="volunteer-header">
                                <div className="volunteer-avatar">
                                    {volunteer.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="volunteer-info">
                                    <h3>{volunteer.name}</h3>
                                    <span className="volunteer-email">{volunteer.email}</span>
                                </div>
                            </div>

                            <div className="volunteer-details">
                                {volunteer.phone && (
                                    <div className="detail-row">
                                        <span className="label">📞 Phone:</span>
                                        <span className="value">{volunteer.phone}</span>
                                    </div>
                                )}

                                {volunteer.volunteerSkills && (
                                    <div className="detail-row">
                                        <span className="label">🎯 Skills:</span>
                                        <span className="value">{volunteer.volunteerSkills}</span>
                                    </div>
                                )}

                                {volunteer.volunteerAvailability && (
                                    <div className="detail-row">
                                        <span className="label">⏰ Availability:</span>
                                        <span className="value">{volunteer.volunteerAvailability}</span>
                                    </div>
                                )}

                                <div className="detail-row">
                                    <span className="label">📍 Location:</span>
                                    <span className="value">{volunteer.location || 'Not specified'}</span>
                                </div>
                            </div>

                            <div className="volunteer-actions">
                                <button
                                    className="btn-alert-volunteer"
                                    onClick={() => handleAlertVolunteer(volunteer)}
                                >
                                    Send Alert
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VolunteersTab;
