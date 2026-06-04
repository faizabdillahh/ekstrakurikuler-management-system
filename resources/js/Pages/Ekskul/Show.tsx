import React from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface ScheduleItem {
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi: string | null;
    keterangan: string | null;
}

interface PembinaItem {
    nama: string;
    email: string;
}

interface EkskulDetail {
    id: string;
    nama: string;
    kategori: string;
    logo_url: string | null;
    deskripsi: string | null;
    warna_primer: string;
    warna_sekunder: string;
    media_sosial: {
        instagram?: string;
        tiktok?: string;
        facebook?: string;
        youtube?: string;
    } | null;
    kuota_anggota: number | null;
    is_pendaftaran_dibuka: boolean;
    jadwal: ScheduleItem[];
    pembina: PembinaItem[];
}

interface ShowProps {
    ekskul: EkskulDetail;
}

export default function Show({ ekskul }: ShowProps) {
    const primaryColor = ekskul.warna_primer || '#fff000';
    const secondaryColor = ekskul.warna_sekunder || '#00a2e9';

    return (
        <AuthenticatedLayout title={`Detail ${ekskul.nama}`}>
            <Head title={`Ekskul - ${ekskul.nama}`} />

            <div 
                className="space-y-8"
                style={{
                    '--color-primary': primaryColor,
                    '--color-secondary': secondaryColor
                } as React.CSSProperties}
            >
                {/* Back button */}
                <div>
                    <button 
                        onClick={() => router.get('/ekskul')}
                        className="flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-navy transition-colors bg-white border border-gray-150 rounded-full px-4 py-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Kembali ke Daftar</span>
                    </button>
                </div>

                {/* Profile Header Card */}
                <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm relative">
                    {/* Dynamic Header color block */}
                    <div 
                        className="h-32 w-full bg-gradient-to-r" 
                        style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                    ></div>
                    
                    <div className="p-6 lg:p-8 -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-end space-x-6">
                            <div className="w-28 h-28 rounded-3xl bg-white flex items-center justify-center border-4 border-white shadow overflow-hidden shrink-0">
                                {ekskul.logo_url ? (
                                    <img src={ekskul.logo_url} alt={ekskul.nama} className="w-20 h-20 object-contain" />
                                ) : (
                                    <span className="text-navy font-black text-4xl">{ekskul.nama.charAt(0)}</span>
                                )}
                            </div>
                            <div className="space-y-1 pb-2">
                                <span className="text-[10px] font-extrabold text-white bg-navy px-3 py-1 rounded-full uppercase tracking-wider">
                                    {ekskul.kategori}
                                </span>
                                <h2 className="text-3xl font-black text-navy mt-3">{ekskul.nama}</h2>
                            </div>
                        </div>

                        <div className="pb-2">
                            {ekskul.is_pendaftaran_dibuka ? (
                                <button
                                    onClick={() => router.get(`/pendaftaran/buat/${ekskul.id}`)}
                                    className="w-full md:w-auto px-6 py-3 font-extrabold text-sm rounded-xl text-white shadow-sm hover:shadow transition-all"
                                    style={{ backgroundColor: secondaryColor }}
                                >
                                    Daftar Sekarang
                                </button>
                            ) : (
                                <div className="px-5 py-2.5 bg-red-50 border border-red-200 text-red-700 font-bold text-xs uppercase tracking-wider rounded-xl text-center">
                                    Pendaftaran Ditutup
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: Description */}
                    <div className="lg:col-span-2 bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                        <div>
                            <h3 className="font-black text-navy text-md border-b border-gray-100 pb-3">Tentang Ekstrakurikuler</h3>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed mt-4 whitespace-pre-wrap">
                                {ekskul.deskripsi || 'Belum ada deskripsi lengkap mengenai ekstrakurikuler ini.'}
                            </p>
                        </div>

                        {/* Social Media Links */}
                        {ekskul.media_sosial && Object.values(ekskul.media_sosial).some(Boolean) && (
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="font-black text-navy text-xs uppercase tracking-wider mb-3">Media Sosial</h4>
                                <div className="flex flex-wrap gap-3">
                                    {ekskul.media_sosial.instagram && (
                                        <a 
                                            href={`https://instagram.com/${ekskul.media_sosial.instagram.replace('@', '')}`}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 hover:border-pink-300 hover:bg-pink-50 transition-colors text-xs font-bold text-gray-600 rounded-full flex items-center space-x-1.5"
                                        >
                                            <span className="text-pink-500">📸</span>
                                            <span>Instagram: {ekskul.media_sosial.instagram}</span>
                                        </a>
                                    )}
                                    {ekskul.media_sosial.tiktok && (
                                        <a 
                                            href={`https://tiktok.com/@${ekskul.media_sosial.tiktok.replace('@', '')}`}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 hover:border-black hover:bg-gray-100 transition-colors text-xs font-bold text-gray-600 rounded-full flex items-center space-x-1.5"
                                        >
                                            <span>🎵</span>
                                            <span>TikTok: {ekskul.media_sosial.tiktok}</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Schedule and Pembina */}
                    <div className="space-y-8">
                        {/* Schedule Card */}
                        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                            <h3 className="font-black text-navy text-md border-b border-gray-100 pb-3">Jadwal Pertemuan</h3>
                            
                            {ekskul.jadwal.length === 0 ? (
                                <p className="text-xs text-gray-400 font-bold">Belum ada jadwal latihan rutin yang dirilis.</p>
                            ) : (
                                <div className="space-y-4">
                                    {ekskul.jadwal.map((j, idx) => (
                                        <div key={idx} className="flex items-start space-x-3.5">
                                            <div className="px-2 py-1 bg-navy/10 text-navy font-extrabold text-[10px] rounded uppercase shrink-0 mt-0.5 min-w-[50px] text-center">
                                                {j.hari}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-gray-800">
                                                    {j.jam_mulai} - {j.jam_selesai} WIB
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold">
                                                    📍 {j.lokasi || 'Lokasi menyusul'}
                                                </p>
                                                {j.keterangan && (
                                                    <p className="text-[10px] text-gray-400 font-semibold italic">
                                                        * {j.keterangan}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pembina Card */}
                        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                            <h3 className="font-black text-navy text-md border-b border-gray-100 pb-3">Pembina Guru</h3>
                            
                            {ekskul.pembina.length === 0 ? (
                                <p className="text-xs text-gray-400 font-bold">Belum ada pembina yang ditugaskan.</p>
                            ) : (
                                <div className="space-y-3">
                                    {ekskul.pembina.map((p, idx) => (
                                        <div key={idx} className="space-y-0.5">
                                            <p className="text-xs font-black text-gray-800">{p.nama}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{p.email}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
