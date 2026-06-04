import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

interface UserProps {
    id: string;
    nama: string;
    email: string;
    nis: string | null;
    kelas: string | null;
    jurusan: string | null;
    foto_profil: string | null;
    roles: string[];
    permissions: string[];
}

interface AuthProps {
    auth: {
        user: UserProps;
    };
    tahunAjaranAktif: {
        id: string;
        nama: string;
    };
}

interface LayoutProps {
    children: React.ReactNode;
    title: string;
    activeRoleState?: string;
    setActiveRoleState?: (role: string) => void;
}

export default function AuthenticatedLayout({ children, title, activeRoleState, setActiveRoleState }: LayoutProps) {
    const { auth, tahunAjaranAktif } = usePage<AuthProps>().props;
    const user = auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    // Filter menu items based on the active role context
    // If no active role state is chosen yet, default to the first role they have
    const activeRole = activeRoleState || (user?.roles?.[0] || 'siswa');

    const getNavigation = (role: string) => {
        const common = [
            { name: 'Dashboard', href: '/dashboard', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )},
        ];

        if (role === 'kesiswaan') {
            return [
                ...common,
                { name: 'Import Siswa', href: '/admin/siswa/import', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                )},
                { name: 'Kelola Ekskul', href: '/admin/ekskul', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                )},
                { name: 'Periode & Seleksi', href: '/admin/periode', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                )},
            ];
        }

        if (role === 'admin-ekskul' || role === 'pembina') {
            return [
                ...common,
                { name: 'Daftar Anggota', href: '/manage/ekskul/anggota', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                )},
                { name: 'Sesi Absensi', href: '/manage/ekskul/absensi', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                )},
                { name: 'Penilaian Ekskul', href: '/manage/ekskul/nilai', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )},
            ];
        }

        // Default Siswa
        return [
            ...common,
            { name: 'Daftar Ekskul', href: '/siswa/pendaftaran', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )},
            { name: 'Status & Riwayat', href: '/siswa/riwayat', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )},
        ];
    };

    const navItems = getNavigation(activeRole);

    return (
        <div className="min-h-screen bg-gray-50 flex text-dark font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r border-gray-200 shrink-0 sticky top-0 h-screen">
                {/* School Logo Area */}
                <div className="h-20 border-b border-gray-100 flex items-center px-6 space-x-3.5">
                    <img
                        src="/images/logo-SMKN1-Bawang.png"
                        alt="Logo SMKN 1 Bawang"
                        className="h-11 w-auto"
                    />
                    <div>
                        <h2 className="text-sm font-black text-navy leading-none">
                            SMKN 1 Bawang
                        </h2>
                        <p className="text-[10px] text-gray-500 font-bold tracking-wider mt-1 uppercase">
                            Ekstrakurikuler
                        </p>
                    </div>
                </div>

                {/* Role Switcher */}
                {user.roles.length > 1 && setActiveRoleState && (
                    <div className="p-4 mx-4 mt-6 bg-gray-50 border border-gray-200/50 rounded-2xl">
                        <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                            Akses Peran Aktif
                        </label>
                        <select
                            value={activeRole}
                            onChange={(e) => setActiveRoleState(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy focus:outline-none"
                        >
                            {user.roles.map((role, idx) => (
                                <option key={idx} value={role}>
                                    {role === 'kesiswaan' ? 'Kesiswaan (Admin)' : role === 'admin-ekskul' ? 'Admin Ekskul' : role === 'pembina' ? 'Pembina Guru' : 'Siswa'}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Sidebar Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {navItems.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            className="flex items-center px-4 py-3 text-sm font-bold text-gray-600 hover:text-navy hover:bg-navy/5 rounded-xl transition-all duration-200"
                        >
                            <span className="mr-3.5 text-gray-400 group-hover:text-navy">
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer (User Account Info) */}
                <div className="p-4 border-t border-gray-150 flex items-center space-x-3.5">
                    <img
                        src={user.foto_profil || '/images/logo-SMKN1-Bawang.png'}
                        alt="Profil"
                        className="h-10 w-10 rounded-full border-2 border-secondary/20 object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/logo-SMKN1-Bawang.png';
                        }}
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-navy truncate">{user.nama}</p>
                        <p className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link
                        href="/auth/logout"
                        method="post"
                        as="button"
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Logout"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </Link>
                </div>
            </aside>

            {/* Mobile Drawer Backdrop */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col border-r border-gray-200 transform transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header */}
                <div className="h-20 border-b border-gray-150 flex items-center justify-between px-6">
                    <div className="flex items-center space-x-3">
                        <img src="/images/logo-SMKN1-Bawang.png" alt="Logo" className="h-10 w-auto" />
                        <div>
                            <h2 className="text-xs font-black text-navy leading-none">SMKN 1 Bawang</h2>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Ekstrakurikuler</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setMobileOpen(false)}
                        className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Role Switcher */}
                {user.roles.length > 1 && setActiveRoleState && (
                    <div className="p-4 mx-4 mt-6 bg-gray-50 border border-gray-200/50 rounded-2xl">
                        <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                            Akses Peran Aktif
                        </label>
                        <select
                            value={activeRole}
                            onChange={(e) => {
                                setActiveRoleState(e.target.value);
                                setMobileOpen(false);
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-bold text-navy focus:outline-none"
                        >
                            {user.roles.map((role, idx) => (
                                <option key={idx} value={role}>
                                    {role === 'kesiswaan' ? 'Kesiswaan' : role === 'admin-ekskul' ? 'Admin Ekskul' : role === 'pembina' ? 'Pembina Guru' : 'Siswa'}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {navItems.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center px-4 py-3 text-sm font-bold text-gray-600 hover:text-navy hover:bg-navy/5 rounded-xl"
                        >
                            <span className="mr-3.5 text-gray-400">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Footer Account */}
                <div className="p-4 border-t border-gray-150 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img
                            src={user.foto_profil || '/images/logo-SMKN1-Bawang.png'}
                            alt="Profil"
                            className="h-9 w-9 rounded-full border border-gray-200"
                        />
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-navy truncate leading-none">{user.nama}</p>
                            <span className="text-[9px] text-gray-400 truncate block mt-1">{user.email}</span>
                        </div>
                    </div>
                    <Link
                        href="/auth/logout"
                        method="post"
                        as="button"
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Page Content Wrappers */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Navbar */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm shrink-0">
                    <div className="flex items-center space-x-4">
                        {/* Hamburger Button for Mobile */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 focus:outline-none lg:hidden border border-gray-150"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        
                        <h2 className="text-lg font-black text-navy tracking-tight">{title}</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Year Info for Mobile/Desktop */}
                        <span className="inline-flex items-center px-4.5 py-2 bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold rounded-full">
                            TA: {tahunAjaranAktif?.nama || 'N/A'}
                        </span>
                    </div>
                </header>

                {/* Main Dynamic Viewport */}
                <main className="flex-1 overflow-y-auto px-6 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
