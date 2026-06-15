import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

interface ScheduleItem {
    id: string;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi: string | null;
    keterangan: string | null;
    ekskul_nama: string;
    warna_primer: string;
    warna_sekunder: string;
}

interface EventItem {
    id: string;
    judul: string;
    deskripsi: string;
    tanggal_mulai: string;
    tanggal_selesai: string | null;
    lokasi: string | null;
    ekskul_nama: string;
    warna_primer: string;
    warna_sekunder: string;
}

interface IndexProps {
    schedules: ScheduleItem[];
    events: EventItem[];
}

export default function Index({ schedules = [], events = [] }: IndexProps) {
    const [activeTab, setActiveTab] = useState<'events' | 'schedules'>('events');

    // Group schedules by day of week
    const daysOfWeek = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    const groupedSchedules = daysOfWeek.reduce((acc, day) => {
        acc[day] = schedules.filter((s) => s.hari.toLowerCase() === day);
        return acc;
    }, {} as Record<string, ScheduleItem[]>);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title="Kalender & Agenda Kegiatan Ekskul" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center space-x-4">
                            <img 
                                src="/images/logo-SMKN1-Bawang.png" 
                                alt="Logo SMKN 1 Bawang" 
                                className="h-14 w-auto object-contain"
                            />
                            <div>
                                <h1 className="text-lg font-bold text-navy tracking-tight leading-none">
                                    SMKN 1 Bawang
                                </h1>
                                <p className="text-xs text-gray-500 mt-1 font-medium">
                                    Sistem Manajemen Ekstrakurikuler
                                </p>
                            </div>
                        </Link>

                        <nav className="flex items-center space-x-6">
                            <Link href="/" className="text-gray-600 hover:text-navy font-semibold text-sm transition-colors">Beranda</Link>
                            <Link href="/galeri" className="text-gray-600 hover:text-navy font-semibold text-sm transition-colors">Galeri</Link>
                            <Link href="/pencarian" className="text-gray-600 hover:text-navy font-semibold text-sm transition-colors">Cari</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-grow py-12 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
                {/* Page Title */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="inline-flex items-center px-4 py-1 bg-yellow-100/70 border border-yellow-200 text-yellow-800 text-xs font-bold rounded-full tracking-wider uppercase">
                        📅 Kalender Terpadu
                    </span>
                    <h2 className="text-4xl font-black text-navy leading-tight">Kalender Kegiatan & Jadwal Latihan</h2>
                    <p className="text-gray-600 font-medium leading-relaxed">
                        Lihat agenda event mendatang serta jadwal latihan rutin mingguan seluruh unit ekstrakurikuler.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center">
                    <div className="bg-white p-1.5 border border-gray-150 rounded-2xl shadow-sm flex space-x-1">
                        <button
                            onClick={() => setActiveTab('events')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                                activeTab === 'events'
                                    ? 'bg-navy text-white shadow'
                                    : 'text-gray-500 hover:text-navy'
                            }`}
                        >
                            Agenda Kegiatan ({events.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('schedules')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                                activeTab === 'schedules'
                                    ? 'bg-navy text-white shadow'
                                    : 'text-gray-500 hover:text-navy'
                            }`}
                        >
                            Jadwal Latihan Mingguan ({schedules.length})
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="max-w-4xl mx-auto pt-4">
                    {activeTab === 'events' ? (
                        <div className="space-y-6">
                            {events.length === 0 ? (
                                <div className="bg-white border border-gray-150 rounded-3xl p-16 text-center shadow-sm">
                                    <p className="text-sm text-gray-400 font-semibold">Belum ada agenda kegiatan terdekat saat ini.</p>
                                </div>
                            ) : (
                                events.map((e) => (
                                    <div
                                        key={e.id}
                                        className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all relative overflow-hidden"
                                    >
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-2"
                                            style={{ backgroundColor: e.warna_primer || '#00a2e9' }}
                                        ></div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <span
                                                    className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider"
                                                    style={{
                                                        backgroundColor: `${e.warna_primer}15` || '#00a2e915',
                                                        color: e.warna_primer || '#00a2e9',
                                                    }}
                                                >
                                                    {e.ekskul_nama}
                                                </span>
                                                <span className="text-xs text-gray-400 font-bold">
                                                    📅 {new Date(e.tanggal_mulai).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    {e.tanggal_selesai && ` s/d ${new Date(e.tanggal_selesai).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-black text-navy">{e.judul}</h3>
                                            <p className="text-sm text-gray-600 font-semibold leading-relaxed whitespace-pre-wrap">{e.deskripsi}</p>

                                            {e.lokasi && (
                                                <div className="flex items-center space-x-1 text-xs text-gray-500 font-bold pt-2">
                                                    <span>📍 Lokasi:</span>
                                                    <span>{e.lokasi}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {daysOfWeek.map((day) => {
                                const daySchedules = groupedSchedules[day] || [];
                                return (
                                    <div key={day} className="space-y-3">
                                        <h3 className="text-sm font-black text-navy uppercase tracking-wider border-b border-gray-200 pb-2 capitalize">{day}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {daySchedules.map((s) => (
                                                <div
                                                    key={s.id}
                                                    className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm hover:shadow transition-all relative overflow-hidden flex flex-col justify-between space-y-3"
                                                >
                                                    <div
                                                        className="absolute left-0 top-0 bottom-0 w-1.5"
                                                        style={{ backgroundColor: s.warna_primer || '#fff000' }}
                                                    ></div>

                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] font-extrabold text-navy capitalize">{s.ekskul_nama}</span>
                                                            <span className="text-[10px] text-gray-400 font-extrabold uppercase">{s.jam_mulai} - {s.jam_selesai}</span>
                                                        </div>
                                                        <p className="text-xs font-bold text-navy">📍 {s.lokasi || '-'}</p>
                                                    </div>

                                                    {s.keterangan && (
                                                        <p className="text-[10px] text-gray-500 font-medium italic border-t border-gray-50 pt-2">
                                                            * {s.keterangan}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                            {daySchedules.length === 0 && (
                                                <p className="text-xs text-gray-400 font-semibold italic py-2 pl-2">Tidak ada jadwal latihan.</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-navy text-white/90 pt-8 pb-8 border-t border-navy/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-white/50 font-medium">
                    <p>© 2026 SMKN 1 Bawang. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
