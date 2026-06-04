import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface AuthProps {
    auth: {
        user: {
            id: string;
            nama: string;
            email: string;
            nis: string | null;
            kelas: string | null;
            jurusan: string | null;
            foto_profil: string | null;
            roles: string[];
            permissions: string[];
        } | null;
    };
    tahunAjaranAktif: {
        id: string;
        nama: string;
    };
    [key: string]: any;
}

export default function Dashboard() {
    const { auth } = usePage<AuthProps>().props;
    const user = auth.user;

    if (!user) {
        return null;
    }

    // Manage role state locally for context switcher demo/display
    const [activeRole, setActiveRole] = useState<string>(user.roles[0] || 'siswa');

    return (
        <AuthenticatedLayout 
            title="Dashboard Utama" 
            activeRoleState={activeRole} 
            setActiveRoleState={setActiveRole}
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Welcome Card */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100/20 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl -z-10"></div>

                    <div className="md:flex md:items-center md:justify-between space-y-6 md:space-y-0">
                        <div className="space-y-2">
                            <span className="text-[10px] font-extrabold text-accent bg-accent/15 px-3 py-1 rounded-full uppercase tracking-wider">
                                Mode Tinjauan Peran: {activeRole === 'kesiswaan' ? 'Kesiswaan (Admin)' : activeRole === 'admin-ekskul' ? 'Admin Ekskul' : activeRole === 'pembina' ? 'Pembina Guru' : 'Siswa'}
                            </span>
                            <h2 className="text-3xl font-black text-navy mt-2">Selamat Datang, {user.nama}!</h2>
                            <p className="text-sm text-gray-500 font-semibold max-w-xl">
                                Akses portal sistem ekstrakurikuler SMKN 1 Bawang. Silakan gunakan menu di samping untuk mulai berselancar.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: Profile Detail */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="font-black text-navy text-md">Informasi Profil</h3>
                            <p className="text-xs text-gray-400 font-bold">Data akademis resmi yang terdaftar</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'NIS / NIK', value: user.nis || '-' },
                                { label: 'Email Resmi', value: user.email },
                                { label: 'Kelas', value: user.kelas || '-' },
                                { label: 'Jurusan / Bidang', value: user.jurusan || '-' },
                            ].map((field, idx) => (
                                <div key={idx} className="space-y-1">
                                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                                        {field.label}
                                    </p>
                                    <p className="text-sm font-bold text-gray-800">{field.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Role Actions */}
                    <div className="lg:col-span-2 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="font-black text-navy text-md">Modul Cepat ({activeRole === 'kesiswaan' ? 'Kesiswaan' : activeRole === 'admin-ekskul' ? 'Admin Ekskul' : activeRole === 'pembina' ? 'Pembina Guru' : 'Siswa'})</h3>
                            <p className="text-xs text-gray-400 font-bold">Menu cepat yang relevan dengan peran Anda</p>
                        </div>

                        {activeRole === 'kesiswaan' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:border-secondary/20 transition-all flex flex-col justify-between h-36">
                                    <div>
                                        <h4 className="font-black text-navy text-sm">Impor Siswa Baru</h4>
                                        <p className="text-xs text-gray-500 font-semibold mt-1">Impor massal data siswa kelas 10 dan 11 via template Excel.</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-extrabold text-secondary bg-secondary/15 px-2.5 py-1 rounded-full uppercase tracking-wider">Impor Excel</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:border-accent/20 transition-all flex flex-col justify-between h-36">
                                    <div>
                                        <h4 className="font-black text-navy text-sm">Konfigurasi Ekskul</h4>
                                        <p className="text-xs text-gray-500 font-semibold mt-1">Kelola data 27 ekstrakurikuler dan penugasan guru pembina.</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-extrabold text-accent bg-accent/15 px-2.5 py-1 rounded-full uppercase tracking-wider">Kelola</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeRole === 'siswa' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:border-secondary/20 transition-all flex flex-col justify-between h-36">
                                    <div>
                                        <h4 className="font-black text-navy text-sm">Pendaftaran Ekstrakurikuler</h4>
                                        <p className="text-xs text-gray-500 font-semibold mt-1">Daftar secara opsional pada salah satu ekstrakurikuler aktif.</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-extrabold text-secondary bg-secondary/15 px-2.5 py-1 rounded-full uppercase tracking-wider">Daftar</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:border-accent/20 transition-all flex flex-col justify-between h-36">
                                    <div>
                                        <h4 className="font-black text-navy text-sm">Status & Riwayat Keanggotaan</h4>
                                        <p className="text-xs text-gray-500 font-semibold mt-1">Pantau status seleksi atau lihat riwayat keanggotaan aktif Anda.</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-extrabold text-accent bg-accent/15 px-2.5 py-1 rounded-full uppercase tracking-wider">Riwayat</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeRole === 'admin-ekskul' || activeRole === 'pembina') && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:border-secondary/20 transition-all flex flex-col justify-between h-36">
                                    <div>
                                        <h4 className="font-black text-navy text-sm">Kelola Absensi Sesi</h4>
                                        <p className="text-xs text-gray-500 font-semibold mt-1">Buat lembar sesi pertemuan dan input absensi anggota.</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-extrabold text-secondary bg-secondary/15 px-2.5 py-1 rounded-full uppercase tracking-wider">Absensi</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:border-accent/20 transition-all flex flex-col justify-between h-36">
                                    <div>
                                        <h4 className="font-black text-navy text-sm">Penilaian Anggota</h4>
                                        <p className="text-xs text-gray-500 font-semibold mt-1">Input nilai akhir ekstrakurikuler untuk dikirim ke rapor.</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-extrabold text-accent bg-accent/15 px-2.5 py-1 rounded-full uppercase tracking-wider">Nilai</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
