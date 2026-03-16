'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, ArrowLeft, Gamepad2 } from 'lucide-react';
import api from '@/lib/api';

interface Table {
  id: number;
  number: number;
  is_available: boolean;
}

export default function Home() {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/login');
      return;
    }
    const storedName = localStorage.getItem('customerName');
    if (storedName) setCustomerName(storedName);

    api.get<Table[]>('tables/')
      .then(res => {
        setTables(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const handleStartOrder = () => {
    if (selectedTable && customerName.trim()) {
      localStorage.setItem('selectedTable', selectedTable.toString());
      localStorage.setItem('customerName', customerName);
      router.push('/menu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-slate-400 text-sm">Memuat data meja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pilih Meja</h1>
            <p className="text-slate-500 text-sm mt-1">Masukkan nama dan pilih nomor meja</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer Name Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Nama Pelanggan
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Table Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Nomor Meja
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {tables.map(table => {
                const isSelected = selectedTable === table.id;
                const isAvailable = table.is_available !== false;

                return (
                  <motion.button
                    key={table.id}
                    title={isAvailable ? `Meja ${table.number}` : `Meja ${table.number} tidak tersedia`}
                    whileHover={isAvailable ? { scale: 1.05 } : {}}
                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                    onClick={() => isAvailable && setSelectedTable(table.id)}
                    disabled={!isAvailable}
                    className={`aspect-square flex items-center justify-center rounded-lg font-semibold text-sm transition-all ${
                      !isAvailable
                        ? 'bg-red-100 text-red-400 cursor-not-allowed border border-red-200'
                        : isSelected
                        ? 'bg-blue-600 text-white border-2 border-blue-700 shadow-md shadow-blue-600/30'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {table.number}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={selectedTable && customerName.trim() ? { scale: 1.01 } : {}}
            whileTap={selectedTable && customerName.trim() ? { scale: 0.99 } : {}}
            disabled={!selectedTable || !customerName.trim()}
            onClick={handleStartOrder}
            className="w-full mt-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
          >
            Lanjut ke Menu
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
