import React, { useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
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
    pendaftaranAktif: {
        id: string;
        ekskul_nama: string;
        status: string;
        created_at: string;
    }[];
    ekskulDiikuti: {
        id: string;
        ekskul_nama: string;
        jadwal: string;
    }[];
    jadwalBentrok: {
        ekskul_a: string;
        ekskul_b: string;
        hari: string;
        jam: string;
    }[];
    notifikasiUnread: number;
    periodePendaftaran: {
        is_buka: boolean;
        tanggal_tutup: string;
    } | null;
    ekskulDikelola: {
        id: string;
        ekskul_ta_id: string;
        nama: string;
        jumlah_pendaftar: number;
        jumlah_anggota: number;
        kuota: number;
    }[];
    statistik: {
        total_siswa: number;
        total_ekskul: number;
        total_pendaftar: number;
        total_anggota: number;
    } | null;
    [key: string]: any;
}


export default function Dashboard() {
    const { 
        auth, 
        tahunAjaranAktif, 
        pendaftaranAktif = [], 
        ekskulDiikuti = [], 
        jadwalBentrok = [], 
        notifikasiUnread = 0,
        periodePendaftaran = null,
        ekskulDikelola = [],
        statistik = null
    } = usePage<AuthProps>().props;

    const user = auth.user;
    if (!user) return null;

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
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl -z-10"></div>

                    <div className="md:flex md:items-center md:justify-between space-y-6 md:space-y-0">
                        <div className="space-y-2">
                            <span className="text-[10px] font-extrabold text-accent bg-accent/15 px-3 py-1 rounded-full uppercase tracking-wider">
                                Tahun Ajaran Aktif: {tahunAjaranAktif?.nama || 'Belum diatur'}
                            </span>
                            <h2 className="text-3xl font-black text-navy mt-2">Selamat Datang, {user.nama}!</h2>
                            <p className="text-sm text-gray-500 font-semibold max-w-xl">
                                Akses portal sistem ekstrakurikuler SMKN 1 Bawang. Silakan kelola pendaftaran dan aktivitas Anda.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scheduling Conflicts Alert */}
                {activeRole === 'siswa' && jadwalBentrok.length > 0 && (
                    <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-3xl space-y-3">
                        <div className="flex items-center space-x-2.5 text-yellow-800 font-extrabold text-sm">
                            <span className="text-lg">⚠️</span>
                            <span>Peringatan Bentrok Jadwal Latihan!</span>
                        </div>
                        <div className="space-y-1 pl-7">
                            {jadwalBentrok.map((conflict, idx) => (
                                <p key={idx} className="text-xs text-yellow-700 font-semibold">
                                    Jadwal latihan <span className="font-bold">{conflict.ekskul_a}</span> bentrok dengan <span className="font-bold">{conflict.ekskul_b}</span> pada hari <span className="capitalize font-bold">{conflict.hari}</span> jam {conflict.jam}.
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dashboard Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Profile Card & Quick Stats */}
                    <div className="space-y-6">
                        {/* Profile Info */}
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
                                    { label: 'Jurusan', value: user.jurusan || '-' },
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

                        {/* Unread Notifications Count */}
                        {notifikasiUnread > 0 && (
                            <Link
                                href="/notifikasi"
                                className="block p-5 bg-navy text-white rounded-3xl shadow-md hover:scale-[1.01] transition-all flex justify-between items-center"
                            >
                                <div className="space-y-1">
                                    <p className="text-xs font-extrabold uppercase tracking-wider text-white/70">Kotak Masuk</p>
                                    <p className="text-lg font-black">{notifikasiUnread} Notifikasi Baru</p>
                                </div>
                                <span className="text-2xl">🔔</span>
                            </Link>
                        )}
                    </div>

                    {/* Right Column: Role Specific Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Siswa Dashboard Panel */}
                        {activeRole === 'siswa' && (
                            <div className="space-y-6">
                                {/* Pendaftaran Status */}
                                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                                    <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-black text-navy text-md">Pendaftaran Tahun Ajaran Ini</h3>
                                            <p className="text-xs text-gray-400 font-bold font-sans">Status seleksi pendaftaran ekstrakurikuler Anda</p>
                                        </div>
                                        {periodePendaftaran?.is_buka && (
                                            <Link
                                                href="/pendaftaran"
                                                className="px-4 py-2 bg-secondary text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl hover:bg-secondary/90 transition-all"
                                            >
                                                Pendaftaran Online
                                            </Link>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {pendaftaranAktif.map((p) => (
                                            <div key={p.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                                                <div>
                                                    <p className="font-black text-sm text-gray-800">{p.ekskul_nama}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">Dibuat: {new Date(p.created_at).toLocaleDateString('id-ID')}</p>
                                                </div>
                                                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                                    p.status === 'diterima'
                                                        ? 'bg-green-50 text-green-700'
                                                        : p.status === 'ditolak'
                                                        ? 'bg-red-50 text-red-700'
                                                        : 'bg-yellow-50 text-yellow-700'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                        ))}
                                        {pendaftaranAktif.length === 0 && (
                                            <p className="text-xs text-gray-400 font-semibold py-4 text-center">Belum ada pendaftaran ekskul tahun ajaran ini.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Ekskul yang Diikuti */}
                                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                                    <div className="border-b border-gray-100 pb-3">
                                        <h3 className="font-black text-navy text-md">Keanggotaan Ekskul Aktif</h3>
                                        <p className="text-xs text-gray-400 font-bold">Daftar ekstrakurikuler yang Anda ikuti secara resmi</p>
                                    </div>

                                    <div className="space-y-2">
                                        {ekskulDiikuti.map((ekskul) => (
                                            <div key={ekskul.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div>
                                                    <h4 className="font-black text-sm text-gray-800">{ekskul.ekskul_nama}</h4>
                                                    <p className="text-xs text-gray-500 font-semibold mt-0.5">Jadwal: {ekskul.jadwal}</p>
                                                </div>
                                                <Link
                                                    href={`/ekskul/${ekskul.id}`}
                                                    className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-xl hover:bg-secondary hover:text-white transition-all text-center"
                                                >
                                                    Halaman Ekskul
                                                </Link>
                                            </div>
                                        ))}
                                        {ekskulDiikuti.length === 0 && (
                                            <p className="text-xs text-gray-400 font-semibold py-4 text-center">Belum bergabung dengan ekstrakurikuler manapun.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Admin Ekskul / Pembina Dashboard Panel */}
                        {(activeRole === 'admin-ekskul' || activeRole === 'pembina') && (
                            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                                <div className="border-b border-gray-100 pb-3">
                                    <h3 className="font-black text-navy text-md">Ekstrakurikuler yang Dikelola</h3>
                                    <p className="text-xs text-gray-400 font-bold font-sans">Unit kerja pembinaan yang ditugaskan kepada Anda</p>
                                </div>

                                <div className="space-y-4">
                                    {ekskulDikelola.map((eta) => (
                                        <div key={eta.id} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-black text-navy text-md">{eta.nama}</h4>
                                                <span className="text-[10px] font-extrabold bg-navy text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                    Kuota: {eta.kuota} Siswa
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white p-3 border border-gray-100 rounded-xl">
                                                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Pendaftar Masuk</p>
                                                    <p className="text-lg font-black text-navy mt-1">{eta.jumlah_pendaftar} Siswa</p>
                                                </div>
                                                <div className="bg-white p-3 border border-gray-100 rounded-xl">
                                                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Anggota Aktif</p>
                                                    <p className="text-lg font-black text-navy mt-1">{eta.jumlah_anggota} Siswa</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-2">
                                                <Link
                                                    href={`/manage/ekskul/${eta.ekskul_ta_id}/seleksi`}
                                                    className="px-3.5 py-2 bg-secondary text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-secondary/90 transition-all"
                                                >
                                                    Seleksi Pendaftar
                                                </Link>
                                                <Link
                                                    href={`/manage/ekskul/${eta.ekskul_ta_id}/anggota`}
                                                    className="px-3.5 py-2 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-navy/90 transition-all"
                                                >
                                                    Kelola Anggota
                                                </Link>
                                                <Link
                                                    href={`/manage/ekskul/${eta.ekskul_ta_id}/absensi`}
                                                    className="px-3.5 py-2 border border-gray-200 text-gray-600 bg-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all"
                                                >
                                                    Absensi Latihan
                                                </Link>
                                                <Link
                                                    href={`/manage/ekskul/${eta.ekskul_ta_id}/penilaian`}
                                                    className="px-3.5 py-2 border border-gray-200 text-gray-600 bg-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all"
                                                >
                                                    Penilaian Akhir
                                                </Link>
                                                <Link
                                                    href={`/manage/ekskul/${eta.ekskul_ta_id}/pengumuman`}
                                                    className="px-3.5 py-2 border border-gray-200 text-gray-600 bg-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all"
                                                >
                                                    Pengumuman
                                                </Link>
                                                <Link
                                                    href={`/manage/ekskul/${eta.ekskul_ta_id}/event`}
                                                    className="px-3.5 py-2 border border-gray-200 text-gray-600 bg-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all"
                                                >
                                                    Kegiatan & Dokumentasi
                                                </Link>
                                                <Link
                                                    href={`/manage/ekskul/${eta.ekskul_ta_id}/album`}
                                                    className="px-3.5 py-2 border border-gray-200 text-gray-600 bg-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all"
                                                >
                                                    Album Foto
                                                </Link>
                                                <Link
                                                    href={`/manage/ekskul/${eta.ekskul_ta_id}/jadwal`}
                                                    className="px-3.5 py-2 border border-gray-200 text-gray-600 bg-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all"
                                                >
                                                    Jadwal Latihan
                                                </Link>
                                                <Link
                                                    href={`/manage/ekskul/${eta.ekskul_ta_id}/struktur`}
                                                    className="px-3.5 py-2 border border-gray-200 text-gray-600 bg-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all"
                                                >
                                                    Struktur Organisasi
                                                </Link>
                                                <Link
                                                    href={`/manage/ekskul/${eta.ekskul_ta_id}/edit`}
                                                    className="px-3.5 py-2 border border-gray-200 text-gray-600 bg-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all"
                                                >
                                                    Kustomisasi Profil
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                    {ekskulDikelola.length === 0 && (
                                        <p className="text-xs text-gray-400 font-semibold py-4 text-center">Anda belum ditugaskan untuk mengelola ekstrakurikuler manapun.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Kesiswaan / OSIS Dashboard Panel */}
                        {(activeRole === 'kesiswaan' || activeRole === 'pengurus-osis') && statistik && (
                            <div className="space-y-6">
                                {/* Statistics Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm text-center">
                                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Total Siswa</p>
                                        <p className="text-2xl font-black text-navy mt-1">{statistik.total_siswa}</p>
                                    </div>
                                    <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm text-center">
                                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Total Ekskul</p>
                                        <p className="text-2xl font-black text-navy mt-1">{statistik.total_ekskul}</p>
                                    </div>
                                    <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm text-center">
                                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Pendaftar Masuk</p>
                                        <p className="text-2xl font-black text-navy mt-1">{statistik.total_pendaftar}</p>
                                    </div>
                                    <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm text-center">
                                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Anggota Resmi</p>
                                        <p className="text-2xl font-black text-navy mt-1">{statistik.total_anggota}</p>
                                    </div>
                                </div>

                                {/* Administrative Actions */}
                                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                                    <div className="border-b border-gray-100 pb-3">
                                        <h3 className="font-black text-navy text-md">Menu Cepat Kesiswaan & OSIS</h3>
                                        <p className="text-xs text-gray-400 font-bold">Kelola data terintegrasi, laporan, audit log, dan suksesi kepengurusan</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Link
                                            href="/admin/laporan"
                                            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-secondary/20 transition-all flex flex-col justify-between h-28"
                                        >
                                            <div>
                                                <h4 className="font-black text-navy text-sm">Cetak Laporan Rekapitulasi</h4>
                                                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Ekspor rekap absensi, nilai, dan anggota ke PDF/Excel.</p>
                                            </div>
                                            <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider">Buka Laporan →</span>
                                        </Link>

                                        <Link
                                            href="/admin/audit-log"
                                            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-accent/20 transition-all flex flex-col justify-between h-28"
                                        >
                                            <div>
                                                <h4 className="font-black text-navy text-sm">Audit Log Sistem</h4>
                                                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Pantau detail riwayat aktivitas penulisan/penghapusan data.</p>
                                            </div>
                                            <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider">Buka Audit Log →</span>
                                        </Link>

                                        <Link
                                            href="/admin/pengurus"
                                            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-secondary/20 transition-all flex flex-col justify-between h-28"
                                        >
                                            <div>
                                                <h4 className="font-black text-navy text-sm">Manajemen Akses & OSIS</h4>
                                                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Tugaskan admin ekskul baru atau lakukan suksesi OSIS manual.</p>
                                            </div>
                                            <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider">Buka Akses →</span>
                                        </Link>

                                        <Link
                                            href="/admin/siswa/import"
                                            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-accent/20 transition-all flex flex-col justify-between h-28"
                                        >
                                            <div>
                                                <h4 className="font-black text-navy text-sm">Impor Siswa Massal</h4>
                                                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Unggah data siswa resmi tahun ajaran baru via Excel.</p>
                                            </div>
                                            <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider">Buka Impor →</span>
                                        </Link>
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
