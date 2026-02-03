import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, AlertTriangle, Users, FileText, Menu, X, LogOut, Globe } from 'lucide-react';
import AuthService from '../services/auth.service';

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    const isAuthPage = ['/login', '/register', '/'].includes(location.pathname) || location.pathname === '/home';

    // Public/Landing Layout
    if (isAuthPage) {
        return (
            <div className="min-h-screen relative flex flex-col">
                {/* Dynamic Background */}
                <div className="fixed inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background"></div>
                </div>

                {/* Navbar */}
                <nav className="relative z-50 border-b border-white/10 backdrop-blur-md bg-background/50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition">
                                <Shield className="text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary-400 transition">UrLifeLine</span>
                        </Link>
                        <div className="flex gap-4">
                            {!user ? (
                                <>
                                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition">Log In</Link>
                                    <Link to="/register" className="px-5 py-2 text-sm font-bold bg-white text-background rounded-full hover:bg-slate-200 transition shadow-lg shadow-white/10">Register</Link>
                                </>
                            ) : (
                                <Link to={user.roles.includes('ROLE_ADMIN') ? '/admin/dashboard' : '/dashboard'} className="px-5 py-2 text-sm font-bold bg-primary-600 text-white rounded-full hover:bg-primary-500 transition shadow-lg">Dashboard</Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Content */}
                <main className="relative z-10 flex-grow">
                    {children}
                </main>
            </div>
        );
    }

    // Dashboard Layout (Authenticated)
    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 lg:static lg:block grid grid-rows-[auto_1fr_auto] border-r border-white/5`}>
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <Shield size={18} className="text-white" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-wide">UrLifeLine</span>
                    <button className="ml-auto md:hidden text-slate-400" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    <NavItem to="/dashboard" icon={<Globe size={20} />} label="Overview" active={location.pathname.includes('dashboard')} />
                    <NavItem to="/alerts" icon={<AlertTriangle size={20} />} label="Active Alerts" active={location.pathname.includes('alerts')} />

                    {user?.roles.includes('ROLE_ADMIN') && (
                        <>
                            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Command</div>
                            <NavItem to="/admin" icon={<Users size={20} />} label="Personnel" active={location.pathname === '/admin'} />
                            <NavItem to="/rescue-tasks" icon={<LayoutDashboard size={20} />} label="Operations" active={location.pathname.includes('rescue')} />
                        </>
                    )}

                    <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Account</div>
                    <NavItem to="/profile" icon={<FileText size={20} />} label="Profile" active={location.pathname === '/profile'} />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition">
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar (Mobile Trigger + User Info) */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-background/50 backdrop-blur top-0 sticky z-40">
                    <button className="md:hidden text-slate-400" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <div className="ml-auto flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white">{user?.name || 'User'}</p>
                            <p className="text-xs text-primary-400 capitalize">{user?.roles?.[0]?.replace('ROLE_', '') || 'Guest'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-slate-300">
                            <span className="font-bold">{user?.name?.[0] || 'U'}</span>
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-8 overflow-y-auto flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
        {icon}
        <span className="font-medium text-sm">{label}</span>
    </Link>
);

export default Layout;
