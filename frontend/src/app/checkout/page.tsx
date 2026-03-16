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
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="w-full max-w-md text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
                        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                        <CheckCircle className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Pesanan Berhasil!</h1>
                    <p className="text-slate-600 text-sm mb-8">
                        Order <span className="font-bold text-blue-600">#{orderId}</span> telah dibuat untuk <strong>{customerName}</strong>
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                        <p className="text-xs text-slate-500 uppercase mb-1">Total Pembayaran</p>
                        <h2 className="text-3xl font-bold text-slate-900">Rp {totalPrice.toLocaleString('id-ID')}</h2>
                        <p className="text-sm text-slate-600 mt-3">Metode: <span className="font-semibold">{metode === 'qris' ? 'QRIS' : 'Tunai'}</span></p>

                        {metode === 'cash' && (
                            <p className="text-sm text-slate-600 mt-4 bg-white p-3 rounded border border-slate-200">
                                Silakan bayar di kasir untuk <strong className="text-blue-600">Meja {tableId}</strong>
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2.5 rounded-lg transition"
                        >
                            Dashboard
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-1"
                        >
                            Order Lagi <ExternalLink className="w-3 h-3" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-4">
            <div className="w-full max-w-md pt-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
                    <p className="text-slate-500 text-sm mt-1">Konfirmasi pesanan Anda</p>
                </div>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg mb-4"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Customer Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                    <p className="text-xs text-slate-500 mb-1">Pelanggan</p>
                    <p className="font-semibold text-slate-900">{customerName}</p>
                    <p className="text-sm text-blue-600 font-medium">Meja {tableId}</p>
                </div>

                {/* Order Summary */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
                    <h2 className="text-sm font-bold text-slate-900 mb-3">Pesanan</h2>
                    <div className="space-y-2 max-h-40 overflow-y-auto mb-3 pb-3 border-b border-slate-200">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <div className="text-slate-900">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-slate-500 ml-2">×{item.quantity}</span>
                                </div>
                                <span className="font-medium text-slate-900">Rp {((item.price - (item.discount_price || 0)) * item.quantity).toLocaleString('id-ID')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Total</span>
                        <span className="text-lg font-bold text-blue-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                    <h2 className="text-sm font-bold text-slate-900 mb-3">Metode Pembayaran</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setMetode('qris')}
                            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${metode === 'qris'
                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            <CreditCard className="w-6 h-6" />
                            <span className="text-xs font-semibold">QRIS</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setMetode('cash')}
                            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${metode === 'cash'
                                ? 'bg-green-50 border-green-500 text-green-600'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            <Wallet className="w-6 h-6" />
                            <span className="text-xs font-semibold">Tunai</span>
                        </motion.button>
                    </div>
                </div>

                {/* Submit */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={submitting}
                    onClick={handleSubmitOrder}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" /> Buat Pesanan
                        </>
                    )}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => router.back()}
                    className="w-full mt-3 bg-white border border-slate-200 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition"
                >
                    Kembali
                </motion.button>
            </div>
        </div>
    );
}
