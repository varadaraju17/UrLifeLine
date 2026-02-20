import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Flag, MapPin, Phone, Building, UserPlus, ArrowLeft, ArrowRight, Shield, Heart } from 'lucide-react';
import DropdownSelect from './UI/DropdownSelect';
import AuthService from '../services/auth.service';
import { motion } from 'framer-motion';

import { INDIAN_STATES_AND_DISTRICTS } from '../data/indian_states_districts';

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        state: '',
        district: '',
        location: '',
        isVolunteer: false,
        volunteerSkills: '',
        volunteerAvailability: ''
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await AuthService.register(
                formData.name,
                formData.email,
                formData.password,
                'citizen',
                formData.phone,
                formData.state,
                formData.district,
                formData.location,
                formData.isVolunteer,
                formData.volunteerSkills,
                formData.volunteerAvailability
            );
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'state' && { district: '' }) // Reset district when state changes
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl w-full"
            >
                {/* Back to Login */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm">Back to Login</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg shadow-purple-900/50 mb-4">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-slate-300 bg-clip-text text-transparent mb-2">
                        UrLifeLine
                    </h1>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Create Your Account
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Join the safety network and stay protected
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Registration Form */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                                        placeholder="Create a password"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* State Selection */}
                            <div>
                                <DropdownSelect
                                    label="State"
                                    options={Object.keys(INDIAN_STATES_AND_DISTRICTS).map(s => ({ value: s, label: s }))}
                                    value={formData.state}
                                    onChange={(val) => {
                                        setFormData(prev => ({ ...prev, state: val, district: '' }));
                                    }}
                                    placeholder="Select State"
                                    required
                                />
                            </div>

                            {/* District Selection */}
                            <div>
                                <DropdownSelect
                                    label="District"
                                    options={formData.state ? INDIAN_STATES_AND_DISTRICTS[formData.state].map(d => ({ value: d, label: d })) : []}
                                    value={formData.district}
                                    onChange={(val) => handleChange({ target: { name: 'district', value: val } })}
                                    placeholder={formData.state ? "Select District" : "Select State First"}
                                    required
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Address
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                                <textarea
                                    name="location"
                                    required
                                    rows="3"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 resize-none"
                                    placeholder="Enter your complete address"
                                />
                            </div>
                        </div>

                        {/* Volunteer Section */}
                        <div className="border-t border-white/10 pt-6">
                            <div className="flex items-start gap-3 mb-4">
                                <input
                                    type="checkbox"
                                    id="isVolunteer"
                                    checked={formData.isVolunteer}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isVolunteer: e.target.checked }))}
                                    className="mt-1 w-5 h-5 rounded border-white/20 bg-slate-800/50 text-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-0 cursor-pointer"
                                />
                                <label htmlFor="isVolunteer" className="flex-1 cursor-pointer">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Heart className="w-5 h-5 text-purple-400" />
                                        <span className="text-white font-semibold">I want to volunteer during disasters</span>
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        Help your community by volunteering for rescue and relief operations
                                    </p>
                                </label>
                            </div>

                            {formData.isVolunteer && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Your Skills
                                        </label>
                                        <input
                                            type="text"
                                            name="volunteerSkills"
                                            value={formData.volunteerSkills}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                                            placeholder="e.g., Medical, First Aid, Driving, Search & Rescue"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Your Availability
                                        </label>
                                        <input
                                            type="text"
                                            name="volunteerAvailability"
                                            value={formData.volunteerAvailability}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                                            placeholder="e.g., Weekends, Evenings, Anytime"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-900/50 hover:shadow-purple-900/70 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-slate-400 text-sm mb-2">
                            Already have an account?
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors"
                        >
                            Sign In Instead
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-500">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
