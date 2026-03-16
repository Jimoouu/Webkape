'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, LogIn } from 'lucide-react';
import api from '@/lib/api';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('token/', { username, password });
            localStorage.setItem('admin_token', res.data.access);
            localStorage.setItem('admin_refresh', res.data.refresh);
            router.push('/admin/dashboard');
        } catch (err: any) {
            console.error(err);
            setError('Username atau password salah.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute opacity-10 blur-3xl -left-20 bg-blue-500 w-96 h-96 rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl z-10"
            >
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="p-4 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-2xl shadow-lg mb-4">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Login</h1>
                    <p className="text-slate-400 text-xs mt-1">ABC Game Arena Panel</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Masukkan username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 transition text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 transition text-sm"
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 font-bold text-white py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 text-sm"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                        <LogIn className="h-4 w-4" />
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
