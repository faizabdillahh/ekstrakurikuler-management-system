import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface ActivityItem {
    id: string;
    log_name: string;
    description: string;
    subject_type: string;
    subject_id: string;
    causer_name: string;
    causer_email: string | null;
    properties: any;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface IndexProps {
    activities: {
        data: ActivityItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function Index({ activities }: IndexProps) {
    const [selectedProperties, setSelectedProperties] = useState<any | null>(null);

    return (
        <AuthenticatedLayout title="Audit Logs">
            <Head title="Admin - Audit Log Pelacak Aktivitas" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-navy">Audit Log Pelacak Aktivitas</h2>
                    <p className="text-xs text-gray-400 font-bold">Catatan riwayat seluruh aktivitas dan perubahan data sistem (Read-only, Append-only).</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Log Table Card */}
                    <div className="lg:col-span-2 bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm space-y-4 pb-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Aktor (Who)</th>
                                        <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Aktivitas (What)</th>
                                        <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Waktu (When)</th>
                                        <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider text-right">Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {activities.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-xs text-gray-400 font-semibold">
                                                Belum ada rekaman log aktivitas.
                                            </td>
                                        </tr>
                                    ) : (
                                        activities.data.map((act) => (
                                            <tr key={act.id} className="hover:bg-gray-50/40 transition-colors">
                                                <td className="p-4 space-y-1">
                                                    <p className="text-xs font-black text-gray-800">{act.causer_name}</p>
                                                    <p className="text-[9px] text-gray-400 font-semibold">{act.causer_email || 'Sistem'}</p>
                                                </td>
                                                <td className="p-4 space-y-1">
                                                    <p className="text-xs font-bold text-gray-700 capitalize">{act.description}</p>
                                                    <p className="text-[9px] text-gray-400 font-semibold">
                                                        Modul: {act.subject_type || '-'} (ID: {act.subject_id ? act.subject_id.slice(0, 8) + '...' : '-'})
                                                    </p>
                                                </td>
                                                <td className="p-4 text-[10px] font-bold text-gray-500">
                                                    {act.created_at}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {act.properties && Object.keys(act.properties).length > 0 ? (
                                                        <button
                                                            onClick={() => setSelectedProperties(act.properties)}
                                                            className="px-2.5 py-1 bg-navy/5 hover:bg-navy/10 text-navy font-bold text-[10px] uppercase rounded-lg transition-colors"
                                                        >
                                                            Lihat Data
                                                        </button>
                                                    ) : (
                                                        <span className="text-[9px] text-gray-300 font-semibold">Tidak ada</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Links */}
                        {activities.links.length > 3 && (
                            <div className="flex justify-center items-center space-x-1 pt-4 border-t border-gray-100 px-4">
                                {activities.links.map((link, i) => {
                                    if (link.url === null) {
                                        return (
                                            <span 
                                                key={i} 
                                                className="px-3 py-2 bg-gray-50 border border-gray-150 text-gray-300 text-xs font-bold rounded-xl"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`px-3 py-2 border text-xs font-bold rounded-xl transition-all ${
                                                link.active 
                                                    ? 'bg-navy border-navy text-white shadow-sm'
                                                    : 'bg-white border-gray-150 text-navy hover:bg-gray-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Properties Detail Sidebar Card */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                        <h3 className="font-black text-navy text-sm">Pratinjau Nilai Perubahan</h3>
                        <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                            Pilih salah satu aktivitas log di tabel untuk membedah data properties sebelum dan sesudah dimodifikasi.
                        </p>
                        
                        {selectedProperties ? (
                            <pre className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] text-gray-700 font-mono overflow-auto max-h-[400px]">
                                {JSON.stringify(selectedProperties, null, 2)}
                            </pre>
                        ) : (
                            <div className="p-8 bg-gray-50 border border-gray-100 border-dashed rounded-2xl text-center text-xs text-gray-300 font-bold">
                                Silakan klik tombol "Lihat Data" untuk membedah payload.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
