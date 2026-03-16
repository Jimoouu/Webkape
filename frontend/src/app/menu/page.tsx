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
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-sky-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    <p className="text-gray-400 text-sm animate-pulse">Memuat menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-sky-50 pb-28 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/30 blur-3xl rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-100/30 blur-3xl rounded-full -z-10"></div>

            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 py-4 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => router.back()}
                            className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </motion.button>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <Flame className="h-5 w-5 text-orange-500" /> Menu
                            </h1>
                            <p className="text-xs text-gray-400">Pilih hidangan favorit Anda</p>
                        </div>
                    </div>

                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari menu..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-300 transition shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 py-4 scrollbar-none sticky top-[73px] bg-white/70 backdrop-blur-md z-10 border-b border-gray-100">
                <div className="max-w-6xl mx-auto flex gap-2 w-full">
                    {categories.map(cat => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === cat
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                                : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 shadow-sm'
                                }`}
                        >
                            {cat !== 'Semua' && getCategoryEmoji(cat)} {cat}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Grid Menu */}
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-6">
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
                                className={`bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm group relative transition-all ${item.is_available ? 'hover:shadow-lg hover:border-blue-100' : 'opacity-70 grayscale'
                                    }`}
                            >
                                <div className="h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                    {imgSrc ? (
                                        <Image
                                            src={imgSrc}
                                            alt={item.name}
                                            fill
                                            className={`object-cover ${item.is_available ? 'group-hover:scale-110 transition-transform duration-500' : ''}`}
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-300">
                                            <Utensils className="h-10 w-10 mb-1" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                                    {/* Category Badge */}
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md rounded-full px-2.5 py-1 text-[10px] font-bold text-gray-600 shadow-sm">
                                        {getCategoryEmoji(item.category)} {item.category}
                                    </div>

                                    {/* Discount Badge */}
                                    {item.is_available && item.discount_price > 0 && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white rounded-full px-2.5 py-1 text-[10px] font-bold shadow-md shadow-red-500/30 flex items-center gap-1">
                                            <Sparkles className="h-3 w-3" /> Hemat Rp {item.discount_price.toLocaleString('id-ID')}
                                        </div>
                                    )}

                                    {/* Unavailable Badge overlay */}
                                    {!item.is_available && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                            <span className="bg-red-500 text-white font-black px-4 py-2 rounded-xl text-sm shadow-xl transform -rotate-12">HABIS</span>
                                        </div>
                                    )}

                                    {/* Quantity indicator */}
                                    {qty > 0 && item.is_available && (
                                        <div className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-white">
                                            {qty}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className={`font-bold text-sm line-clamp-1 transition ${item.is_available ? 'text-gray-800 group-hover:text-blue-600' : 'text-gray-500'}`}>
                                        {item.name}
                                    </h3>

                                    <div className="mt-1 flex flex-col">
                                        {item.discount_price > 0 ? (
                                            <>
                                                <span className="text-xs text-gray-400 line-through font-medium">Rp {item.price.toLocaleString('id-ID')}</span>
                                                <span className="text-sm font-extrabold text-orange-600">Rp {(item.price - item.discount_price).toLocaleString('id-ID')}</span>
                                            </>
                                        ) : (
                                            <span className="text-sm font-extrabold text-orange-600">Rp {item.price.toLocaleString('id-ID')}</span>
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        {!item.is_available ? (
                                            <button disabled className="w-full bg-gray-100 text-gray-400 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold cursor-not-allowed">
                                                Tidak Tersedia
                                            </button>
                                        ) : qty > 0 ? (
                                            <motion.div
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1 w-full justify-between"
                                            >
                                                <motion.button
                                                    whileTap={{ scale: 0.8 }}
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </motion.button>
                                                <span className="font-bold text-sm text-center w-full text-gray-900">{qty}</span>
                                                <motion.button
                                                    whileTap={{ scale: 0.8 }}
                                                    onClick={() => addToCart(item)}
                                                    className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-500 transition"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </motion.button>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => addToCart(item)}
                                                className="w-full bg-gray-50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500 hover:text-white border border-gray-200 rounded-xl px-4 py-2 flex items-center justify-center gap-1 text-xs font-bold text-gray-500 transition-all hover:border-transparent hover:shadow-lg"
                                            >
                                                Tambah <Plus className="h-3 w-3 ml-1" />
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
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Utensils className="h-12 w-12 mb-2 stroke-1" />
                    <p className="text-sm">Menu tidak ditemukan.</p>
                </div>
            )}

            {/* Floating Cart Bar */}
            <AnimatePresence>
                {totalItemCount > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md w-full px-4 z-30"
                    >
                        <div className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 p-4 rounded-2xl shadow-2xl shadow-violet-500/30 flex items-center justify-between border border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2.5 rounded-xl relative flex">
                                    <ShoppingCart className="h-5 w-5 text-white" />
                                    <div className="absolute -top-1 -right-1 bg-red-500 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center text-white ring-2 ring-violet-500">
                                        {totalItemCount}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/80 font-medium">{totalItemCount} item</p>
                                    <p className="text-sm font-extrabold text-white">Rp {totalPrice.toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCheckout}
                                className="bg-white text-violet-600 px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1 shadow-lg hover:brightness-105 transition"
                            >
                                Checkout <ArrowRight className="h-3 w-3" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
