'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, ArrowLeft, CheckCircle, ExternalLink, ShoppingBag, Loader2, Sparkles, PartyPopper } from 'lucide-react';
import api from '@/lib/api';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    discount_price?: number;
}

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [tableId, setTableId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [metode, setMetode] = useState<'qris' | 'cash'>('qris');
    const [orderId, setOrderId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [finished, setFinished] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        const storedTable = localStorage.getItem('selectedTable');
        const name = localStorage.getItem('customerName') || 'Tamu';

        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedTable) setTableId(storedTable);
        setCustomerName(name);

        if (!storedCart || !storedTable) {
            router.push('/');
        }
    }, [router]);

    const totalPrice = cart.reduce((acc, curr) => acc + ((curr.price - (curr.discount_price || 0)) * curr.quantity), 0);

    const handleSubmitOrder = async () => {
        setSubmitting(true);
        setError('');

        try {
            // Step 1: Create the order with items (REAL API CALL)
            const orderPayload = {
                table: Number(tableId),
                customer_name: customerName,
                items: cart.map(item => ({
                    menu: item.id,
                    quantity: item.quantity,
                })),
            };

            const orderRes = await api.post('orders/', orderPayload);
            const createdOrderId = orderRes.data.id;

            // Step 2: Create payment record
            try {
                await api.post('payments/', {
                    order: createdOrderId,
                    method: metode,
                    status: 'lunas',
                });
            } catch (payErr) {
                // Payment record is secondary, order already created
                console.warn('Payment record failed but order succeeded:', payErr);
            }

            setOrderId(createdOrderId);
            setFinished(true);
            localStorage.removeItem('cart');
        } catch (err: any) {
            console.error(err);
            const errDetail = err.response?.data
                ? JSON.stringify(err.response.data)
                : err.message || 'Gagal membuat pesanan.';
            setError(errDetail);
        } finally {
            setSubmitting(false);
        }
    };

    if (finished) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="max-w-md w-full bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-2xl shadow-emerald-500/10 z-10"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30"
                    >
                        <CheckCircle className="h-10 w-10 text-white" />
                    </motion.div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Pesanan Berhasil! 🎉</h1>
                    <p className="text-gray-500 text-sm mb-6">
                        Order <span className="font-bold text-emerald-600">#{orderId}</span> untuk <strong className="text-gray-800">{customerName}</strong>
                    </p>

                    <div className="bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 rounded-2xl p-6 mb-6">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Bayar</p>
                        <h2 className="text-3xl font-black text-emerald-600">Rp {totalPrice.toLocaleString('id-ID')}</h2>
                        <p className="text-xs text-gray-400 mt-2">Metode: <span className="font-bold text-gray-600">{metode === 'qris' ? 'QRIS' : 'Tunai'}</span></p>

                        {metode === 'qris' && (
                            <div className="mt-4 bg-white p-3 rounded-xl w-40 h-40 mx-auto flex items-center justify-center shadow-inner">
                                <div className="border-2 border-dashed border-gray-200 w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold rounded-lg">
                                    QR Code
                                </div>
                            </div>
                        )}

                        {metode === 'cash' && (
                            <p className="text-sm text-gray-600 mt-4 leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                                Silakan bayar di kasir atau tunggu petugas di <strong className="text-blue-600">Meja {tableId}</strong>.
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl text-sm transition"
                        >
                            Dashboard
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/')}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition flex justify-center items-center gap-1 shadow-lg shadow-emerald-500/20"
                        >
                            Order Lagi <ExternalLink className="h-3 w-3" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 flex flex-col items-center p-4 sm:p-6 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl -z-10"></div>

            <div className="w-full max-w-md">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition text-sm mb-6 mt-4 p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </motion.button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-tr from-blue-500 to-violet-500 rounded-2xl shadow-lg shadow-blue-500/20">
                        <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
                        <p className="text-xs text-gray-400">Konfirmasi & bayar pesanan</p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl mb-4"
                    >
                        ❌ {error}
                    </motion.div>
                )}

                {/* Customer Info */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
                    <p className="text-xs text-gray-400 mb-1">Pelanggan</p>
                    <p className="font-bold text-gray-900">{customerName} • <span className="text-blue-600">Meja {tableId}</span></p>
                </div>

                {/* Ringkasan */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4 shadow-sm">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">🛒 Pesanan Kamu</h2>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <div>
                                    <span className="font-bold text-gray-800">{item.name}</span>
                                    <span className="text-xs text-gray-400 ml-2">x{item.quantity}</span>
                                </div>
                                <span className="font-semibold text-gray-600">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-400 font-medium">Total Tagihan</span>
                        <span className="text-xl font-black text-blue-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {/* Metode Pembayaran */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">💳 Metode Pembayaran</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setMetode('qris')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 text-center transition-all ${metode === 'qris'
                                ? 'bg-gradient-to-br from-blue-500 to-violet-500 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            <CreditCard className="h-6 w-6" />
                            <span className="text-xs font-bold">QRIS</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setMetode('cash')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 text-center transition-all ${metode === 'cash'
                                ? 'bg-gradient-to-br from-emerald-500 to-green-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            <Wallet className="h-6 w-6" />
                            <span className="text-xs font-bold">Tunai</span>
                        </motion.button>
                    </div>
                </div>

                {/* Submit */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={submitting}
                    onClick={handleSubmitOrder}
                    className="w-full bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 font-bold text-white py-4 rounded-2xl shadow-xl shadow-violet-500/20 hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" /> Memproses Pesanan...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-5 w-5" /> Buat Pesanan & Bayar
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
