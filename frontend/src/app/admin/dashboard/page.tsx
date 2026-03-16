'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, ShoppingBag, CheckCheck, Calendar,
    ArrowUpRight, TrendingUp, Download, Filter
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

interface Stats {
    total_revenue: number;
    total_orders: number;
    completed_orders: number;
    todays_orders: number;
    revenue_trend: any[];
    top_menus: any[];
    table_usage: any[];
}

interface Order {
    id: number;
    customer_name: string;
    table_number: number;
    total_price: number;
    status: string;
    created_at: string;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(7);
    const reportRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
        try {
            const statsRes = await api.get<Stats>(`orders/stats/?period=${period}`);
            setStats(statsRes.data);

            const ordersRes = await api.get<Order[]>('orders/');
            setRecentOrders(ordersRes.data.slice(0, 5));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [period]);

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;

        // Dynamically import html2pdf for client-side only use
        const html2pdf = (await import('html2pdf.js')).default;

        const element = reportRef.current;
        const opt = {
            margin: 10,
            filename: `Laporan_Resto_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };

        html2pdf().set(opt).from(element).save();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400 text-sm">Memuat data analitik...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        { name: 'Total Pendapatan', value: `Rp ${(stats?.total_revenue || 0).toLocaleString('id-ID')}`, icon: DollarSign, color: 'from-emerald-400 to-green-500', bgLight: 'bg-emerald-50', textColor: 'text-emerald-600' },
        { name: 'Total Pesanan', value: stats?.total_orders || 0, icon: ShoppingBag, color: 'from-blue-400 to-indigo-500', bgLight: 'bg-blue-50', textColor: 'text-blue-600' },
        { name: 'Pesanan Selesai', value: stats?.completed_orders || 0, icon: CheckCheck, color: 'from-violet-400 to-purple-500', bgLight: 'bg-violet-50', textColor: 'text-violet-600' },
        { name: 'Pesanan Hari Ini', value: stats?.todays_orders || 0, icon: Calendar, color: 'from-amber-400 to-orange-500', bgLight: 'bg-amber-50', textColor: 'text-amber-600' },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'diproses': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'menunggu': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    return (
        <div ref={reportRef}>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-blue-500" /> Dashboard Analitik
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Pantau performa resto dan tren penjualan secara real-time</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setPeriod(7)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${period === 7 ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            7 Hari
                        </button>
                        <button
                            onClick={() => setPeriod(30)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${period === 30 ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            30 Hari
                        </button>
                    </div>
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        <Download className="h-4 w-4" /> Export PDF
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl rounded-full -mr-10 -mt-10`}></div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 ${stat.bgLight} rounded-xl`}>
                                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{stat.name}</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">{stat.value}</h2>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Tren Pendapatan</h2>
                            <p className="text-xs text-gray-400">Akumulasi penjualan {period} hari terakhir</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.revenue_trend || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => `Rp ${val / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Top Menus */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-6 font-primary">Menu Terlaris</h2>
                    <div className="space-y-4">
                        {(stats?.top_menus || []).map((menu, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">{menu.name}</span>
                                        <span className="text-[10px] text-gray-400">{menu.sales} porsi terjual</span>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-gray-900">
                                    Rp {(menu.revenue / 1000).toFixed(0)}k
                                </span>
                            </div>
                        ))}
                        {(!stats?.top_menus || stats.top_menus.length === 0) && (
                            <p className="text-center py-10 text-gray-300 text-sm">Belum ada data penjualan.</p>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {/* Table Utilization */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Penggunaan Meja</h2>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.table_usage || []}>
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} hide />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none' }}
                                />
                                <Bar dataKey="usages" radius={[10, 10, 10, 10]} barSize={30}>
                                    {(stats?.table_usage || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Recent Orders Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Riwayat Terakhir</h2>
                        <Link href="/admin/orders" className="text-xs font-bold text-blue-500 hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                                        {order.table_number}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">{order.customer_name}</span>
                                        <span className="text-[10px] text-gray-400">{new Date(order.created_at).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-black text-gray-900">Rp {order.total_price.toLocaleString()}</span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${getStatusStyle(order.status)} uppercase`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
