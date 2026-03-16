'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Utensils, DollarSign, Tag, Link2, Edit2, CheckCircle2, XCircle } from 'lucide-react';
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

export default function AdminMenuPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [discountPrice, setDiscountPrice] = useState('');

    const fetchMenus = async () => {
        setLoading(true);
        try {
            const res = await api.get<Menu[]>('menu/');
            setMenus(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const getImageSrc = (menu: Menu) => {
        if (menu.image_url) return menu.image_url;
        if (menu.image) {
            if (menu.image.startsWith('http')) return menu.image;
            return `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8000${menu.image}`;
        }
        return null;
    };

    const handleEditClick = (menu: Menu) => {
        setEditingId(menu.id);
        setName(menu.name);
        setCategory(menu.category);
        setPrice(menu.price.toString());
        setImageUrl(menu.image_url || '');
        setIsAvailable(menu.is_available);
        setDiscountPrice(menu.discount_price.toString());
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setName('');
        setCategory('');
        setPrice('');
        setImageUrl('');
        setIsAvailable(true);
        setDiscountPrice('');
    };

    const handleSubmitMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            name,
            category,
            price: Number(price),
            image_url: imageUrl || null,
            is_available: isAvailable,
            discount_price: discountPrice ? Number(discountPrice) : 0,
        };

        try {
            if (editingId) {
                await api.patch(`menu/${editingId}/`, payload);
            } else {
                await api.post('menu/', payload);
            }
            handleCancelEdit();
            fetchMenus();
        } catch (err) {
            console.error(err);
            alert(`Gagal ${editingId ? 'mengedit' : 'menambah'} menu.`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteMenu = async (id: number) => {
        if (confirm('Yakin ingin menghapus item ini?')) {
            try {
                await api.delete(`menu/${id}/`);
                fetchMenus();
            } catch (err) {
                console.error(err);
                alert('Gagal menghapus menu.');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Kelola Menu</h1>
                    <p className="text-gray-400 text-sm mt-1">Tambah, edit, atau hapus item di menu</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Form Panel */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmitMenu} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 sticky top-8 shadow-sm max-h-fit lg:max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {editingId ? <Edit2 className="h-5 w-5 text-amber-500" /> : <Plus className="h-5 w-5 text-blue-500" />}
                                {editingId ? 'Edit Menu' : 'Tambah Menu Baru'}
                            </h2>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="text-xs text-gray-400 hover:text-gray-600 transition">
                                    Batal
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Menu</label>
                                <div className="relative">
                                    <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-10 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                        placeholder="Contoh: Nasi Goreng"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-10 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                        placeholder="Makanan / Minuman / Snak"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Harga (Rp)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-10 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                            placeholder="15000"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Diskon (Rp)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                                        <input
                                            type="number"
                                            value={discountPrice}
                                            onChange={(e) => setDiscountPrice(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-10 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL Gambar (Online)</label>
                                <div className="relative">
                                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-10 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                                
                                {imageUrl && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center h-32"
                                    >
                                        <Image
                                            src={imageUrl}
                                            alt="Preview"
                                            width={200}
                                            height={200}
                                            className="object-cover w-full h-full"
                                            onError={(e) => {
                                                console.error('Image load error');
                                            }}
                                            unoptimized
                                        />
                                    </motion.div>
                                )}
                            </div>

                            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                                <div className="flex items-center gap-2">
                                    {isAvailable ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                    <span className="text-sm font-bold text-gray-700">Tersedia (In Stock)</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded"
                                    checked={isAvailable}
                                    onChange={(e) => setIsAvailable(e.target.checked)}
                                />
                            </label>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={submitting}
                                type="submit"
                                className={`w-full text-white font-bold py-2.5 rounded-xl text-sm transition shadow-lg disabled:opacity-50 ${editingId ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-amber-500/20' : 'bg-gradient-to-r from-blue-500 to-violet-500 shadow-blue-500/20'}`}
                            >
                                {submitting ? 'Menyimpan...' : editingId ? '💾 Update Menu' : '✨ Simpan Menu'}
                            </motion.button>
                        </div>
                    </form>
                </div>

                {/* List Panel */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Daftar Menu ({menus.length})</h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-y-auto max-h-[80vh]">
                            <AnimatePresence>
                                {menus.map((menu) => {
                                    const imgSrc = getImageSrc(menu);
                                    return (
                                        <motion.div
                                            key={menu.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className={`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4 group hover:bg-blue-50 hover:border-blue-200 transition-all ${!menu.is_available ? 'opacity-60 grayscale' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-14 w-14 bg-white rounded-xl flex items-center justify-center text-gray-400 relative overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                                                    {imgSrc ? (
                                                        <Image
                                                            src={imgSrc}
                                                            alt={menu.name}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <Utensils className="h-5 w-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{menu.name}</h4>
                                                    <p className="text-[10px] text-gray-400">{menu.category} {menu.discount_price > 0 && <span className="text-red-500 font-bold ml-1">Disc Rp {menu.discount_price.toLocaleString('id-ID')}</span>}</p>
                                                    <p className="text-xs font-black text-blue-600 mt-0.5">
                                                        {menu.discount_price > 0 ? (
                                                            <span>Rp {(menu.price - menu.discount_price).toLocaleString('id-ID')} <span className="line-through text-gray-400 font-medium ml-1">Rp {menu.price.toLocaleString('id-ID')}</span></span>
                                                        ) : (
                                                            <span>Rp {menu.price.toLocaleString('id-ID')}</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-1">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleEditClick(menu)}
                                                    className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDeleteMenu(menu.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            {menus.length === 0 && (
                                <p className="text-gray-400 text-sm py-10 col-span-2 text-center">Belum ada item menu.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

