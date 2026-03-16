'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check, Clock, Play, AlertCircle, Sparkles } from 'lucide-react';
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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
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
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            await api.patch(`orders/${orderId}/`, { status: newStatus });
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert('Gagal mengupdate status.');
        }
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

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-blue-500" /> Manajemen Pesanan
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">Daftar pesanan pelanggan (auto-refresh 10 detik)</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchOrders}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition flex items-center gap-2 text-sm shadow-sm w-fit"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </motion.button>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex flex-col gap-4 pb-4 border-b border-gray-100">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="bg-blue-50 text-blue-600 font-black px-3 py-2 rounded-xl border border-blue-100 text-sm flex-shrink-0">
                                            {order.table_number}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{order.customer_name}</h3>
                                            <p className="text-[10px] text-gray-400">#{order.id} • {new Date(order.created_at).toLocaleString('id-ID', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-gray-400">Total</p>
                                        <p className="font-black text-blue-600 text-sm sm:text-base">Rp {order.total_price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border flex-shrink-0 ${getStatusBadge(order.status)}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="py-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Item Dipesan:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex justify-between items-center text-sm">
                                            <span className="text-gray-700 font-medium">{item.menu_name}</span>
                                            <span className="text-gray-400 font-bold ml-2">×{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                                {order.status === 'menunggu' && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => updateStatus(order.id, 'diproses')}
                                        className="bg-gradient-to-r from-amber-400 to-orange-400 hover:brightness-105 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition shadow-lg shadow-amber-500/20"
                                    >
                                        <Play className="h-3 w-3 fill-current" /> Proses
                                    </motion.button>
                                )}
                                {order.status === 'diproses' && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => updateStatus(order.id, 'selesai')}
                                        className="bg-gradient-to-r from-emerald-400 to-green-500 hover:brightness-105 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition shadow-lg shadow-emerald-500/20"
                                    >
                                        <Check className="h-3 w-3" /> Selesai
                                    </motion.button>
                                )}
                                {(order.status === 'menunggu' || order.status === 'diproses') && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => updateStatus(order.id, 'dibatalkan')}
                                        className="bg-white hover:bg-red-50 text-red-400 hover:text-red-600 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition border border-gray-200 hover:border-red-200"
                                    >
                                        <AlertCircle className="h-3 w-3" /> Batalkan
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {orders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300 stroke-1" />
                        <p className="text-gray-400">Tidak ada pesanan masuk.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
