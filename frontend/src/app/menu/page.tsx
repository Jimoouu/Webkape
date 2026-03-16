'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Search, ArrowRight, Utensils, ArrowLeft, Sparkles, Flame } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';

interface Menu {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string | null;
    image_url: string | null;
    is_available: boolean;
    discount_price: number;
}

interface CartItem extends Menu {
    quantity: number;
}

export default function MenuPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
    const [categories, setCategories] = useState<string[]>(['Semua']);
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        api.get<Menu[]>('menu/')
            .then(res => {
                setMenus(res.data);
                setFilteredMenus(res.data);
                const cats = ['Semua', ...Array.from(new Set(res.data.map(m => m.category)))];
                setCategories(cats);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let list = menus;
        if (activeCategory !== 'Semua') {
            list = list.filter(m => m.category === activeCategory);
        }
        if (search.trim() !== '') {
            list = list.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
        }
        setFilteredMenus(list);
    }, [activeCategory, search, menus]);

    const getImageSrc = (item: Menu) => {
        if (item.image_url) return item.image_url;
        if (item.image) {
            if (item.image.startsWith('http')) return item.image;
            return `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8000${item.image}`;
        }
        return null;
    };

    const addToCart = (item: Menu) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: number) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === itemId);
            if (existing && existing.quantity > 1) {
                return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
            }
            return prev.filter(i => i.id !== itemId);
        });
    };

    const currentQuantity = (itemId: number) => cart.find(i => i.id === itemId)?.quantity || 0;
    const totalItemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalPrice = cart.reduce((acc, curr) => acc + ((curr.price - (curr.discount_price || 0)) * curr.quantity), 0);

    const handleCheckout = () => {
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
            router.push('/checkout');
        }
    };

    const getCategoryEmoji = (cat: string) => {
        switch (cat.toLowerCase()) {
            case 'makanan': return '🍜';
            case 'minuman': return '🧃';
            case 'snak': return '🍟';
            default: return '🍽️';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="text-slate-400 text-sm">Memuat menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Menu</h1>
                            <p className="text-sm text-slate-500 mt-1">Pilih hidangan favorit Anda</p>
                        </div>
                        <div className="relative w-48">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari menu..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                        {categories.map(cat => (
                            <motion.button
                                key={cat}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {cat !== 'Semua' && getCategoryEmoji(cat)} {cat}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid Menu */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-6">
                <AnimatePresence>
                    {filteredMenus.map((item, i) => {
                        const imgSrc = getImageSrc(item);
                        const qty = currentQuantity(item.id);
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className={`bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm group transition-all ${item.is_available ? 'hover:shadow-md hover:border-blue-300' : 'opacity-60 grayscale'
                                    }`}
                            >
                                {/* Image */}
                                <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                                    {imgSrc ? (
                                        <Image
                                            src={imgSrc}
                                            alt={item.name}
                                            fill
                                            className={`object-cover ${item.is_available ? 'group-hover:scale-110 transition-transform duration-300' : ''}`}
                                            unoptimized
                                        />
                                    ) : (
                                        <Utensils className="w-10 h-10 text-slate-300" />
                                    )}
                                    
                                    {/* Discount Badge */}
                                    {item.is_available && item.discount_price > 0 && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white rounded-md px-2 py-1 text-[10px] font-bold">
                                            -Rp {item.discount_price.toLocaleString('id-ID')}
                                        </div>
                                    )}

                                    {/* Unavailable */}
                                    {!item.is_available && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                            <span className="bg-red-500 text-white font-bold px-3 py-1 rounded text-xs">HABIS</span>
                                        </div>
                                    )}

                                    {/* Quantity Badge */}
                                    {qty > 0 && item.is_available && (
                                        <div className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                            {qty}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-3">
                                    <h3 className="font-semibold text-sm text-slate-900 line-clamp-2">
                                        {item.name}
                                    </h3>

                                    {/* Price */}
                                    <div className="mt-2">
                                        {item.discount_price > 0 ? (
                                            <>
                                                <span className="text-xs text-slate-400 line-through">Rp {item.price.toLocaleString('id-ID')}</span>
                                                <p className="text-sm font-bold text-blue-600">Rp {(item.price - item.discount_price).toLocaleString('id-ID')}</p>
                                            </>
                                        ) : (
                                            <p className="text-sm font-bold text-slate-900">Rp {item.price.toLocaleString('id-ID')}</p>
                                        )}
                                    </div>

                                    {/* Action */}
                                    <div className="mt-3">
                                        {!item.is_available ? (
                                            <button disabled className="w-full bg-slate-100 text-slate-400 py-2 text-xs font-semibold rounded-lg cursor-not-allowed">
                                                Tidak Tersedia
                                            </button>
                                        ) : qty > 0 ? (
                                            <motion.div
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-1 bg-slate-100 rounded-lg px-1 py-1"
                                            >
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="flex-1 py-1 hover:bg-red-100 text-red-600 text-sm font-bold rounded transition"
                                                >
                                                    <Minus className="w-3.5 h-3.5 mx-auto" />
                                                </button>
                                                <span className="flex-1 font-bold text-sm text-slate-900">{qty}</span>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="flex-1 py-1 hover:bg-blue-100 text-blue-600 text-sm font-bold rounded transition"
                                                >
                                                    <Plus className="w-3.5 h-3.5 mx-auto" />
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => addToCart(item)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1"
                                            >
                                                <Plus className="w-3 h-3" /> Tambah
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filteredMenus.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Utensils className="w-12 h-12 mb-2" />
                    <p className="text-sm">Menu tidak ditemukan</p>
                </div>
            )}

            {/* Floating Cart Bar */}
            <AnimatePresence>
                {totalItemCount > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-sm w-full px-4 z-30"
                    >
                        <div className="bg-blue-600 p-4 rounded-lg shadow-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg relative">
                                    <ShoppingCart className="w-5 h-5 text-white" />
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {totalItemCount}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-100">{totalItemCount} item</p>
                                    <p className="text-base font-bold text-white">Rp {totalPrice.toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCheckout}
                                className="bg-white text-blue-600 px-4 py-2 text-xs font-bold rounded-lg hover:bg-blue-50 transition flex items-center gap-1"
                            >
                                Checkout <ArrowRight className="w-3 h-3" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
