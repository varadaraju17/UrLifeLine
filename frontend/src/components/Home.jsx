import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield,
    AlertTriangle,
    Activity,
    Map,
    ArrowRight,
    Heart,
    Phone,
    Users,
    Zap,
    Radio,
    LifeBuoy
} from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Hero Section */}
            <div className="relative z-10 text-center space-y-8 max-w-5xl mx-auto">
                {/* System Status Badge */}
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-lifeline border-primary-500/30 text-primary-400 font-mono text-sm tracking-wider animate-fade-in">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500 shadow-glow-sm"></span>
                    </span>
                    EMERGENCY RESPONSE SYSTEM ACTIVE
                </div>

                {/* Beating Heart Icon */}
                <div className="flex justify-center mb-8 animate-slide-up">
                    <div className="relative">
                        {/* Glow Ring */}
                        <div className="absolute inset-0 animate-glow-pulse">
                            <div className="w-32 h-32 rounded-full bg-primary-500/20 blur-2xl"></div>
                        </div>

                        {/* Heart Container */}
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <Heart
                                size={80}
                                className="text-primary-500 fill-primary-500/20 animate-heartbeat drop-shadow-glow-lg"
                                strokeWidth={2.5}
                            />
                            {/* ECG Line Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg width="120" height="40" className="absolute opacity-30">
                                    <path
                                        d="M0 20 L 15 20 L 20 10 L 25 25 L 30 18 L 35 20 L 120 20"
                                        stroke="#22d3ee"
                                        strokeWidth="2"
                                        fill="none"
                                        className="animate-pulse-fast"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Heading */}
                <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400 mb-2">
                            UrLifeLine
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400">
                            Every Second Counts
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
                        Real-time emergency response coordination system connecting citizens,
                        officers, and rescue teams for rapid disaster management.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <button
                        onClick={() => navigate('/login')}
                        className="group px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white rounded-2xl font-bold text-lg shadow-glow-md hover:shadow-glow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                    >
                        Access Emergency Portal
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="group px-10 py-5 bg-white/5 hover:bg-white/10 border-2 border-primary-500/50 hover:border-primary-400 text-white rounded-2xl font-bold text-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                    >
                        <AlertTriangle className="text-accent-400 animate-pulse-fast" size={24} />
                        Report Emergency
                    </button>
                </div>
            </div>

            {/* Emergency Services Grid */}
            <div className="relative z-10 mt-32 w-full max-w-7xl">
                <h2 className="text-center text-3xl font-bold text-white mb-12 animate-fade-in">
                    24/7 Emergency Services
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ServiceCard
                        icon={<Phone className="text-primary-400" size={32} />}
                        title="Fire & Rescue"
                        description="Rapid response fire brigade and rescue operations"
                        color="from-primary-500/10"
                        delay="0s"
                    />
                    <ServiceCard
                        icon={<Heart className="text-secondary-400 fill-secondary-400/20" size={32} />}
                        title="Medical Emergency"
                        description="Advanced life support and critical care ambulances"
                        color="from-secondary-500/10"
                        delay="0.1s"
                        highlighted
                    />
                    <ServiceCard
                        icon={<Shield className="text-accent-400" size={32} />}
                        title="Security & Police"
                        description="Law enforcement and public safety response"
                        color="from-accent-500/10"
                        delay="0.2s"
                    />
                </div>
            </div>

            {/* Live Stats */}
            <div className="relative z-10 mt-24 grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl">
                <StatCard
                    icon={<Activity className="text-success-400" />}
                    label="Response Time"
                    value="< 90s"
                    sub="Average Dispatch"
                />
                <StatCard
                    icon={<Map className="text-secondary-400" />}
                    label="Active Zones"
                    value="750+"
                    sub="Districts Covered"
                />
                <StatCard
                    icon={<Users className="text-accent-400" />}
                    label="Response Teams"
                    value="1,200+"
                    sub="Emergency Units"
                />
                <StatCard
                    icon={<Zap className="text-primary-400" />}
                    label="Lives Saved"
                    value="24/7"
                    sub="Always Active"
                />
            </div>
        </div>
    );
};

// Service Card Component
const ServiceCard = ({ icon, title, description, color, delay, highlighted }) => (
    <div
        className={`group relative animate-slide-up ${highlighted ? 'md:scale-110' : ''}`}
        style={{ animationDelay: delay }}
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50 group-hover:opacity-100`}></div>
        <div className={`relative glass-lifeline p-8 rounded-3xl hover:border-white/20 transition-all duration-300 h-full ${highlighted ? 'border-primary-500/50' : ''}`}>
            <div className={`mb-6 ${highlighted ? 'animate-heartbeat' : ''}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>

            {highlighted && (
                <div className="mt-4 flex items-center gap-2 text-primary-400 text-sm font-bold">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-ping"></div>
                    Primary Response
                </div>
            )}
        </div>
    </div>
);

// Stat Card Component
const StatCard = ({ icon, label, value, sub }) => (
    <div className="group glass-lifeline p-6 rounded-2xl hover:border-primary-500/30 hover:shadow-glow-md transition-all duration-300 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</div>
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
        <div className="text-4xl font-bold text-white mb-1">{value}</div>
        <div className="text-slate-500 text-sm">{sub}</div>
    </div>
);

export default Home;
