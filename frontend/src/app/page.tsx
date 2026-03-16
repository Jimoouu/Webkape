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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 text-sm animate-pulse">Memuat data meja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 opacity-30 blur-3xl -left-20 bg-blue-200 w-96 h-96 rounded-full"></div>
      <div className="absolute bottom-0 opacity-30 blur-3xl -right-20 bg-violet-200 w-96 h-96 rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition text-sm mb-6 p-2 bg-gray-50 border border-gray-200 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </motion.button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 bg-gradient-to-tr from-blue-500 to-violet-500 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
            <Gamepad2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Pilih Meja
          </h1>
          <p className="text-gray-400 text-sm mt-1">Pilih meja dan mulai pesan makanan</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Nama Pelanggan
            </label>
            <input
              type="text"
              placeholder="Masukkan nama Anda..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Pilih Meja
            </label>
            <div className="grid grid-cols-5 gap-3 max-h-52 overflow-y-auto pr-1">
              {tables.map(table => {
                const isSelected = selectedTable === table.id;
                const isAvailable = table.is_available !== false; // handle case if undefined

                return (
                  <motion.button
                    key={table.id}
                    title={isAvailable ? `Pilih meja ${table.number}` : `Meja ${table.number} sedang dipakai`}
                    whileHover={isAvailable ? { scale: 1.08 } : {}}
                    whileTap={isAvailable ? { scale: 0.92 } : {}}
                    onClick={() => isAvailable && setSelectedTable(table.id)}
                    disabled={!isAvailable}
                    className={`relative p-3 rounded-xl border-2 font-bold text-center transition-all ${!isAvailable
                      ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed opacity-75'
                      : isSelected
                        ? 'bg-gradient-to-br from-blue-500 to-violet-500 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600 hover:border-blue-300'
                      }`}
                  >
                    {table.number}
                    {isSelected && isAvailable && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!selectedTable || !customerName.trim()}
            onClick={handleStartOrder}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm transition-all ${selectedTable && customerName.trim()
              ? 'bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20 hover:brightness-110'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200'
              }`}
          >
            Mulai Pesan
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
