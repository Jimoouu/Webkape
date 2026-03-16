'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, TableProperties } from 'lucide-react';
import api from '@/lib/api';

interface Table {
    id: number;
    number: number;
    is_available?: boolean;
}

export default function AdminTablesPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [number, setNumber] = useState('');

    const fetchTables = async () => {
        setLoading(true);
        try {
            const res = await api.get<Table[]>('tables/');
            setTables(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleAddTable = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);

        try {
            await api.post('tables/', { number: Number(number) });
            setNumber('');
            fetchTables();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.number || 'Gagal menambah meja.');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteTable = async (id: number) => {
        if (confirm('Yakin ingin menghapus meja ini?')) {
            try {
                await api.delete(`tables/${id}/`);
                fetchTables();
            } catch (err) {
                console.error(err);
                alert('Gagal menghapus meja.');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Kelola Meja</h1>
                    <p className="text-gray-400 text-sm mt-1">Atur nomor meja yang tersedia</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <form onSubmit={handleAddTable} className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-8 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Plus className="h-5 w-5 text-blue-500" /> Tambah Meja
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nomor Meja</label>
                                <input
                                    type="number"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                    placeholder="Contoh: 1, 2, 3..."
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={adding}
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-violet-500 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-lg shadow-blue-500/10 disabled:opacity-50"
                            >
                                {adding ? 'Menyimpan...' : '✨ Simpan Meja'}
                            </motion.button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Daftar Meja ({tables.length})</h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <AnimatePresence>
                                {tables.map((table) => (
                                    <motion.div
                                        key={table.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={`border rounded-xl px-4 py-3 flex items-center justify-between group transition-all ${table.is_available === false
                                            ? 'bg-red-50 border-red-200'
                                            : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <TableProperties className={`h-4 w-4 ${table.is_available === false ? 'text-red-500' : 'text-blue-500'}`} />
                                            <div className="flex flex-col">
                                                <span className={`font-bold text-sm ${table.is_available === false ? 'text-red-800' : 'text-gray-800'}`}>Meja {table.number}</span>
                                                {table.is_available === false && (
                                                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Terisi</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDeleteTable(table.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-lg transition shadow-sm bg-white"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {tables.length === 0 && (
                                <p className="text-gray-400 text-sm py-10 col-span-4 text-center">Belum ada meja.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
