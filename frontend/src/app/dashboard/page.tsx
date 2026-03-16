'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, LogOut, Clock, HelpCircle, Sparkles, Gamepad2, TrendingUp, X, RefreshCw, ChevronDown, MapPin, Phone, Mail } from 'lucide-react';
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

const OrderStatusTimeline = ({ status }: { status: string }) => {
    const stages = [
        { key: 'menunggu', label: 'Menunggu', icon: '📋' },
        { key: 'diproses', label: 'Diproses', icon: '🔥' },
        { key: 'selesai', label: 'Selesai', icon: '✅' },
    ];

    const currentIndex = stages.findIndex(s => s.key === status);

    return (
        <div className="flex items-center justify-between mb-4">
            {stages.map((stage, index) => (
                <div key={stage.key} className="flex flex-col items-center flex-1">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                            index <= currentIndex
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                                : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                        {stage.icon}
                    </motion.div>
                    <span className="text-[10px] font-semibold mt-1 text-gray-600">{stage.label}</span>
                    {index < stages.length - 1 && (
                        <div className={`h-1 flex-1 mx-1 mt-5 rounded-full transition-colors ${
                            index < currentIndex ? 'bg-blue-500' : 'bg-gray-200'
                        }`} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default function CustomerDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
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

    useEffect(() => {
        fetchOrders();
        
        // Real-time polling every 5 seconds
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchOrders();
        setIsRefreshing(false);
    };

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

    const getEstimatedTime = (status: string) => {
        switch (status) {
            case 'menunggu': return '15-20 menit';
            case 'diproses': return '5-10 menit';
            case 'selesai': return 'Siap';
            default: return '-';
        }
    };

    return (
        <>
            <div className="min-h-screen bg-white p-4 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header with Refresh */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Halo, {username}!</h1>
                            <p className="text-slate-500 text-sm mt-1">Riwayat pesanan Anda</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:bg-blue-100 hover:border-blue-300 transition flex items-center gap-2 text-xs disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-red-600 hover:bg-red-100 hover:border-red-300 transition flex items-center gap-2 text-xs"
                            >
                                <LogOut className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>

                {/* CTA Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-600 rounded-lg p-6 mb-8 flex justify-between items-center shadow-md gap-4"
                >
                    <div>
                        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" /> Pesan Lagi?
                        </h2>
                        <p className="text-blue-100 text-sm">Makanan favorit siap diantar ke meja</p>
                    </div>
                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white text-blue-600 font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md text-sm hover:brightness-105 transition whitespace-nowrap"
                        >
                            <ShoppingCart className="w-4 h-4" /> Pesan
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <p className="text-xs text-slate-500 mb-2">Total Pesanan</p>
                        <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <p className="text-xs text-slate-500 mb-2">Total Belanja</p>
                        <p className="text-2xl font-bold text-blue-600">Rp {orders.reduce((a, b) => a + b.total_price, 0).toLocaleString('id-ID')}</p>
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
                            <div className="space-y-3">
                                {orders.map((order, i) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
                                    >
                                        <button
                                            onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                            className="w-full text-left p-5 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <p className="text-[10px] text-gray-400">#{order.id} • {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                    <p className="font-bold text-gray-800 text-sm">Meja {order.table_number}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${getStatusBadge(order.status)}`}>
                                                        {getStatusEmoji(order.status)} {order.status.toUpperCase()}
                                                    </span>
                                                    <motion.div
                                                        animate={{ rotate: expandedOrderId === order.id ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                                    </motion.div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {order.items?.slice(0, 2).map((item) => (
                                                    <span key={item.id} className="inline-flex items-center text-[11px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100 font-medium">
                                                        {item.menu_name} ×{item.quantity}
                                                    </span>
                                                ))}
                                                {order.items?.length > 2 && (
                                                    <span className="inline-flex items-center text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-200 font-medium">
                                                        +{order.items.length - 2} item
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-3 flex justify-between items-center pt-3 border-t border-gray-50">
                                                <p className="text-xs text-gray-400">Total</p>
                                                <p className="font-black text-blue-600">Rp {order.total_price.toLocaleString('id-ID')}</p>
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {expandedOrderId === order.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-gray-100 overflow-hidden"
                                                >
                                                    <div className="p-5 bg-gradient-to-br from-blue-50/50 to-violet-50/50 space-y-4">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-900 mb-3">Status Pesanan</h4>
                                                            <OrderStatusTimeline status={order.status} />
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-900 mb-3">Estimasi Waktu</h4>
                                                            <p className="text-sm text-blue-600 font-bold">{getEstimatedTime(order.status)}</p>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-900 mb-3">Detail Pesanan</h4>
                                                            <div className="space-y-2">
                                                                {order.items?.map((item) => (
                                                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                                                        <span className="text-gray-600">{item.menu_name}</span>
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-gray-400">×{item.quantity}</span>
                                                                            <span className="font-bold text-gray-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 pt-3">
                                                            <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl text-sm transition"
                                                            >
                                                                Pesan Lagi
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl text-sm transition"
                                                            >
                                                                Berikan Rating
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
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

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedOrder(null)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="relative p-6">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                                
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Pesanan #{selectedOrder.id}</h2>
                                
                                <div className="space-y-6">
                                    <OrderStatusTimeline status={selectedOrder.status} />
                                    
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-3">Detail Items</h3>
                                        <div className="space-y-2">
                                            {selectedOrder.items?.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">{item.menu_name}</span>
                                                    <span className="font-bold text-gray-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-gray-900">Total</span>
                                            <span className="text-xl font-black text-blue-600">Rp {selectedOrder.total_price.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
