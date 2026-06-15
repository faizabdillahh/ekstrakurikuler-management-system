import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface EditProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    event: {
        id: string;
        judul: string;
        deskripsi: string;
        tanggal_mulai: string;
        tanggal_selesai: string | null;
        lokasi: string | null;
        link_wa_eo: string | null;
    };
}

export default function Edit({ ekskulTa, event }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        judul: event.judul,
        deskripsi: event.deskripsi,
        tanggal_mulai: event.tanggal_mulai,
        tanggal_selesai: event.tanggal_selesai || '',
        lokasi: event.lokasi || '',
        link_wa_eo: event.link_wa_eo || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/manage/ekskul/${ekskulTa.id}/event/${event.id}`);
    };

    return (
        <AuthenticatedLayout title="Edit Agenda Event">
            <Head title="Edit Agenda Event" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-navy">Edit Agenda Event</h2>
                    <p className="text-xs text-gray-400 font-bold">Perbarui data agenda kegiatan ekstrakurikuler.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Judul Kegiatan</label>
                        <input
                            type="text"
                            value={data.judul}
                            onChange={(e) => setData('judul', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                        />
                        {errors.judul && <p className="text-xs text-red-500 font-bold">{errors.judul}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Deskripsi Kegiatan</label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                        />
                        {errors.deskripsi && <p className="text-xs text-red-500 font-bold">{errors.deskripsi}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Tanggal Mulai</label>
                            <input
                                type="datetime-local"
                                value={data.tanggal_mulai}
                                onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                            />
                            {errors.tanggal_mulai && <p className="text-xs text-red-500 font-bold">{errors.tanggal_mulai}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Tanggal Selesai (Opsional)</label>
                            <input
                                type="datetime-local"
                                value={data.tanggal_selesai}
                                onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                            />
                            {errors.tanggal_selesai && <p className="text-xs text-red-500 font-bold">{errors.tanggal_selesai}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Lokasi</label>
                        <input
                            type="text"
                            value={data.lokasi}
                            onChange={(e) => setData('lokasi', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                        />
                        {errors.lokasi && <p className="text-xs text-red-500 font-bold">{errors.lokasi}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">WhatsApp EO Link</label>
                        <input
                            type="text"
                            value={data.link_wa_eo}
                            onChange={(e) => setData('link_wa_eo', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                        />
                        {errors.link_wa_eo && <p className="text-xs text-red-500 font-bold">{errors.link_wa_eo}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                        <Link
                            href={`/manage/ekskul/${ekskulTa.id}/event`}
                            className="px-5 py-3 border border-gray-200 text-gray-600 text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-3 bg-secondary text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-secondary/90 transition-all disabled:opacity-50"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
