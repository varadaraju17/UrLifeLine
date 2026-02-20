import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../services/auth.service';
import MapComponent from './MapComponent';
import DropdownSelect from './UI/DropdownSelect';
import { INDIAN_STATES_AND_DISTRICTS } from '../data/indian_states_districts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map as MapIcon,
  Users,
  ClipboardList,
  Plus,
  UserPlus,
  ShieldAlert,
  Activity,
  Settings,
  Search,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Shield,
  X,
  Ambulance,
  LifeBuoy
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [officers, setOfficers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [affectedAreas, setAffectedAreas] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ volunteers: 0, teams: 0, requests: 0 });

  // Forms State
  const [showOfficerForm, setShowOfficerForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);

  const [officerForm, setOfficerForm] = useState({
    name: '', email: '', password: '', phone: '', state: '', district: '', location: ''
  });

  const [taskForm, setTaskForm] = useState({
    title: '', description: '', assignedToId: '', location: '', district: '', state: '',
    taskType: 'RESCUE', priority: 'HIGH', dueDate: ''
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || (!currentUser.roles?.includes('ROLE_ADMIN') && currentUser.role !== 'ROLE_ADMIN')) {
      window.location.href = '/login';
      return;
    }
    setUser(currentUser);
    fetchAdminData(currentUser);
  }, []);

  const fetchAdminData = async (currentUser) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${currentUser.token}` };
      const [officersRes, tasksRes, areasRes, volunteersRes, teamsRes, requestsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/officers`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/all`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/affected-areas/all`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/volunteers/all/count`, { headers }).catch(() => ({ data: 0 })),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/emergency-teams/all/count`, { headers }).catch(() => ({ data: 0 })),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/rescue-requests/all/count`, { headers }).catch(() => ({ data: 0 }))
      ]);
      setOfficers(officersRes.data || []);
      setTasks(tasksRes.data || []);
      setAffectedAreas(areasRes.data || []);
      setStats({
        volunteers: volunteersRes.data || 0,
        teams: teamsRes.data || 0,
        requests: requestsRes.data || 0
      });
    } catch (error) {
      console.error('Data fetch error:', error);
      showNotify('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotify = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/create-officer`, officerForm, { headers });
      showNotify('Officer deployed successfully');
      setShowOfficerForm(false);
      setOfficerForm({ name: '', email: '', password: '', phone: '', state: '', district: '', location: '' });
      fetchAdminData(user);
    } catch (error) {
      showNotify(error.response?.data?.message || 'Failed to create officer', 'error');
    }
  };

  const handleUpdateOfficer = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const updateData = { ...officerForm };
      if (!updateData.password) delete updateData.password;

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/officers/${editingOfficer.id}`, updateData, { headers });
      showNotify('Officer profile updated');
      setShowOfficerForm(false);
      setEditingOfficer(null);
      fetchAdminData(user);
    } catch (error) {
      showNotify('Update failed', 'error');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    // Validate that an officer is assigned
    if (!taskForm.assignedToId) {
      showNotify('Please assign a team member to this task', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      // Ensure assignedToId is a number
      const taskData = {
        title: taskForm.title,
        description: taskForm.description,
        assignedToId: parseInt(taskForm.assignedToId),
        location: taskForm.location || '',
        district: taskForm.district || '',
        state: taskForm.state || '',
        taskType: taskForm.taskType,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || null
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/create`, taskData, { headers });
      showNotify('Task created successfully');
      setShowTaskForm(false);
      setTaskForm({ title: '', description: '', assignedToId: '', location: '', district: '', state: '', taskType: 'RESCUE', priority: 'HIGH', dueDate: '' });
      fetchAdminData(user);
    } catch (error) {
      console.error('Task creation error:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data || 'Failed to create task. Please check all fields.';
      showNotify(errorMsg, 'error');
    } finally {
      setIsLoading(false);
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-cyan-glow animate-heartbeat">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-secondary-100 to-slate-300 bg-clip-text text-transparent">
                UrLifeLine
              </h1>
              <p className="text-[10px] text-accent-400 font-semibold tracking-widest uppercase font-mono">Command Center</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'map', label: 'Live Map', icon: MapIcon },
            { id: 'officers', label: 'Team Members', icon: Users },
            { id: 'tasks', label: 'Tasks', icon: ClipboardList }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50 scale-[1.02]'
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
            <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
            <p className="text-sm text-slate-400">Manage your team and tasks</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{user?.name || 'Admin'}</p>
              <p className="text-xs text-blue-400">Administrator</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name?.[0] || 'A'}
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
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { title: 'Active Members', value: officers.filter(o => o.status === 'ACTIVE').length, icon: Users, gradient: 'from-blue-600 to-blue-700', shadow: 'shadow-blue-900/50' },
                      { title: 'Volunteers', value: stats.volunteers, icon: Users, gradient: 'from-purple-600 to-purple-700', shadow: 'shadow-purple-900/50' },
                      { title: 'Emergency Teams', value: stats.teams, icon: Ambulance, gradient: 'from-red-600 to-red-700', shadow: 'shadow-red-900/50' },
                      { title: 'Rescue Requests', value: stats.requests, icon: LifeBuoy, gradient: 'from-amber-600 to-amber-700', shadow: 'shadow-amber-900/50' },
                      { title: 'Danger Areas', value: affectedAreas.length, icon: ShieldAlert, gradient: 'from-red-600 to-red-700', shadow: 'shadow-red-900/50' },
                      { title: 'Active Tasks', value: tasks.filter(t => t.status !== 'COMPLETED').length, icon: ClipboardList, gradient: 'from-emerald-600 to-emerald-700', shadow: 'shadow-emerald-900/50' }
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadow}`}>
                              <stat.icon size={24} className="text-white" />
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                          </div>
                          <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Mini Map */}
                    <div className="h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-900/50 backdrop-blur-xl">
                      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-white">
                        Live Map View
                      </div>
                      <MapComponent areas={affectedAreas} isReadOnly={true} zoom={5} center={[20.5937, 78.9629]} height="100%" />
                    </div>

                    {/* Recent Tasks */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="p-5 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white">Recent Tasks</h3>
                        <button onClick={() => setActiveTab('tasks')} className="text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors">
                          View All →
                        </button>
                      </div>
                      <div className="h-[340px] overflow-y-auto p-4 space-y-3">
                        {tasks.length === 0 ? (
                          <div className="text-center py-20 text-slate-500 text-sm">No recent activity.</div>
                        ) : (
                          tasks.slice(0, 8).map(task => (
                            <div key={task.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-white text-sm">{task.title}</div>
                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                  task.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                    'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                  }`}>
                                  {task.status}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500">
                                {task.taskType} • {task.assignedTo?.name || 'Unassigned'}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'map' && (
                <div className="h-[calc(100vh-200px)] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-900/50 backdrop-blur-xl">
                  <MapComponent areas={affectedAreas} isReadOnly={true} height="100%" />
                </div>
              )}

              {activeTab === 'officers' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="text"
                        placeholder="Search personnel..."
                        className="pl-11 pr-4 py-3 w-full sm:w-80 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setEditingOfficer(null);
                        setOfficerForm({ name: '', email: '', password: '', phone: '', state: '', district: '', location: '' });
                        setShowOfficerForm(true);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/50 hover:shadow-blue-900/70 hover:scale-105 transition-all duration-300"
                    >
                      <UserPlus size={18} />
                      Add Team Member
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {officers.map(officer => (
                      <motion.div
                        key={officer.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                          <button
                            onClick={() => {
                              setEditingOfficer(officer);
                              setOfficerForm({ ...officer, password: '' });
                              setShowOfficerForm(true);
                            }}
                            className="absolute top-4 right-4 p-2 text-slate-600 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                          >
                            <Settings size={16} />
                          </button>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/50">
                              {officer.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg">{officer.name}</h3>
                              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${officer.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                }`}>
                                {officer.status}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 pt-4 border-t border-white/10 text-xs">
                            <div className="flex justify-between text-slate-400">
                              <span>Member ID:</span>
                              <span className="text-slate-300 font-mono">{officer.id}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>Location:</span>
                              <span className="text-slate-300">{officer.district || 'Unassigned'}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>Phone:</span>
                              <span className="text-slate-300">{officer.phone || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">All Tasks</h2>
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-900/50 hover:shadow-amber-900/70 hover:scale-105 transition-all duration-300"
                    >
                      <Plus size={18} />
                      Create Task
                    </button>
                  </div>

                  <div className="space-y-4">
                    {tasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300">
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-center gap-6 flex-1">
                              <div className={`w-1.5 h-16 rounded-full ${task.priority === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' :
                                task.priority === 'HIGH' ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' :
                                  'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                                }`} />
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-bold text-white text-lg">{task.title}</h3>
                                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 uppercase font-bold">
                                    {task.taskType}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-400">{task.description} • {task.location || 'Unknown Coordinates'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Assigned To</p>
                                <p className="text-sm text-white font-bold">{task.assignedTo?.name || 'Unassigned'}</p>
                              </div>
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                task.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                  'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                }`}>
                                {task.status}
                              </span>
                            </div>
                          </div>
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

      {/* MODALS */}
      {showOfficerForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {editingOfficer ? 'Edit Team Member' : 'Add New Team Member'}
              </h3>
              <button
                onClick={() => {
                  setShowOfficerForm(false);
                  setEditingOfficer(null);
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={editingOfficer ? handleUpdateOfficer : handleCreateOfficer} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-2 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={officerForm.name}
                    onChange={e => setOfficerForm({ ...officerForm, name: e.target.value })}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-2 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    required
                    value={officerForm.email}
                    onChange={e => setOfficerForm({ ...officerForm, email: e.target.value })}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-2 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    required={!editingOfficer}
                    value={officerForm.password}
                    onChange={e => setOfficerForm({ ...officerForm, password: e.target.value })}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-2 uppercase tracking-wider">Phone</label>
                  <input
                    type="text"
                    required
                    value={officerForm.phone}
                    onChange={e => setOfficerForm({ ...officerForm, phone: e.target.value })}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <DropdownSelect
                  label="State"
                  options={Object.keys(INDIAN_STATES_AND_DISTRICTS).map(s => ({ value: s, label: s }))}
                  value={officerForm.state}
                  onChange={v => setOfficerForm({ ...officerForm, state: v, district: '' })}
                />
                <DropdownSelect
                  label="District"
                  options={officerForm.state ? INDIAN_STATES_AND_DISTRICTS[officerForm.state].map(d => ({ value: d, label: d })) : []}
                  value={officerForm.district}
                  onChange={v => setOfficerForm({ ...officerForm, district: v })}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-900/50 hover:shadow-blue-900/70 hover:scale-[1.02] transition-all duration-300"
              >
                {editingOfficer ? 'Save Changes' : 'Add Member'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Create New Task</h3>
              <button
                onClick={() => setShowTaskForm(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-2 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    value={taskForm.title}
                    onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <DropdownSelect
                    label="Type"
                    options={[{ value: 'RESCUE', label: 'Rescue' }, { value: 'SUPPLY', label: 'Supply' }]}
                    value={taskForm.taskType}
                    onChange={v => setTaskForm({ ...taskForm, taskType: v })}
                  />
                  <DropdownSelect
                    label="Priority"
                    options={[{ value: 'CRITICAL', label: 'Critical' }, { value: 'HIGH', label: 'High' }]}
                    value={taskForm.priority}
                    onChange={v => setTaskForm({ ...taskForm, priority: v })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-2 uppercase tracking-wider">
                  Assign To <span className="text-red-400">*</span>
                </label>
                <DropdownSelect
                  label=""
                  placeholder="Select a team member..."
                  options={officers.filter(o => o.status === 'ACTIVE').map(o => ({ value: o.id, label: `${o.name} [${o.district}]` }))}
                  value={taskForm.assignedToId}
                  onChange={v => setTaskForm({ ...taskForm, assignedToId: v })}
                  required={true}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-2 uppercase tracking-wider">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full h-32 bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-bold shadow-lg shadow-amber-900/50 hover:shadow-amber-900/70 hover:scale-[1.02] transition-all duration-300"
              >
                Issue Directive
              </button>
            </form>
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

export default AdminDashboard;
