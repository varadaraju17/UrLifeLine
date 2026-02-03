import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../services/auth.service';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Map as MapIcon,
  Home,
  HelpCircle,
  AlertTriangle,
  Phone,
  Shield,
  Navigation,
  Search,
  CheckCircle,
  Clock,
  LogOut,
  X,
  Send
} from 'lucide-react';
import MapComponent from './MapComponent';

const CitizenDashboard = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [data, setData] = useState({
    disasters: [],
    alerts: [],
    shelters: [],
    queries: [],
    areas: []
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Form State
  const [queryForm, setQueryForm] = useState({
    subject: '',
    message: '',
    category: 'GENERAL',
    location: '',
    district: '',
    state: ''
  });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) fetchCitizenData(currentUser);
  }, []);

  const fetchCitizenData = async (currentUser) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${currentUser.token}` };
      const [disasters, alerts, shelters, queries, areas] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/disasters/active`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/alerts/active`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/shelters/state/${currentUser.state}`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/queries/citizen/my-queries`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/affected-areas/state/${currentUser.state}`, { headers }).catch(() => ({ data: [] }))
      ]);

      setData({
        disasters: disasters.data,
        alerts: alerts.data,
        shelters: shelters.data,
        queries: queries.data,
        areas: areas.data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/queries/create`, queryForm, { headers });
      setData(prev => ({ ...prev, queries: [...prev.queries, response.data] }));
      setQueryForm({ subject: '', message: '', category: 'GENERAL', location: '', district: '', state: '' });
      alert('Query submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit query');
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/login';
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="h-12 w-12 rounded-full border-t-4 border-purple-500 animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* SIDEBAR */}
      <motion.nav
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed left-0 top-0 h-screen w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col shadow-2xl"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-purple-100 to-slate-300 bg-clip-text text-transparent">
                UrLifeLine
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Safety Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'notifications', label: 'Alerts', icon: Bell, badge: data.alerts.length },
            { id: 'disasters', label: 'Emergencies', icon: AlertTriangle },
            { id: 'map', label: 'Map', icon: MapIcon },
            { id: 'shelters', label: 'Safe Places', icon: Home },
            { id: 'queries', label: 'Get Help', icon: HelpCircle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 relative ${activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-900/50 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 font-medium text-sm"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.nav>

      {/* MAIN CONTENT */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="h-20 border-b border-white/10 bg-slate-900/30 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h2 className="text-2xl font-bold text-white">Safety Dashboard</h2>
            <p className="text-sm text-slate-400">{user?.state} - Stay Safe</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{user?.name || 'Citizen'}</p>
              <p className="text-xs text-purple-400">Citizen</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name?.[0] || 'C'}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* ALERTS TAB */}
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  {data.alerts.length === 0 ? (
                    <EmptyState icon={Shield} message="No alerts in your area." subMessage="You are safe." />
                  ) : (
                    data.alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 border-l-4 !border-l-red-500 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-3 py-1.5 rounded-full border border-red-500/30 uppercase tracking-wider animate-pulse">
                              Emergency Alert
                            </span>
                            <span className="text-slate-500 text-xs flex items-center gap-1 font-mono">
                              <Clock size={12} /> {new Date(alert.broadcastTime).toLocaleTimeString()}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{alert.title}</h3>
                          <p className="text-slate-300 leading-relaxed text-sm">{alert.message}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* MAP TAB */}
              {activeTab === 'map' && (
                <div className="h-[calc(100vh-200px)] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-900/50 backdrop-blur-xl">
                  <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-white">
                    Live Hazard View
                  </div>
                  <MapComponent areas={data.areas} isReadOnly={true} height="100%" />
                </div>
              )}

              {/* INCIDENTS TAB */}
              {activeTab === 'disasters' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {data.disasters.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState icon={CheckCircle} message="No emergencies reported." subMessage="All clear in your area." />
                    </div>
                  ) : (
                    data.disasters.map((disaster) => (
                      <motion.div
                        key={disaster.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                          <div className="flex justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              <AlertTriangle className="text-amber-500" size={20} />
                              {disaster.type}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${disaster.severity === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>
                              {disaster.severity}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-4">{disaster.description}</p>
                          <div className="text-xs text-slate-500 bg-white/5 p-3 rounded-lg">
                            Location: {disaster.region}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* SHELTERS TAB */}
              {activeTab === 'shelters' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.shelters.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState icon={Home} message="No safe places available." />
                    </div>
                  ) : (
                    data.shelters.map((shelter) => (
                      <motion.div
                        key={shelter.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-white">{shelter.name}</h3>
                            <div className="bg-white/5 px-3 py-2 rounded-lg text-center border border-white/10">
                              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Available</div>
                              <div className="text-emerald-400 font-mono text-sm font-bold">
                                {shelter.currentOccupancy}/{shelter.totalCapacity}
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-400 text-sm mb-4 flex items-center gap-2">
                            <MapIcon size={14} className="text-slate-600" />
                            {shelter.address}
                          </p>
                          <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                              <Phone size={16} />
                              Call
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-900/50 hover:shadow-purple-900/70 hover:scale-105 transition-all duration-300">
                              <Navigation size={16} />
                              Directions
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* QUERIES TAB */}
              {activeTab === 'queries' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent rounded-2xl blur-2xl" />
                      <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-6">Ask for Help</h3>
                        <form onSubmit={handleSubmitQuery} className="space-y-4">
                          <input
                            type="text"
                            placeholder="What do you need help with?"
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white text-sm placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                            value={queryForm.subject}
                            onChange={e => setQueryForm({ ...queryForm, subject: e.target.value })}
                          />
                          <textarea
                            placeholder="Describe your situation..."
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white text-sm h-32 placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                            value={queryForm.message}
                            onChange={e => setQueryForm({ ...queryForm, message: e.target.value })}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="State"
                              className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white text-sm placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                              value={queryForm.state}
                              onChange={e => setQueryForm({ ...queryForm, state: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="District"
                              className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white text-sm placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                              value={queryForm.district}
                              onChange={e => setQueryForm({ ...queryForm, district: e.target.value })}
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-900/50 hover:shadow-purple-900/70 hover:scale-[1.02] transition-all duration-300"
                          >
                            <Send size={18} />
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    {data.queries.map(q => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300">
                          <div className="flex justify-between mb-3">
                            <h4 className="font-bold text-white text-lg">{q.subject}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${q.status === 'RESOLVED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : q.status === 'IN_PROGRESS'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                              }`}>
                              {q.status}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-3">{q.message}</p>
                          {q.response && (
                            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                              <p className="text-xs text-emerald-400 font-bold mb-1 uppercase tracking-wider">Response</p>
                              <p className="text-emerald-300 text-sm">{q.response}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, message, subMessage }) => (
  <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-2xl border-2 border-dashed border-white/10">
    <Icon size={48} className="text-slate-600 mb-4" />
    <p className="text-white font-bold text-lg">{message}</p>
    {subMessage && <p className="text-slate-500 text-sm mt-1">{subMessage}</p>}
  </div>
);

export default CitizenDashboard;
