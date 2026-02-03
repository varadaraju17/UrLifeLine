import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, Shield, Lock, ChevronRight, AlertTriangle, User, Mail, Phone, MapPin } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';
import AuthService from '../../services/auth.service';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Data for Dropdowns
const INDIAN_STATES_AND_DISTRICTS = {
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi"]
}; // Simplified for this demo, full list can be imported

const Portal = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
    };

    const handleLogin = async (values) => {
        setIsLoading(true);
        setError('');
        try {
            const user = await AuthService.login(values.email, values.password);
            // Route based on role
            if (user.roles.includes('ROLE_ADMIN')) navigate('/admin/dashboard');
            else if (user.roles.includes('ROLE_OFFICER')) navigate('/officer/dashboard');
            else navigate('/citizen/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Authentication Failed. Access Denied.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (values) => {
        setIsLoading(true);
        setError('');
        try {
            await AuthService.register(
                values.name,
                values.email,
                values.password,
                'citizen', // Always citizen
                values.phone,
                values.state,
                values.district,
                values.location
            );
            // Auto login or show success? Let's show success and switch to login
            setMode('login');
            setError('Identity Established. Proceed to Authentication.');
            // Hacky: misuse error field for success message temporarily or add success state
        } catch (err) {
            setError(err.response?.data?.message || "Registration Failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute inset-0 bg-void-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-void-900 via-transparent to-void-900"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-void-900 via-transparent to-void-900"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Brand Narrative */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block space-y-8"
                >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-command-500 to-command-900 flex items-center justify-center shadow-[0_0_40px_rgba(0,204,255,0.3)]">
                        <Shield className="text-white w-10 h-10" />
                    </div>

                    <div>
                        <h1 className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500 mb-4 leading-tight">
                            PROJECT <br />
                            <span className="text-command-500 text-glow">VANGUARD</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-light max-w-md leading-relaxed">
                            Advanced Disaster Response Network. <br />
                            Global situational awareness and tactical coordination.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="px-4 py-2 rounded-full border border-command-500/30 bg-command-500/5 text-command-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-command-500 animate-pulse"></span>
                            System Online
                        </div>
                        <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-400 text-xs font-mono uppercase tracking-widest">
                            v2.0.0 Stable
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Auth Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <GlassCard className="border-t-4 border-t-command-500">
                        <div className="mb-8 flex justify-between items-end">
                            <div>
                                <h2 className="text-2xl font-bold font-display text-white mb-1">
                                    {mode === 'login' ? 'AUTHENTICATION' : 'NEW IDENTITY'}
                                </h2>
                                <p className="text-sm text-slate-400 font-mono">
                                    {mode === 'login' ? 'Enter credentials to access network.' : 'Create secure personnel profile.'}
                                </p>
                            </div>
                            <div className="text-right">
                                <Shield className={`w-8 h-8 ${mode === 'login' ? 'text-command-500' : 'text-success-500'} opacity-50`} />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-mono ${error.includes('Identity Established') ? 'bg-success-500/10 text-success-400 border border-success-500/20' : 'bg-alert-500/10 text-alert-400 border border-alert-500/20'}`}
                            >
                                <AlertTriangle size={16} />
                                {error}
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {mode === 'login' ? (
                                <LoginForm key="login-form" onSubmit={handleLogin} isLoading={isLoading} />
                            ) : (
                                <RegisterForm key="register-form" onSubmit={handleRegister} isLoading={isLoading} />
                            )}
                        </AnimatePresence>

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <button
                                onClick={toggleMode}
                                className="text-sm text-slate-400 hover:text-command-400 transition-colors font-mono uppercase tracking-wider"
                            >
                                {mode === 'login' ? 'Initialize New Identity >' : '< Return to Login'}
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
};

const LoginForm = ({ onSubmit, isLoading }) => (
    <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
            email: Yup.string().required('Required').email('Invalid'),
            password: Yup.string().required('Required'),
        })}
        onSubmit={onSubmit}
    >
        <Form className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Secure Mail</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                    <Field name="email" type="email" placeholder="commander@vanguard.net" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-command-500 focus:ring-1 focus:ring-command-500 outline-none transition-all placeholder:text-slate-700 font-mono text-sm" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Access Key</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                    <Field name="password" type="password" placeholder="••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-command-500 focus:ring-1 focus:ring-command-500 outline-none transition-all placeholder:text-slate-700 font-mono text-sm" />
                </div>
            </div>

            <div className="pt-2">
                <NeonButton type="submit" isLoading={isLoading} className="w-full">
                    INITIATE LOGIN
                </NeonButton>
            </div>
        </Form>
    </Formik>
);

const RegisterForm = ({ onSubmit, isLoading }) => (
    <Formik
        initialValues={{ name: '', email: '', password: '', phone: '', state: '', district: '', location: '' }}
        validationSchema={Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().required('Required').email('Invalid'),
            password: Yup.string().required('Required').min(6, 'Min 6 chars'),
            phone: Yup.string().required('Required'),
            state: Yup.string().required('Required'),
            district: Yup.string().required('Required'),
        })}
        onSubmit={onSubmit}
    >
        {({ values, setFieldValue }) => (
            <Form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                        <Field name="name" placeholder="Full Identification" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-command-500 outline-none text-sm font-mono" />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                        <Field name="email" placeholder="Secure Mail" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-command-500 outline-none text-sm font-mono" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                        <Field name="password" type="password" placeholder="Set Access Key" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-command-500 outline-none text-sm font-mono" />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                        <Field name="phone" placeholder="Contact Uplink" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-command-500 outline-none text-sm font-mono" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field
                        as="select"
                        name="state"
                        onChange={e => {
                            setFieldValue('state', e.target.value);
                            setFieldValue('district', '');
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-command-500 outline-none text-sm font-mono bg-void-900"
                    >
                        <option value="">Select State</option>
                        {Object.keys(INDIAN_STATES_AND_DISTRICTS).map(s => <option key={s} value={s}>{s}</option>)}
                    </Field>
                    <Field
                        as="select"
                        name="district"
                        disabled={!values.state}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-command-500 outline-none text-sm font-mono bg-void-900 disabled:opacity-50"
                    >
                        <option value="">Select District</option>
                        {values.state && INDIAN_STATES_AND_DISTRICTS[values.state].map(d => <option key={d} value={d}>{d}</option>)}
                    </Field>
                </div>

                <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                    <Field name="location" as="textarea" placeholder="Local Address / Coordinates" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-command-500 outline-none text-sm font-mono h-20 resize-none" />
                </div>

                <div className="pt-2">
                    <NeonButton type="submit" variant="success" isLoading={isLoading} className="w-full">
                        ESTABLISH IDENTITY
                    </NeonButton>
                </div>
            </Form>
        )}
    </Formik>
);

export default Portal;
