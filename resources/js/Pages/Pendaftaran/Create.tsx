import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Ekskul {
    id: string;
    nama: string;
    kategori: string;
}

interface CreateProps {
    ekskul: Ekskul;
}

export default function Create({ ekskul }: CreateProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [fileErrors, setFileErrors] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        ekskul_ta_id: ekskul.id,
        sertifikat_files: [] as File[],
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles: File[] = [];
        const errs: string[] = [];

        files.forEach((file) => {
            // Check size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                errs.push(`File ${file.name} melebihi kapasitas maksimum 2 MB.`);
                return;
            }
            // Check mime
            const validMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!validMimes.includes(file.type)) {
                errs.push(`File ${file.name} tidak memiliki ekstensi yang valid (Hanya PDF, JPG, PNG).`);
                return;
            }
            validFiles.push(file);
        });

        setFileErrors(errs);
        setSelectedFiles(validFiles);
        setData('sertifikat_files', validFiles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pendaftaran');
    };

    return (
        <AuthenticatedLayout title="Formulir Pendaftaran">
            <Head title={`Daftar ${ekskul.nama}`} />

            <div className="max-w-2xl mx-auto space-y-8">
                {/* Back Link */}
                <div>
                    <Link 
                        href={`/ekskul/${ekskul.id}`}
                        className="flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-navy transition-colors bg-white border border-gray-150 rounded-full px-4 py-2 w-fit"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Batal & Kembali</span>
                    </Link>
                </div>

                <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                        <span className="text-[9px] font-extrabold text-secondary bg-secondary/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {ekskul.kategori}
                        </span>
                        <h2 className="text-2xl font-black text-navy mt-2">Daftar Keanggotaan {ekskul.nama}</h2>
                        <p className="text-xs text-gray-400 font-bold">Harap isi form pendaftaran di bawah ini untuk mengajukan permohonan gabung.</p>
                    </div>

                    {/* Backend Validation Errors */}
                    {Object.keys(errors).length > 0 && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-1 text-red-800 text-xs font-semibold">
                            {Object.values(errors).map((err, idx) => (
                                <p key={idx}>• {err}</p>
                            ))}
                        </div>
                    )}

                    {/* File validation errors */}
                    {fileErrors.length > 0 && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-1 text-red-800 text-xs font-semibold">
                            {fileErrors.map((err, idx) => (
                                <p key={idx}>• {err}</p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload Zone */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                                Sertifikat / Piagam Prestasi (Opsional)
                            </label>
                            
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50/50 hover:bg-gray-50 transition-all cursor-pointer relative group">
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="space-y-2 flex flex-col items-center">
                                    <svg className="w-10 h-10 text-gray-400 group-hover:text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-xs font-bold text-gray-700">Pilih beberapa file sertifikat Anda</p>
                                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                                        Format PDF, JPG, JPEG, PNG. Maksimal 2 MB per berkas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* List of Selected Files */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Berkas Terpilih ({selectedFiles.length})</p>
                                <div className="divide-y divide-gray-100 bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2.5">
                                    {selectedFiles.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs font-semibold py-1.5 first:pt-0 last:pb-0">
                                            <span className="text-navy truncate max-w-sm">{file.name}</span>
                                            <span className="text-gray-400 text-[10px]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-black text-sm rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center space-x-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Mengajukan...</span>
                                    </>
                                ) : (
                                    <span>Ajukan Pendaftaran</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
