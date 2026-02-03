import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../services/auth.service';
import MapComponent from './MapComponent';
import DropdownSelect from './UI/DropdownSelect';
import { motion, AnimatePresence } from 'framer-motion';
import { INDIAN_STATES_AND_DISTRICTS } from '../data/indian_states_districts';
import {
  ClipboardList,
  Radio,
  Map as MapIcon,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Send,
  Shield,
  Target,
  Crosshair,
  LogOut,
  X
} from 'lucide-react';

const OfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [affectedAreas, setAffectedAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Alert Targeting State
  const [targetType, setTargetType] = useState('specific'); // 'specific' | 'state'
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Alert Form State
  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    district: '',
    state: ''
  });

  // Affected Area Form State
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [newArea, setNewArea] = useState({
    severity: 'HIGH',
    latitude: 20.5937,
    longitude: 78.9629,
    radius: 1000,
    description: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    console.log("OfficerDashboard: Checking auth...", currentUser);
    if (!currentUser) {
      console.log("OfficerDashboard: No user found, redirecting...");
      window.location.href = '/login';
      return;
    }

    const hasRole = currentUser.roles?.includes('ROLE_OFFICER') || currentUser.role === 'ROLE_OFFICER';
    if (!hasRole) {
      console.log("OfficerDashboard: Role check failed", { roles: currentUser.roles, role: currentUser.role });
      window.location.href = '/login';
      return;
    }
    setUser(currentUser);
    if (currentUser) {
      setSelectedState(currentUser.state || '');
      setSelectedDistricts(currentUser.district ? [currentUser.district] : []);
      setAlertForm(prev => ({ ...prev, district: currentUser.district, state: currentUser.state }));
      fetchOfficerData(currentUser);
    }
  }, []);

  const fetchOfficerData = async (currentUser) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${currentUser.token}` };
      const [tasksRes, areasRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/my-tasks`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/affected-areas/all`, { headers }).catch(() => ({ data: [] }))
      ]);
      setTasks(tasksRes.data || []);
      setAffectedAreas(areasRes.data || []);
    } catch (error) {
      console.error('Error loading officer data', error);
      showNotify('Failed to load operational data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotify = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const status = action === 'accept' ? 'IN_PROGRESS' : 'COMPLETED';
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}/status?status=${status}`, {}, { headers });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
      showNotify(`Mission ${status}`);
    } catch (error) {
      showNotify('Action failed. Retry.', 'error');
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    try {
      let finalDistrict = '';

      if (!selectedState) {
        showNotify('Please select a state', 'error');
        return;
      }

      if (targetType === 'state') {
        finalDistrict = ''; // Empty means entire state
      } else {
        if (selectedDistricts.length === 0) {
          showNotify('Please select at least one district', 'error');
          return;
        }
        finalDistrict = selectedDistricts.join(',');
      }

      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/alerts/broadcast`, {
        ...alertForm,
        state: selectedState,
        district: finalDistrict
      }, { headers });

      showNotify('Alert broadcast successfully');
      setAlertForm({ title: '', message: '', district: '', state: '' });
      setSelectedDistricts([]);
    } catch (error) {
      showNotify('Broadcast failed', 'error');
    }
  };

  const handleReportArea = async () => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/affected-areas/create`, newArea, { headers });
      showNotify('New Hazard Zone Reported');
      setShowAreaModal(false);
      fetchOfficerData(user);
    } catch (error) {
      showNotify('Report failed', 'error');
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/login';
  };

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-emerald-100 to-slate-300 bg-clip-text text-transparent">
                UrLifeLine
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Officer Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'tasks', label: 'My Tasks', icon: Target },
            { id: 'broadcast', label: 'Send Alert', icon: Radio },
            { id: 'map', label: 'Map', icon: MapIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/50 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
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
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="text-emerald-500" size={28} />
              Officer Dashboard
            </h2>
            <p className="text-sm text-slate-400">Area: {user?.district}, {user?.state}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{user?.name || 'Officer'}</p>
              <p className="text-xs text-emerald-400">Officer</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name?.[0] || 'O'}
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
              {activeTab === 'tasks' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasks.length === 0 ? (
                    <div className="col-span-full h-96 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                      <Crosshair size={64} className="mb-4 opacity-50" />
                      <p className="text-lg font-bold">No Tasks Assigned</p>
                      <p className="text-sm opacity-50">Waiting for new assignments.</p>
                    </div>
                  ) : (
                    tasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${task.priority === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              }`}>
                              {task.priority}
                            </div>
                            <div className="text-xs font-mono text-slate-500">#{task.id}</div>
                          </div>

                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                            {task.title}
                          </h3>
                          <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-1">{task.description}</p>

                          <div className="mt-auto pt-4 border-t border-white/10">
                            {task.status !== 'IN_PROGRESS' && task.status !== 'COMPLETED' && (
                              <button
                                onClick={() => handleTaskAction(task.id, 'accept')}
                                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/50 hover:shadow-emerald-900/70 hover:scale-105 transition-all duration-300"
                              >
                                ACCEPT TASK
                              </button>
                            )}
                            {task.status === 'IN_PROGRESS' && (
                              <button
                                onClick={() => handleTaskAction(task.id, 'complete')}
                                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-900/50 hover:shadow-amber-900/70 hover:scale-105 transition-all duration-300"
                              >
                                MARK DONE
                              </button>
                            )}
                            {task.status === 'COMPLETED' && (
                              <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold py-3">
                                <CheckCircle size={18} /> DONE
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'broadcast' && (
                <div className="max-w-3xl mx-auto">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent rounded-2xl blur-2xl" />
                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                        <div className="p-4 bg-red-500/10 rounded-2xl text-red-400 border border-red-500/20">
                          <Radio size={28} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">Send Emergency Alert</h2>
                          <div className="flex flex-col gap-4 mt-2">
                            <p className="text-sm text-slate-400">Target Audience:</p>

                            {/* State Selection */}
                            <div className="mb-4">
                              <DropdownSelect
                                label="State Population"
                                options={Object.keys(INDIAN_STATES_AND_DISTRICTS).map(s => ({ value: s, label: s }))}
                                value={selectedState}
                                onChange={(val) => {
                                  setSelectedState(val);
                                  setSelectedDistricts([]); // Reset districts on state change
                                }}
                              />
                            </div>

                            {/* Target Type Selection */}
                            <div className="flex gap-4">
                              <button
                                type="button"
                                onClick={() => setTargetType('specific')}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${targetType === 'specific'
                                  ? 'bg-red-500/20 text-red-400 border-red-500/50'
                                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                                  }`}
                              >
                                Specific Districts
                              </button>
                              <button
                                type="button"
                                onClick={() => setTargetType('state')}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${targetType === 'state'
                                  ? 'bg-red-500/20 text-red-400 border-red-500/50'
                                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                                  }`}
                              >
                                Entire State
                              </button>
                            </div>

                            {/* District Selection Dropdown */}
                            {targetType === 'specific' && selectedState && (
                              <div className="mt-4">
                                <DropdownSelect
                                  label={`Select District in ${selectedState}`}
                                  options={INDIAN_STATES_AND_DISTRICTS[selectedState] ?
                                    INDIAN_STATES_AND_DISTRICTS[selectedState].map(d => ({ value: d, label: d }))
                                    : []}
                                  value={selectedDistricts[0] || ''}
                                  onChange={(val) => setSelectedDistricts([val])}
                                  placeholder="Select District"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <form onSubmit={handleSendAlert} className="space-y-6">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                            Message Title
                          </label>
                          <input
                            required
                            value={alertForm.title}
                            onChange={e => setAlertForm({ ...alertForm, title: e.target.value })}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all duration-300"
                            placeholder="e.g. FLASH FLOOD WARNING"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                            Message Details
                          </label>
                          <textarea
                            required
                            value={alertForm.message}
                            onChange={e => setAlertForm({ ...alertForm, message: e.target.value })}
                            className="w-full h-40 bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all duration-300"
                            placeholder="Detailed instructions for civilians..."
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-900/50 hover:shadow-red-900/70 hover:scale-[1.02] transition-all duration-300"
                        >
                          <Send size={20} />
                          SEND ALERT
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'map' && (
                <div className="h-[calc(100vh-200px)] relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50 backdrop-blur-xl">
                  <MapComponent areas={affectedAreas} height="100%" />
                  <div className="absolute top-6 right-6 z-[400]">
                    <button
                      onClick={() => setShowAreaModal(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-900/50 hover:shadow-red-900/70 hover:scale-105 transition-all duration-300"
                    >
                      <MapPin size={18} />
                      REPORT DANGER AREA
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* HAZARD REPORT MODAL */}
      {showAreaModal && (
        <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Report Danger Area</h3>
              <button
                onClick={() => setShowAreaModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Latitude</label>
                  <input
                    type="number"
                    value={newArea.latitude}
                    onChange={e => setNewArea({ ...newArea, latitude: parseFloat(e.target.value) })}
                    className="w-full bg-slate-800/50 border border-white/10 p-3 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Longitude</label>
                  <input
                    type="number"
                    value={newArea.longitude}
                    onChange={e => setNewArea({ ...newArea, longitude: parseFloat(e.target.value) })}
                    className="w-full bg-slate-800/50 border border-white/10 p-3 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Severity</label>
                <select
                  value={newArea.severity}
                  onChange={e => setNewArea({ ...newArea, severity: e.target.value })}
                  className="w-full bg-slate-800/50 border border-white/10 p-3 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-300"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MODERATE">MODERATE</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Description</label>
                <textarea
                  value={newArea.description}
                  onChange={e => setNewArea({ ...newArea, description: e.target.value })}
                  className="w-full h-28 bg-slate-800/50 border border-white/10 p-3 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-300"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleReportArea}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/50 hover:shadow-emerald-900/70 hover:scale-105 transition-all duration-300"
                >
                  SUBMIT
                </button>
                <button
                  onClick={() => setShowAreaModal(false)}
                  className="flex-1 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-all duration-300"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notifications */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl border flex items-center gap-4 shadow-2xl z-[100] backdrop-blur-xl ${notification.type === 'error'
              ? 'bg-red-500/20 border-red-500/50 text-red-200'
              : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
              }`}
          >
            {notification.type === 'error' ? <AlertTriangle /> : <CheckCircle />}
            <span className="font-bold tracking-wide">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OfficerDashboard;
