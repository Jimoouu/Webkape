'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutDashboard, Utensils, ClipboardList, TableProperties, LogOut, Gamepad2, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (pathname !== '/admin/login') {
            const token = localStorage.getItem('admin_token');
            const isStaff = localStorage.getItem('is_staff') === 'true';
            if (!token || !isStaff) {
                router.push('/login');
            }
        }
    }, [pathname, router]);

    if (!mounted) return null;

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'Menu', icon: Utensils, href: '/admin/menu' },
        { name: 'Pesanan', icon: ClipboardList, href: '/admin/orders' },
        { name: 'Meja', icon: TableProperties, href: '/admin/tables' },
    ];

    return (
        <div className="min-h-screen bg-white flex">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:fixed h-screen z-40 w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 flex items-center gap-3 border-b border-slate-200">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                        <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm text-slate-900">ABC Arena</h1>
                        <p className="text-[10px] text-slate-500">Admin</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden p-1 text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                {/* Mobile topbar */}
                <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600">
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1 className="font-bold text-sm text-slate-900">ABC Arena</h1>
                </div>

                <div className="p-4 sm:p-8 bg-slate-50">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
