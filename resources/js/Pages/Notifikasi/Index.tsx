import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface NotificationItem {
    id: string;
    tipe: string;
    judul: string;
    pesan: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

interface IndexProps {
    notifications: NotificationItem[];
}

export default function Index({ notifications = [] }: IndexProps) {
    const { props } = usePage<any>();
    const { flash } = props;

    const readForm = useForm();

    const handleMarkRead = (id: string) => {
        readForm.post(`/notifikasi/${id}/read`);
    };

    const handleMarkAllRead = () => {
        readForm.post('/notifikasi/read-all');
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <AuthenticatedLayout title="Kotak Masuk Notifikasi">
            <Head title="Notifikasi" />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Alerts */}
                {flash.success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start space-x-3 text-green-800 text-sm font-semibold">
                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-navy">Kotak Masuk Notifikasi</h2>
                        <p className="text-xs text-gray-400 font-bold">Daftar pemberitahuan status seleksi, absensi latihan, dan pengumuman ekskul.</p>
                    </div>
                    {unreadCount > 0 && (
                        <div>
                            <button
                                onClick={handleMarkAllRead}
                                disabled={readForm.processing}
                                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all"
                            >
                                Tandai Semua Dibaca
                            </button>
                        </div>
                    )}
                </div>

                {/* Notification List */}
                <div className="space-y-3">
                    {notifications.length === 0 ? (
                        <div className="bg-white border border-gray-150 rounded-3xl p-16 text-center shadow-sm">
                            <span className="text-4xl block mb-3">🔔</span>
                            <p className="text-sm text-gray-400 font-semibold">Belum ada notifikasi masuk.</p>
                        </div>
                    ) : (
                        notifications.map((n) => {
                            // Determine icon based on notification type
                            let icon = '📢';
                            if (n.tipe === 'seleksi') icon = '📝';
                            if (n.tipe === 'absensi') icon = '📅';
                            if (n.tipe === 'sertifikat') icon = '🎓';

                            return (
                                <div
                                    key={n.id}
                                    className={`bg-white border rounded-3xl p-5 shadow-sm transition-all flex items-start gap-4 hover:shadow-md relative overflow-hidden ${
                                        n.is_read ? 'border-gray-150 opacity-80' : 'border-secondary/30'
                                    }`}
                                >
                                    {/* Unread indicator */}
                                    {!n.is_read && (
                                        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-secondary"></span>
                                    )}

                                    <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-center text-lg shrink-0">
                                        {icon}
                                    </div>

                                    <div className="flex-1 space-y-1.5 min-w-0 pr-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-navy text-sm truncate">{n.judul}</h3>
                                        </div>
                                        <p className="text-xs text-gray-500 font-semibold leading-relaxed">{n.pesan}</p>
                                        <div className="flex items-center space-x-4 pt-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            <span>{new Date(n.created_at).toLocaleString('id-ID')}</span>
                                            {n.link && (
                                                <a href={n.link} className="text-secondary hover:underline">Lihat Detail →</a>
                                            )}
                                        </div>
                                    </div>

                                    {!n.is_read && (
                                        <button
                                            onClick={() => handleMarkRead(n.id)}
                                            disabled={readForm.processing}
                                            className="shrink-0 text-[10px] font-extrabold text-secondary hover:underline uppercase tracking-wider mt-1"
                                        >
                                            Baca
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
