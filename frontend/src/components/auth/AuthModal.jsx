import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
};

const AuthModal = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        setIsLoading(true);
        setError('');
        try {
            const user = await AuthService.login(values.email, values.password);
            onClose();
            // Route based on role
            if (user.roles.includes('ROLE_ADMIN')) navigate('/admin/dashboard');
            else if (user.roles.includes('ROLE_OFFICER')) navigate('/officer/dashboard');
            else navigate('/citizen/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (values) => {
        setIsLoading(true);
        setError('');
        try {
            await AuthService.register(
                values.name, values.email, values.password, 'citizen',
                values.phone, values.state, values.district, values.location
            );
            setIsLogin(true); // Switch to login after success
            alert("Registration Successful! Please Log In.");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{isLogin ? 'Welcome Back' : 'Join Lifeline'}</h2>
                        <p className="text-sm text-slate-500">{isLogin ? 'Access your dashboard' : 'Create a citizen account'}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    {isLogin ? (
                        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                    ) : (
                        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
                    )}

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-600">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="ml-2 text-brand-600 font-semibold hover:underline"
                            >
                                {isLogin ? 'Register Now' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoginForm = ({ onSubmit, isLoading }) => (
    <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
            email: Yup.string().required('Required').email('Invalid email'),
            password: Yup.string().required('Required'),
        })}
        onSubmit={onSubmit}
    >
        <Form className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <Field name="email" type="email" className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" placeholder="name@example.com" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <Field name="password" type="password" className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" placeholder="Enter password" />
                </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-brand-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-700 transition flex items-center justify-center gap-2 disabled:opacity-70">
                {isLoading ? 'Authenticating...' : 'Sign In'}
                {!isLoading && <ArrowRight size={18} />}
            </button>
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
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                        <Field name="name" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
                        <Field name="email" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
                        <Field name="password" type="password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone</label>
                        <Field name="phone" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field as="select" name="state" onChange={e => { setFieldValue('state', e.target.value); setFieldValue('district', ''); }} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white">
                        <option value="">State</option>
                        {Object.keys(INDIAN_STATES_AND_DISTRICTS).map(s => <option key={s} value={s}>{s}</option>)}
                    </Field>
                    <Field as="select" name="district" disabled={!values.state} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white disabled:bg-slate-100">
                        <option value="">District</option>
                        {values.state && INDIAN_STATES_AND_DISTRICTS[values.state].map(d => <option key={d} value={d}>{d}</option>)}
                    </Field>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Location / Address</label>
                    <Field name="location" as="textarea" rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm resize-none" />
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-brand-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-700 transition disabled:opacity-70">
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </Form>
        )}
    </Formik>
);

export default AuthModal;
