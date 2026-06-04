import React, { useRef, useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Ekskul {
    id: string;
    nama: string;
    kategori: string;
    warna_primer: string;
    warna_sekunder: string;
}

interface Sertifikat {
    id: string;
    nama_file: string;
    url: string;
}

interface PendaftaranDetail {
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

interface ShowProps {
    pendaftaran: PendaftaranDetail;
}

export default function Show({ pendaftaran }: ShowProps) {
    const { props } = usePage<SharedProps>();
    const { flash } = props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileError, setFileError] = useState<string>('');

    const { data, setData, post, processing, reset } = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                setFileError('File melebihi kapasitas maksimum 2 MB.');
                return;
            }
            // Check type
            const validMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!validMimes.includes(file.type)) {
                setFileError('Hanya mendukung file PDF, JPG, atau PNG.');
                return;
            }

            setFileError('');
            setData('file', file);

            // Directly upload after selecting
            const formData = new FormData();
            formData.append('file', file);
            
            router.post(`/pendaftaran/${pendaftaran.id}/sertifikat`, {
                file: file
            }, {
                onSuccess: () => {
                    reset();
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }
            });
        }
    };

    const handleDeleteSertifikat = (id: string, fileName: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus sertifikat "${fileName}"?`)) {
            router.delete(`/sertifikat/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Detail Pendaftaran">
            <Head title={`Pendaftaran - ${pendaftaran.ekskul.nama}`} />

            <div className="max-w-3xl mx-auto space-y-8">
                {/* Back button */}
                <div>
                    <Link 
                        href="/pendaftaran"
                        className="flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-navy transition-colors bg-white border border-gray-150 rounded-full px-4 py-2 w-fit"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Kembali ke Riwayat</span>
                    </Link>
                </div>

                {/* Notifications */}
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

                {fileError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-800 text-sm font-semibold">
                        <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{fileError}</span>
                    </div>
                )}

                {/* Details Card */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 gap-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-extrabold text-secondary bg-secondary/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                {pendaftaran.ekskul.kategori}
                            </span>
                            <h2 className="text-2xl font-black text-navy mt-2">{pendaftaran.ekskul.nama}</h2>
                            <p className="text-xs text-gray-400 font-bold">Diajukan pada: {pendaftaran.created_at}</p>
                        </div>

                        <div>
                            {pendaftaran.status === 'dalam_review' && (
                                <span className="text-xs font-black text-yellow-700 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-xl uppercase tracking-wider block text-center">
                                    Dalam Review
                                </span>
                            )}
                            {pendaftaran.status === 'diterima' && (
                                <span className="text-xs font-black text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-xl uppercase tracking-wider block text-center">
                                    Diterima
                                </span>
                            )}
                            {pendaftaran.status === 'ditolak' && (
                                <span className="text-xs font-black text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-xl uppercase tracking-wider block text-center">
                                    Ditolak
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Certificates Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-navy text-sm uppercase tracking-wider">Sertifikat Pendukung</h3>
                            
                            {pendaftaran.status === 'dalam_review' && (
                                <div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden" 
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={processing}
                                        className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
                                    >
                                        + Tambah Berkas
                                    </button>
                                </div>
                            )}
                        </div>

                        {pendaftaran.sertifikat.length === 0 ? (
                            <p className="text-xs text-gray-400 font-bold bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                                Belum ada sertifikat prestasi yang dilampirkan.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {pendaftaran.sertifikat.map((sert) => (
                                    <div key={sert.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between gap-4">
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <span className="text-xl">📄</span>
                                            <span className="text-xs font-black text-gray-700 truncate max-w-sm">{sert.nama_file}</span>
                                        </div>

                                        <div className="flex items-center space-x-3 shrink-0">
                                            <a 
                                                href={sert.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 bg-white border border-gray-150 hover:border-gray-300 text-navy font-bold text-xs rounded-lg transition-colors"
                                            >
                                                Pratinjau
                                            </a>

                                            {pendaftaran.status === 'dalam_review' && (
                                                <button
                                                    onClick={() => handleDeleteSertifikat(sert.id, sert.nama_file)}
                                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-150 text-red-700 font-bold text-xs rounded-lg transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
