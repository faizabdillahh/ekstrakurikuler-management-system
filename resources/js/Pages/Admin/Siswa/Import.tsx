import React, { useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface SharedProps {
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: any;
}

export default function Import() {
    const { props } = usePage<SharedProps>();
    const { flash } = props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>('');

    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            setFileName(file.name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file) return;

        post('/admin/siswa/import', {
            onSuccess: () => {
                reset();
                setFileName('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <AuthenticatedLayout title="Impor Data Siswa">
            <Head title="Impor Data Siswa" />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Alert Notifications */}
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

                {errors.file && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-800 text-sm font-semibold">
                        <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{errors.file}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Grid: File Upload Form */}
                    <div className="md:col-span-2 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="font-black text-navy text-md">Unggah Spreadsheet</h3>
                            <p className="text-xs text-gray-400 font-bold">Pilih file spreadsheet berformat .xlsx / .xls untuk diunggah.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 hover:border-secondary/40 rounded-2xl p-8 text-center cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-all group flex flex-col items-center justify-center space-y-3"
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".xlsx,.xls"
                                    className="hidden"
                                />
                                
                                <svg className="w-12 h-12 text-gray-400 group-hover:text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                
                                <div className="text-sm font-bold text-gray-700">
                                    {fileName ? fileName : 'Pilih File Spreadsheet Anda'}
                                </div>
                                <p className="text-xs text-gray-400 font-semibold">
                                    Format file yang didukung: Microsoft Excel (.xlsx / .xls) hingga 10 MB.
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing || !data.file}
                                    className="px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Sedang Mengimpor...</span>
                                        </>
                                    ) : (
                                        <span>Proses Impor Data</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Grid: Instructions & Template Format */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="font-black text-navy text-md">Panduan Format</h3>
                            <p className="text-xs text-gray-400 font-bold">Struktur kolom Excel wajib</p>
                        </div>

                        <div className="space-y-4 text-xs font-semibold leading-relaxed">
                            <p className="text-gray-500">
                                Pastikan baris pertama (header) spreadsheet Anda memiliki kolom dengan nama-nama berikut:
                            </p>
                            
                            <ul className="space-y-3">
                                <li className="flex items-start space-x-2.5">
                                    <span className="bg-navy/10 text-navy font-bold text-[10px] px-1.5 py-0.5 rounded uppercase mt-0.5">nis</span>
                                    <span className="text-gray-600">Nomor Induk Siswa (Wajib & Unik)</span>
                                </li>
                                <li className="flex items-start space-x-2.5">
                                    <span className="bg-navy/10 text-navy font-bold text-[10px] px-1.5 py-0.5 rounded uppercase mt-0.5">nama</span>
                                    <span className="text-gray-600">Nama lengkap siswa (Wajib)</span>
                                </li>
                                <li className="flex items-start space-x-2.5">
                                    <span className="bg-navy/10 text-navy font-bold text-[10px] px-1.5 py-0.5 rounded uppercase mt-0.5">kelas</span>
                                    <span className="text-gray-600">Kelas aktif (misal: XI PPLG)</span>
                                </li>
                                <li className="flex items-start space-x-2.5">
                                    <span className="bg-navy/10 text-navy font-bold text-[10px] px-1.5 py-0.5 rounded uppercase mt-0.5">jurusan</span>
                                    <span className="text-gray-600">Jurusan resmi siswa (misal: PPLG)</span>
                                </li>
                                <li className="flex items-start space-x-2.5">
                                    <span className="bg-navy/10 text-navy font-bold text-[10px] px-1.5 py-0.5 rounded uppercase mt-0.5">jenis_kelamin</span>
                                    <span className="text-gray-600">Isi dengan <strong>L</strong> atau <strong>P</strong></span>
                                </li>
                                <li className="flex items-start space-x-2.5">
                                    <span className="bg-navy/10 text-navy font-bold text-[10px] px-1.5 py-0.5 rounded uppercase mt-0.5">no_hp</span>
                                    <span className="text-gray-600">Nomor kontak HP/WA</span>
                                </li>
                                <li className="flex items-start space-x-2.5">
                                    <span className="bg-navy/10 text-navy font-bold text-[10px] px-1.5 py-0.5 rounded uppercase mt-0.5">email</span>
                                    <span className="text-gray-600">Email Google sekolah. Jika dikosongkan akan di-generate otomatis: <strong>nis@jurusan.smkn1bawang.sch.id</strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
