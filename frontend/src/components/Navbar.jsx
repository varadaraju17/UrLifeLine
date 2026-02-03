import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    ShieldAlert,
    LayoutDashboard,
    LogOut,
    Bell,
    Home as HomeIcon,
    Radio
} from 'lucide-react';
import NeonButton from './UI/NeonButton';

const Navbar = ({ currentUser, logOut }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { to: '/', label: 'Home', icon: HomeIcon, roles: ['ALL'] },
        { to: '/dashboard', label: 'Command', icon: LayoutDashboard, roles: ['ROLE_ADMIN', 'ROLE_OFFICER', 'ROLE_CITIZEN'] },
        { to: '/admin-dashboard', label: 'Admin', icon: ShieldAlert, roles: ['ROLE_ADMIN'] },
        { to: '/officer-dashboard', label: 'Tactical', icon: Radio, roles: ['ROLE_OFFICER'] },
        { to: '/citizen-dashboard', label: 'Alerts', icon: Bell, roles: ['ROLE_CITIZEN'] },
    ];

    const filteredLinks = navLinks.filter(link =>
        link.roles.includes('ALL') || (currentUser && link.roles.includes(currentUser.role))
    );

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
            >
                <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl backdrop-blur-xl bg-[#030712]/60 border border-white/10 relative overflow-hidden">
                    {/* Logo Area */}
                    <Link to="/" className="flex items-center gap-3 relative z-10 group">
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <ShieldAlert size={18} />
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                        </div>
                        <span className="font-bold text-white tracking-tight hidden sm:block">
                            AIGIS <span className="text-blue-500 text-xs tracking-widest font-normal ml-1">NET</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {filteredLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${location.pathname === link.to
                                        ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <link.icon size={14} />
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-xs font-bold text-white leading-none">{currentUser.name}</div>
                                    <div className="text-[10px] text-blue-400 font-mono mt-1 opacity-80 uppercase">
                                        {currentUser.role?.replace('ROLE_', '')}
                                    </div>
                                </div>
                                <button
                                    onClick={logOut}
                                    className="p-2 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                    title="Disconnect"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                                    LOGIN
                                </Link>
                                <Link to="/register">
                                    <NeonButton variant="primary" className="!py-1.5 !px-4 !text-xs !rounded-full">
                                        ACCESS
                                    </NeonButton>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-slate-300 hover:text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {/* Ambient Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 blur-[2px]"></div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-[#030712]/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center p-8 space-y-8"
                    >
                        {filteredLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 text-xl font-bold ${location.pathname === link.to ? 'text-blue-400' : 'text-slate-400'
                                    }`}
                            >
                                <link.icon size={24} />
                                {link.label}
                            </Link>
                        ))}

                        <div className="w-full h-px bg-white/10 max-w-[200px]" />

                        {currentUser ? (
                            <button onClick={() => { logOut(); setIsOpen(false); }} className="text-red-400 flex items-center gap-2 font-bold">
                                <LogOut size={20} /> DISCONNECT
                            </button>
                        ) : (
                            <div className="flex flex-col gap-4 w-full max-w-[200px]">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                                    <NeonButton variant="secondary" className="w-full justify-center">LOGIN</NeonButton>
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full">
                                    <NeonButton variant="primary" className="w-full justify-center">REGISTER</NeonButton>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
