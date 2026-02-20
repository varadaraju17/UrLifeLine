import React, { useState, useEffect } from 'react';
import { rescueRequestService } from '../../services/rescueService';
import {
    AlertCircle,
    MapPin,
    Users,
    AlertTriangle,
    Send,
    Flame,
    Heart,
    Shield,
    Cloud,
    HelpCircle,
    Navigation
} from 'lucide-react';
import { INDIAN_STATES_AND_DISTRICTS } from '../../data/indian_states_districts';

const RequestRescue = ({ userLocation, userDistrict, userState }) => {
    const [formData, setFormData] = useState({
        location: userLocation || '',
        district: userDistrict || '',
        state: userState || '',
        rescueType: 'MEDICAL',
        latitude: null,
        longitude: null,
        urgencyLevel: 'MEDIUM',
        numberOfPeople: 1,
        specialNeeds: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [capturingLocation, setCapturingLocation] = useState(false);

    const rescueTypes = [
        { value: 'MEDICAL', label: 'Medical Emergency', icon: Heart, color: 'from-secondary-500 to-secondary-600' },
        { value: 'FIRE', label: 'Fire Emergency', icon: Flame, color: 'from-primary-500 to-primary-600' },
        { value: 'POLICE', label: 'Security/Police', icon: Shield, color: 'from-accent-500 to-accent-600' },
        { value: 'NATURAL_DISASTER', label: 'Natural Disaster', icon: Cloud, color: 'from-warning-500 to-yellow-600' },
        { value: 'OTHER', label: 'Other Emergency', icon: HelpCircle, color: 'from-slate-600 to-slate-700' }
    ];

    const urgencyLevels = [
        { value: 'LOW', label: 'Low', color: 'success-500', description: 'Non-urgent assistance' },
        { value: 'MEDIUM', label: 'Medium', color: 'warning-500', description: 'Moderate urgency' },
        { value: 'HIGH', label: 'High', color: 'accent-500', description: 'High priority' },
        { value: 'CRITICAL', label: 'Critical', color: 'danger-500', description: 'Life-threatening' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'numberOfPeople' ? parseInt(value) || 1 : value
        }));
    };

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setFormData(prev => ({
            ...prev,
            state: selectedState,
            district: '' // Reset district when state changes
        }));
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setCapturingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                    setCapturingLocation(false);
                    setError('');
                },
                (error) => {
                    setCapturingLocation(false);
                    setError('Unable to capture location. Please ensure location permissions are enabled.');
                }
            );
        } else {
            setError('Geolocation is not supported by your browser');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.district) {
            setError('Please select your district');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await rescueRequestService.createRequest(formData);
            setSuccess(true);
            setFormData({
                location: '',
                district: userDistrict || '',
                state: userState || '',
                rescueType: 'MEDICAL',
                latitude: null,
                longitude: null,
                urgencyLevel: 'MEDIUM',
                numberOfPeople: 1,
                specialNeeds: '',
                description: ''
            });

            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error('Error submitting rescue request:', err);
            setError(err.response?.data?.message || 'Failed to submit rescue request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const selectedRescueType = rescueTypes.find(r => r.value === formData.rescueType);
    const selectedUrgency = urgencyLevels.find(u => u.value === formData.urgencyLevel);
    const districts = formData.state ? INDIAN_STATES_AND_DISTRICTS[formData.state] : [];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="glass-lifeline p-6 rounded-2xl mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow-md animate-heartbeat">
                        <AlertCircle size={32} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">Request Rescue</h2>
                        <p className="text-slate-400">Emergency assistance will be dispatched immediately</p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="glass-lifeline p-4 rounded-xl mb-6 border-success-500/50 bg-success-500/10 animate-slide-down">
                    <div className="flex items-center gap-3 text-success-400">
                        <AlertCircle size={20} />
                        <span className="font-semibold">Rescue request submitted successfully! Officers in {formData.district} have been notified.</span>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="glass-lifeline p-4 rounded-xl mb-6 border-danger-500/50 bg-danger-500/10 animate-slide-down">
                    <div className="flex items-center gap-3 text-danger-400">
                        <AlertTriangle size={20} />
                        <span className="font-semibold">{error}</span>
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rescue Type Selection */}
                <div className="glass-lifeline p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertCircle size={20} className="text-primary-400" />
                        Emergency Type *
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {rescueTypes.map(type => {
                            const Icon = type.icon;
                            const isSelected = formData.rescueType === type.value;
                            return (
                                <label
                                    key={type.value}
                                    className={`relative cursor-pointer group`}
                                >
                                    <input
                                        type="radio"
                                        name="rescueType"
                                        value={type.value}
                                        checked={isSelected}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`glass-card p-4 rounded-xl transition-all duration-300 ${isSelected ? 'border-2 scale-105 shadow-glow-md' : 'border border-white/10 hover:border-white/30'
                                        }`}>
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3 ${isSelected ? 'animate-heartbeat' : ''}`}>
                                            <Icon size={24} className="text-white" />
                                        </div>
                                        <div className="text-sm font-bold text-white">{type.label}</div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Location & District */}
                <div className="glass-lifeline p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <MapPin size={20} className="text-secondary-400" />
                        Location Information *
                    </h3>

                    {/* State & District Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">State *</label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleStateChange}
                                required
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:border-secondary-400 focus:outline-none transition-colors"
                            >
                                <option value="">Select State</option>
                                {Object.keys(INDIAN_STATES_AND_DISTRICTS).map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">District *</label>
                            <select
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                required
                                disabled={!formData.state}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:border-secondary-400 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Select District</option>
                                {districts.map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Location Address */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Detailed Location *</label>
                        <textarea
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            rows="2"
                            placeholder="Enter street address, landmark, or description of your location"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-secondary-400 focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* GPS Capture */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={capturingLocation}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl font-bold hover:shadow-cyan-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {capturingLocation ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Capturing...
                                </>
                            ) : (
                                <>
                                    <Navigation size={18} />
                                    Capture GPS Location
                                </>
                            )}
                        </button>
                        {formData.latitude && formData.longitude && (
                            <span className="text-sm text-success-400 font-mono flex items-center gap-2">
                                <MapPin size={16} />
                                {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Urgency Level */}
                <div className="glass-lifeline p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Urgency Level *</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {urgencyLevels.map(level => {
                            const isSelected = formData.urgencyLevel === level.value;
                            return (
                                <label
                                    key={level.value}
                                    className="cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="urgencyLevel"
                                        value={level.value}
                                        checked={isSelected}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`glass-card p-4 rounded-xl text-center transition-all duration-300 ${isSelected ? `border-${level.color} border-2 scale-105` : 'border border-white/10 hover:border-white/30'
                                        } ${isSelected && level.value === 'CRITICAL' ? 'animate-heartbeat' : ''}`}>
                                        <div className={`w-3 h-3 rounded-full bg-${level.color} mx-auto mb-2`}></div>
                                        <div className="font-bold text-white text-sm mb-1">{level.label}</div>
                                        <div className="text-xs text-slate-400">{level.description}</div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* People & Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Number of People */}
                    <div className="glass-lifeline p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Users size={20} className="text-accent-400" />
                            People Affected *
                        </h3>
                        <input
                            type="number"
                            name="numberOfPeople"
                            value={formData.numberOfPeople}
                            onChange={handleChange}
                            min="1"
                            required
                            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white text-center text-2xl font-bold focus:border-accent-400 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Special Needs */}
                    <div className="glass-lifeline p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Special Needs</h3>
                        <input
                            type="text"
                            name="specialNeeds"
                            value={formData.specialNeeds}
                            onChange={handleChange}
                            placeholder="Elderly, Children, Medical, Pets..."
                            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-accent-400 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="glass-lifeline p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Situation Description *</h3>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Describe the emergency situation in detail..."
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-primary-400 focus:outline-none transition-colors resize-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !formData.district}
                    className={`w-full py-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 flex items-center justify-center gap-3 ${selectedUrgency?.value === 'CRITICAL'
                            ? 'bg-gradient-to-r from-danger-500 to-danger-600 shadow-glow-lg animate-pulse-fast'
                            : 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-glow-md hover:shadow-glow-lg hover:scale-105'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? (
                        <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting Emergency Request...
                        </>
                    ) : (
                        <>
                            <Send size={24} />
                            Submit Rescue Request
                        </>
                    )}
                </button>

                <p className="text-center text-sm text-slate-400 font-mono">
                    * Required fields • Request will be sent to officers in {formData.district || 'selected district'}
                </p>
            </form>
        </div>
    );
};

export default RequestRescue;
