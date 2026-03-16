'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, LogOut, Clock, HelpCircle, Sparkles, Gamepad2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface OrderItem {
    id: number;
    menu_name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    customer_name: string;
    table_number: number;
    total_price: number;
    status: string;
    created_at: string;
    items: OrderItem[];
}

export default function CustomerDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/login');
            return;
        }
        const name = localStorage.getItem('customerName') || 'Pelanggan';
        setUsername(name);
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get<Order[]>('orders/');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'diproses': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'menunggu': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'dibatalkan': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const getStatusEmoji = (status: string) => {
        switch (status) {
            case 'selesai': return '✅';
            case 'diproses': return '🔥';
            case 'menunggu': return '⏳';
            case 'dibatalkan': return '❌';
            default: return '📋';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-100/40 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-tr from-blue-500 to-violet-500 rounded-xl shadow-lg shadow-blue-500/20">
                            <Gamepad2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900">Halo, {username}! 👋</h1>
                            <p className="text-gray-400 text-xs">Selamat datang di ABC Game Arena</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition flex items-center gap-2 text-xs shadow-sm"
                    >
                        <LogOut className="h-4 w-4" /> Keluar
                    </motion.button>
                </div>

                {/* Promo Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 rounded-3xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center shadow-2xl shadow-violet-500/20 gap-4 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10 blur-xl"></div>
                    <div>
                        <h2 className="text-xl font-extrabold text-white mb-1 flex items-center gap-2">
                            <Sparkles className="h-5 w-5" /> Siap Menang & Kenyang?
                        </h2>
                        <p className="text-blue-100 text-xs">Pesan makanan favorit langsung ke meja permainan</p>
                    </div>
                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-violet-600 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg text-sm hover:brightness-105 transition"
                        >
                            <ShoppingCart className="h-4 w-4" /> Pesan Sekarang
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <p className="text-xs text-gray-400 mb-1">Total Pesanan</p>
                        <p className="text-2xl font-black text-gray-900">{orders.length}</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <p className="text-xs text-gray-400 mb-1">Total Belanja</p>
                        <p className="text-2xl font-black text-blue-600">Rp {orders.reduce((a, b) => a + b.total_price, 0).toLocaleString('id-ID')}</p>
                    </div>
                </div>

                {/* Orders List */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" /> Riwayat Pesanan
                    </h3>

                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order, i) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-[10px] text-gray-400">#{order.id} • {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                            <p className="font-bold text-gray-800 text-sm">Meja {order.table_number}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${getStatusBadge(order.status)}`}>
                                            {getStatusEmoji(order.status)} {order.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-50 pt-3 flex flex-wrap gap-2">
                                        {order.items?.map((item) => (
                                            <span key={item.id} className="inline-flex items-center text-[11px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100 font-medium">
                                                {item.menu_name} ×{item.quantity}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-3 flex justify-between items-center pt-3 border-t border-gray-50">
                                        <p className="text-xs text-gray-400">Total</p>
                                        <p className="font-black text-blue-600">Rp {order.total_price.toLocaleString('id-ID')}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {orders.length === 0 && (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <HelpCircle className="h-10 w-10 mx-auto mb-2 text-gray-300 stroke-1" />
                                    <p className="text-sm text-gray-400">Belum ada riwayat pesanan.</p>
                                    <p className="text-xs text-gray-300 mt-1">Ayo pesan sekarang! 🎮</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
