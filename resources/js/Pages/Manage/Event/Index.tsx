import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Dokumentasi {
    id: string;
    path: string;
    caption: string | null;
}

interface EventItem {
    id: string;
    judul: string;
    deskripsi: string;
    tanggal_mulai: string;
    tanggal_selesai: string | null;
    lokasi: string | null;
    link_wa_eo: string | null;
    creator: {
        nama: string;
    };
    dokumentasi: Dokumentasi[];
}

interface IndexProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    events: EventItem[];
}

export default function Index({ ekskulTa, events = [] }: IndexProps) {
    const { props } = usePage<any>();
    const { flash } = props;
    
    // Add Event Form State
    const eventForm = useForm({
        judul: '',
        deskripsi: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        lokasi: '',
        link_wa_eo: '',
    });

    // Doc upload form state
    const docForm = useForm({
        file: null as File | null,
        caption: '',
    });

    const [activeEventId, setActiveEventId] = useState<string | null>(null);

    const handleCreateEvent = (e: React.FormEvent) => {
        e.preventDefault();
        eventForm.post(`/manage/ekskul/${ekskulTa.id}/event`, {
            onSuccess: () => {
                eventForm.reset();
            }
        });
    };

    const handleUploadDoc = (e: React.FormEvent, eventId: string) => {
        e.preventDefault();
        docForm.post(`/manage/ekskul/${ekskulTa.id}/event/${eventId}/dokumentasi`, {
            onSuccess: () => {
                docForm.reset();
                setActiveEventId(null);
            }
        });
    };

    const deleteEventForm = useForm();
    const handleDeleteEvent = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus event ini?')) {
            deleteEventForm.delete(`/manage/ekskul/${ekskulTa.id}/event/${id}`);
        }
    };

    const deleteDocForm = useForm();
    const handleDeleteDoc = (docId: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus foto dokumentasi ini?')) {
            deleteDocForm.delete(`/manage/ekskul/${ekskulTa.id}/dokumentasi/${docId}`);
        }
    };

    return (
        <AuthenticatedLayout title={`Kegiatan & Event - ${ekskulTa.ekskul_nama}`}>
            <Head title={`Event - ${ekskulTa.ekskul_nama}`} />

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Alerts */}
                {flash.success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start space-x-3 text-green-800 text-sm font-semibold">
                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-navy">Kegiatan & Dokumentasi Event</h2>
                    <p className="text-xs text-gray-400 font-bold">Publikasikan agenda kegiatan serta unggah foto-foto dokumentasi resmi ekskul.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: Create Event Form */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm h-fit space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="font-black text-navy text-md">Buat Agenda Event</h3>
                            <p className="text-xs text-gray-400 font-bold">Tambahkan info kegiatan baru</p>
                        </div>

                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Judul Kegiatan</label>
                                <input
                                    type="text"
                                    value={eventForm.data.judul}
                                    onChange={(e) => eventForm.setData('judul', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                                    placeholder="Contoh: Latihan Gabungan Kwartir"
                                />
                                {eventForm.errors.judul && <p className="text-xs text-red-500 font-bold">{eventForm.errors.judul}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Deskripsi Kegiatan</label>
                                <textarea
                                    value={eventForm.data.deskripsi}
                                    onChange={(e) => eventForm.setData('deskripsi', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                                    placeholder="Tulis rincian kegiatan..."
                                />
                                {eventForm.errors.deskripsi && <p className="text-xs text-red-500 font-bold">{eventForm.errors.deskripsi}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Tanggal Mulai</label>
                                <input
                                    type="datetime-local"
                                    value={eventForm.data.tanggal_mulai}
                                    onChange={(e) => eventForm.setData('tanggal_mulai', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                                />
                                {eventForm.errors.tanggal_mulai && <p className="text-xs text-red-500 font-bold">{eventForm.errors.tanggal_mulai}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Tanggal Selesai (Opsional)</label>
                                <input
                                    type="datetime-local"
                                    value={eventForm.data.tanggal_selesai}
                                    onChange={(e) => eventForm.setData('tanggal_selesai', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                                />
                                {eventForm.errors.tanggal_selesai && <p className="text-xs text-red-500 font-bold">{eventForm.errors.tanggal_selesai}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Lokasi</label>
                                <input
                                    type="text"
                                    value={eventForm.data.lokasi}
                                    onChange={(e) => eventForm.setData('lokasi', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                                    placeholder="Contoh: Lapangan Utama SMKN 1"
                                />
                                {eventForm.errors.lokasi && <p className="text-xs text-red-500 font-bold">{eventForm.errors.lokasi}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">WhatsApp EO Link</label>
                                <input
                                    type="text"
                                    value={eventForm.data.link_wa_eo}
                                    onChange={(e) => eventForm.setData('link_wa_eo', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                                    placeholder="Contoh: https://wa.me/..."
                                />
                                {eventForm.errors.link_wa_eo && <p className="text-xs text-red-500 font-bold">{eventForm.errors.link_wa_eo}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={eventForm.processing}
                                className="w-full py-3 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-navy/95 transition-all disabled:opacity-50"
                            >
                                Buat Kegiatan
                            </button>
                        </form>
                    </div>

                    {/* Right Panel: List of Events */}
                    <div className="lg:col-span-2 space-y-6">
                        {events.length === 0 ? (
                            <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center">
                                <p className="text-sm text-gray-400 font-semibold">Belum ada agenda kegiatan yang terdaftar.</p>
                            </div>
                        ) : (
                            events.map((e) => (
                                <div key={e.id} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-100 pb-4">
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                                                Dibuat oleh: {e.creator.nama}
                                            </span>
                                            <h3 className="text-lg font-black text-navy">{e.judul}</h3>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-semibold">
                                                <span className="flex items-center space-x-1">
                                                    <span>📅</span>
                                                    <span>
                                                        {new Date(e.tanggal_mulai).toLocaleString('id-ID')}
                                                        {e.tanggal_selesai && ` s/d ${new Date(e.tanggal_selesai).toLocaleString('id-ID')}`}
                                                    </span>
                                                </span>
                                                {e.lokasi && (
                                                    <span className="flex items-center space-x-1">
                                                        <span>📍</span>
                                                        <span>{e.lokasi}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 shrink-0">
                                            {e.link_wa_eo && (
                                                <a
                                                    href={e.link_wa_eo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-2 bg-green-50 border border-green-150 rounded-xl hover:bg-green-100 text-xs font-extrabold text-green-700 transition-colors"
                                                >
                                                    Hubungi EO
                                                </a>
                                            )}
                                            <Link
                                                href={`/manage/ekskul/${ekskulTa.id}/event/${e.id}/edit`}
                                                className="px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 text-xs font-extrabold text-blue-700 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteEvent(e.id)}
                                                className="px-3 py-2 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 text-xs font-extrabold text-red-700 transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm font-semibold text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {e.deskripsi}
                                    </p>

                                    {/* Dokumentasi Section */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Foto Dokumentasi ({e.dokumentasi.length})</h4>
                                            {activeEventId !== e.id ? (
                                                <button
                                                    onClick={() => setActiveEventId(e.id)}
                                                    className="text-[10px] font-extrabold text-secondary hover:underline uppercase tracking-wider"
                                                >
                                                    + Unggah Foto
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setActiveEventId(null)}
                                                    className="text-[10px] font-extrabold text-gray-400 hover:underline uppercase tracking-wider"
                                                >
                                                    Batal
                                                </button>
                                            )}
                                        </div>

                                        {activeEventId === e.id && (
                                            <form onSubmit={(formEvent) => handleUploadDoc(formEvent, e.id)} className="p-4 bg-gray-50 border border-gray-150 rounded-2xl space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">File Foto (JPEG/PNG, Max 5MB)</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(eventInput) => docForm.setData('file', eventInput.target.files?.[0] || null)}
                                                        className="w-full text-xs font-bold text-navy"
                                                    />
                                                    {docForm.errors.file && <p className="text-xs text-red-500 font-bold">{docForm.errors.file}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Keterangan / Caption</label>
                                                    <input
                                                        type="text"
                                                        value={docForm.data.caption}
                                                        onChange={(eventInput) => docForm.setData('caption', eventInput.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                                        placeholder="Contoh: Sambutan Kepala Sekolah"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={docForm.processing}
                                                    className="px-4 py-2 bg-secondary text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-secondary/90 transition-all"
                                                >
                                                    Unggah Foto
                                                </button>
                                            </form>
                                        )}

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {e.dokumentasi.map((doc) => (
                                                <div key={doc.id} className="relative border border-gray-100 rounded-2xl overflow-hidden group shadow-sm bg-gray-50">
                                                    <img src={doc.path} alt={doc.caption || 'Dokumentasi'} className="w-full h-32 object-cover" />
                                                    {doc.caption && (
                                                        <div className="p-2">
                                                            <p className="text-[10px] font-bold text-gray-700 line-clamp-1">{doc.caption}</p>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteDoc(doc.id)}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow"
                                                        title="Hapus Foto"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
