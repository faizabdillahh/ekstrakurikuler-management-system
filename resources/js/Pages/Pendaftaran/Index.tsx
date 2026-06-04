import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Ekskul {
    id: string;
    nama: string;
    kategori: string;
    logo_url: string | null;
}

interface Sertifikat {
    id: string;
    nama_file: string;
    url: string;
}

interface PendaftaranItem {
    id: string;
    status: 'dalam_review' | 'diterima' | 'ditolak';
    created_at: string;
    ekskul: Ekskul;
    sertifikat: Sertifikat[];
}

interface SharedProps {
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: any;
}

interface IndexProps {
    pendaftaranList: PendaftaranItem[];
    periodePendaftaran: {
        is_buka: boolean;
        tanggal_buka: string;
        tanggal_tutup: string;
    } | null;
}

export default function Index({ pendaftaranList, periodePendaftaran }: IndexProps) {
    const { props } = usePage<SharedProps>();
    const { flash } = props;

    const handleCancel = (id: string, ekskulNama: string) => {
        if (confirm(`Apakah Anda yakin ingin membatalkan pendaftaran ke ekskul ${ekskulNama}?`)) {
            router.delete(`/pendaftaran/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Pendaftaran Saya">
            <Head title="Pendaftaran Saya" />

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Flash Messages */}
                {flash.success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start space-x-3 text-green-800 text-sm font-semibold">
                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash.error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-800 text-sm font-semibold">
                        <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Period Banner */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-navy">Informasi Periode Pendaftaran</h2>
                        {periodePendaftaran ? (
                            <p className="text-xs text-gray-500 font-semibold">
                                Periode: <span className="text-navy font-bold">{periodePendaftaran.tanggal_buka}</span> s/d <span className="text-navy font-bold">{periodePendaftaran.tanggal_tutup}</span>
                            </p>
                        ) : (
                            <p className="text-xs text-gray-400 font-semibold">Periode pendaftaran belum dikonfigurasi oleh kesiswaan.</p>
                        )}
                    </div>

                    <div>
                        {periodePendaftaran && periodePendaftaran.is_buka ? (
                            <Link
                                href="/ekskul"
                                className="inline-block px-5 py-3 bg-secondary hover:bg-secondary-dark text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all text-center"
                            >
                                Jelajahi & Daftar Ekskul
                            </Link>
                        ) : (
                            <span className="inline-block px-5 py-2.5 bg-red-50 border border-red-150 text-red-700 font-bold text-xs uppercase tracking-wider rounded-xl">
                                Pendaftaran Ditutup
                            </span>
                        )}
                    </div>
                </div>

                {/* Registration List */}
                <div className="space-y-6">
                    <h3 className="text-lg font-black text-navy">Riwayat Pilihan Ekskul</h3>

                    {pendaftaranList.length === 0 ? (
                        <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center shadow-sm">
                            <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h4 className="text-navy font-black text-md mt-4">Belum Ada Pendaftaran</h4>
                            <p className="text-xs text-gray-400 font-bold mt-1">Anda belum mendaftar di ekstrakurikuler manapun pada periode ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {pendaftaranList.map((item) => (
                                <div key={item.id} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-300 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                            {item.ekskul.logo_url ? (
                                                <img src={item.ekskul.logo_url} alt={item.ekskul.nama} className="w-12 h-12 object-contain" />
                                            ) : (
                                                <span className="text-navy font-black text-xl">{item.ekskul.nama.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-extrabold text-secondary bg-secondary/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {item.ekskul.kategori}
                                            </span>
                                            <h4 className="font-black text-navy text-md mt-1">{item.ekskul.nama}</h4>
                                            <p className="text-[10px] text-gray-400 font-semibold">
                                                Daftar pada: {item.created_at}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Middle: Cert count & Status */}
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="text-center md:text-left">
                                            <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Sertifikat Prestasi</p>
                                            <p className="text-xs font-black text-gray-700 mt-0.5">{item.sertifikat.length} berkas terlampir</p>
                                        </div>

                                        <div>
                                            {item.status === 'dalam_review' && (
                                                <span className="text-[9px] font-extrabold text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full uppercase tracking-wider">
                                                    Dalam Review
                                                </span>
                                            )}
                                            {item.status === 'diterima' && (
                                                <span className="text-[9px] font-extrabold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full uppercase tracking-wider">
                                                    Diterima
                                                </span>
                                            )}
                                            {item.status === 'ditolak' && (
                                                <span className="text-[9px] font-extrabold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full uppercase tracking-wider">
                                                    Ditolak
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center space-x-3 shrink-0">
                                        <Link
                                            href={`/pendaftaran/${item.id}`}
                                            className="px-4 py-2 border border-gray-155 hover:border-gray-300 text-navy font-bold text-xs rounded-xl transition-colors text-center"
                                        >
                                            Detail & Sertifikat
                                        </Link>

                                        {item.status === 'dalam_review' && (
                                            <button
                                                onClick={() => handleCancel(item.id, item.ekskul.nama)}
                                                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl transition-colors"
                                            >
                                                Batalkan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
