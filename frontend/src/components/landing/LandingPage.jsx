import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Phone, AlertTriangle, ArrowRight, Activity, Users, Map } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">SENTINEL</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-slate-600 font-medium hover:text-blue-600 transition"
                        >
                            Log In
                        </button>
                        <button
                            className="hidden md:flex bg-red-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition items-center gap-2"
                        >
                            <Phone size={18} />
                            Emergency: 112
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-16 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-fade-in">
                            <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                                ● National Disaster Response Network
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
                                Help when you <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">need it most.</span>
                            </h1>
                            <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
                                Sentinel connects citizens with rapid response teams in real-time. Report incidents, find shelter, and stay safe.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="flex-1 sm:flex-none bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition flex items-center justify-center gap-2">
                                    <AlertTriangle />
                                    Report Disaster
                                </button>
                                <button className="flex-1 sm:flex-none bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-blue-200 hover:bg-blue-50 transition flex items-center justify-center gap-2">
                                    <Activity />
                                    Am I Safe?
                                </button>
                            </div>

                            <div className="pt-8 flex items-center gap-4 text-sm text-slate-400 font-medium">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                                    ))}
                                </div>
                                <span>Trusted by 10M+ Citizens</span>
                            </div>
                        </div>

                        {/* Visual / Graphic */}
                        <div className="relative hidden lg:block">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-cyan-50 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
                            <img
                                src="https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop"
                                alt="Rescue"
                                className="relative rounded-3xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition duration-500 object-cover h-[600px] w-full"
                            />

                            {/* Floating Cards */}
                            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase">Responders Active</p>
                                        <p className="text-2xl font-bold text-slate-900">1,248</p>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 w-[85%] h-full rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features (Grid) */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Map className="text-blue-600" size={32} />}
                            title="Live Situation Map"
                            desc="Real-time tracking of affected zones, safe shelters, and response unit locations."
                        />
                        <FeatureCard
                            icon={<Phone className="text-blue-600" size={32} />}
                            title="Instant SOS"
                            desc="One-tap emergency signaling that shares your precise location with nearest rescue teams."
                        />
                        <FeatureCard
                            icon={<Shield className="text-blue-600" size={32} />}
                            title="Verified Alerts"
                            desc="Direct notifications from government authorities. No rumors, just facts."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
        <div className="mb-6">{icon}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
