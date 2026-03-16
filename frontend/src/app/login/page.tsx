'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gamepad2, LogIn, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
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
            localStorage.setItem('is_staff', String(res.data.is_staff));
            localStorage.setItem('user_id', String(res.data.id));
            localStorage.setItem('customerName', res.data.username);

            if (res.data.is_staff) {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error(err);
            setError('Username atau password salah!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-100/20 to-pink-100/20 rounded-full blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="max-w-sm w-full bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 z-10"
            >
                <div className="flex flex-col items-center text-center mb-8">
                    <motion.div
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        className="p-4 bg-gradient-to-tr from-blue-500 to-violet-500 rounded-2xl shadow-lg shadow-blue-500/30 mb-4"
                    >
                        <Gamepad2 className="h-8 w-8 text-white" />
                    </motion.div>
                    <h1 className="text-2xl font-black text-gray-900">ABC Game Arena</h1>
                    <p className="text-gray-400 text-sm mt-1">Masuk ke akun Anda</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center font-medium"
                    >
                        ❌ {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition placeholder:text-gray-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition placeholder:text-gray-300"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-500/20 hover:brightness-105 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                    >
                        {loading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Masuk...</>
                        ) : (
                            <><LogIn className="h-4 w-4" /> Masuk</>
                        )}
                    </motion.button>
                </form>

                <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-300 text-center">
                        Admin: admin/admin • Pelanggan: pelanggan/pelanggan
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
