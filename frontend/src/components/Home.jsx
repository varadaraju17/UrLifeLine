import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, Activity, Map, ArrowRight, Zap } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8 max-w-4xl mx-auto animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-900/30 border border-primary-500/30 text-primary-300 font-mono text-xs tracking-wider">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                    SYSTEM ONLINE
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500">
                        Global Disaster
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                        Response Grid
                    </span>
                </h1>

                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Advanced situational awareness and rapid deployment coordination for integrated emergency management operations.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-900/50 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        Initialize System <ArrowRight size={20} />
                    </button>
                    <button className="px-8 py-4 bg-surface hover:bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                        <AlertTriangle className="text-danger" size={20} /> Report Incident
                    </button>
                </div>
            </div>

            {/* Grid Stats */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                <StatCard
                    icon={<Activity className="text-success" />}
                    label="Response Time"
                    value="< 90s"
                    sub="Average Dispatch"
                />
                <StatCard
                    icon={<Map className="text-accent-400" />}
                    label="Active Zones"
                    value="12"
                    sub="Monitoring"
                />
                <StatCard
                    icon={<Zap className="text-primary-400" />}
                    label="Units Deployed"
                    value="840"
                    sub="Global Network"
                />
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, sub }) => (
    <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
        <div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</div>
            <div className="text-3xl font-bold text-white mb-0.5">{value}</div>
            <div className="text-slate-500 text-xs">{sub}</div>
        </div>
        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            {icon}
        </div>
    </div>
);

export default Home;
