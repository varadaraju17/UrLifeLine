import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Phone } from 'lucide-react';
import AuthService from '../../services/auth.service';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (values) => {
        setIsLoading(true);
        setError('');
        try {
            const user = await AuthService.login(values.email, values.password);
            if (user.roles.includes('ROLE_ADMIN')) navigate('/admin/dashboard');
            else if (user.roles.includes('ROLE_OFFICER')) navigate('/officer/dashboard');
            else navigate('/citizen/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (values) => {
        setIsLoading(true);
        setError('');
        try {
            await AuthService.register(values.name, values.email, values.password, 'citizen', values.phone, values.state, values.district, values.location);
            setIsLogin(true);
            alert("Account created! Please log in.");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Image/Info */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-12">
                <img
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
                    alt="Command Center"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="relative z-10 text-white max-w-lg">
                    <h2 className="text-4xl font-bold mb-6">Secure Access Portal</h2>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        Authorized personnel and citizens enter here.
                        Your data is encrypted and protected by Sentinel protocols.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white">
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 sm:left-auto flex items-center gap-2 text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft size={20} /> Back to Home
                </button>

                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-slate-500 mb-8">
                        {isLogin ? 'Enter your credentials to access the dashboard.' : 'Join the network to stay safe and informed.'}
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 font-medium">
                            {error}
                        </div>
                    )}

                    {isLogin ? (
                        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                    ) : (
                        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-slate-600">
                            {isLogin ? "New to Sentinel?" : "Already have an account?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-blue-600 font-bold hover:underline"
                            >
                                {isLogin ? 'Create Account' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoginForm = ({ onSubmit, isLoading }) => (
    <Formik initialValues={{ email: '', password: '' }} onSubmit={onSubmit} validationSchema={Yup.object({ email: Yup.string().required().email(), password: Yup.string().required() })}>
        <Form className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <Field name="email" type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <Field name="password" type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                {isLoading ? 'Loading...' : 'Sign In'}
            </button>
        </Form>
    </Formik>
);

const RegisterForm = ({ onSubmit, isLoading }) => (
    <Formik initialValues={{ name: '', email: '', password: '', phone: '', state: 'Kerala', district: 'Kochi', location: '' }} onSubmit={onSubmit} validationSchema={Yup.object({ name: Yup.string().required(), email: Yup.string().email().required(), password: Yup.string().required() })}>
        <Form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Field name="name" placeholder="Full Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <Field name="email" placeholder="Email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Field name="password" type="password" placeholder="Password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <Field name="phone" placeholder="Phone" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                {isLoading ? 'Creating...' : 'Join Network'}
            </button>
        </Form>
    </Formik>
);

export default AuthPage;
