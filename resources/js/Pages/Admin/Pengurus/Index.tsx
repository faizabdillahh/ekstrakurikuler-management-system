import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Assignment {
    id: string;
    user: {
        id: string;
        nama: string;
        email: string;
        role: string;
    };
}

interface EkskulTa {
    id: string;
    ekskul_nama: string;
    assignments: Assignment[];
}

interface EligibleUser {
    id: string;
    nama: string;
    email: string;
    kelas: string | null;
    role: string;
}

interface OsisUser {
    id: string;
    nama: string;
    email: string;
}

interface IndexProps {
    ekskulTaList: EkskulTa[];
    eligibleUsers: EligibleUser[];
    osisUsers: OsisUser[];
}

export default function Index({ ekskulTaList = [], eligibleUsers = [], osisUsers = [] }: IndexProps) {
    const { props } = usePage<any>();
    const { flash } = props;

    // Assign admin Form
    const assignForm = useForm({
        user_id: eligibleUsers[0]?.id || '',
        ekskul_ta_id: ekskulTaList[0]?.id || '',
    });

    // Suksesi OSIS Form
    const suksesiForm = useForm({
        user_id: eligibleUsers[0]?.id || '',
    });

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignForm.data.user_id || !assignForm.data.ekskul_ta_id) {
            alert('Silakan pilih user dan ekskul.');
            return;
        }
        assignForm.post('/admin/pengurus/assign', {
            onSuccess: () => {
                assignForm.reset('user_id');
            }
        });
    };

    const handleSuksesi = (e: React.FormEvent) => {
        e.preventDefault();
        if (!suksesiForm.data.user_id) {
            alert('Silakan pilih calon pengurus OSIS baru.');
            return;
        }
        if (confirm('APAKAH ANDA YAKIN? Tindakan suksesi ini akan mencabut hak akses OSIS Anda dan memindahkannya ke user yang dipilih secara permanen.')) {
            suksesiForm.post('/admin/pengurus/suksesi-osis');
        }
    };

    const revokeForm = useForm();
    const handleRevoke = (assignmentId: string) => {
        if (confirm('Apakah Anda yakin ingin mencabut hak penugasan admin untuk user ini?')) {
            revokeForm.delete(`/admin/pengurus/${assignmentId}`);
        }
    };

    return (
        <AuthenticatedLayout title="Manajemen Pengurus & Admin">
            <Head title="Manajemen Pengurus & Admin" />

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
                {flash.error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-800 text-sm font-semibold">
                        <span>⚠️ {flash.error}</span>
                    </div>
                )}

                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-navy">Manajemen Akses & Suksesi Pengurus</h2>
                    <p className="text-xs text-gray-400 font-bold">Penugasan admin ekskul dan pemindahan tanggung jawab kepengurusan OSIS secara manual.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Forms */}
                    <div className="space-y-6">
                        {/* Assign Admin Ekskul Form */}
                        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                            <div className="border-b border-gray-100 pb-2">
                                <h3 className="font-black text-navy text-md">Tugaskan Admin Ekskul</h3>
                                <p className="text-[10px] text-gray-400 font-bold">Beri akses kelola ekstrakurikuler ke siswa/guru</p>
                            </div>

                            <form onSubmit={handleAssign} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Pilih Calon Admin</label>
                                    <select
                                        value={assignForm.data.user_id}
                                        onChange={(e) => assignForm.setData('user_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                                    >
                                        <option value="" disabled>-- Pilih Calon Admin --</option>
                                        {eligibleUsers.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.nama} ({u.role.toUpperCase()})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Unit Ekskul</label>
                                    <select
                                        value={assignForm.data.ekskul_ta_id}
                                        onChange={(e) => assignForm.setData('ekskul_ta_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                                    >
                                        <option value="" disabled>-- Pilih Ekskul --</option>
                                        {ekskulTaList.map((eta) => (
                                            <option key={eta.id} value={eta.id}>{eta.ekskul_nama}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={assignForm.processing}
                                    className="w-full py-2.5 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-navy/95 transition-all"
                                >
                                    Tugaskan Admin
                                </button>
                            </form>
                        </div>

                        {/* OSIS Suksesi Form */}
                        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4 border-t-4 border-t-accent">
                            <div className="border-b border-gray-100 pb-2">
                                <h3 className="font-black text-navy text-md">Suksesi Pengurus OSIS</h3>
                                <p className="text-[10px] text-gray-400 font-bold">Transfer peran kepengurusan OSIS ke penerus baru</p>
                            </div>

                            <form onSubmit={handleSuksesi} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Penerus OSIS Baru</label>
                                    <select
                                        value={suksesiForm.data.user_id}
                                        onChange={(e) => suksesiForm.setData('user_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                                    >
                                        <option value="" disabled>-- Pilih Penerus OSIS --</option>
                                        {eligibleUsers.filter(u => u.role === 'siswa').map((u) => (
                                            <option key={u.id} value={u.id}>{u.nama} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={suksesiForm.processing}
                                    className="w-full py-2.5 bg-accent text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-accent/90 transition-all"
                                >
                                    Lakukan Suksesi OSIS
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Assigned Admins & OSIS Members Lists */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* OSIS Members */}
                        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                            <div className="border-b border-gray-100 pb-3">
                                <h3 className="font-black text-navy text-md">Pengurus OSIS Aktif</h3>
                                <p className="text-xs text-gray-400 font-bold">Daftar siswa yang saat ini memiliki akses pengurus OSIS</p>
                            </div>
                            <div className="space-y-2">
                                {osisUsers.map((u) => (
                                    <div key={u.id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                                        <div>
                                            <p className="font-black text-sm text-gray-800">{u.nama}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{u.email}</p>
                                        </div>
                                        <span className="text-[10px] font-extrabold text-accent bg-accent/15 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            Pengurus OSIS
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Extracurricular Assignments List */}
                        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                            <div className="border-b border-gray-100 pb-3">
                                <h3 className="font-black text-navy text-md">Daftar Admin Penanggung Jawab Ekskul</h3>
                                <p className="text-xs text-gray-400 font-bold">Penugasan administrator pendukung per masing-masing ekskul tahun ini</p>
                            </div>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto divide-y divide-gray-100">
                                {ekskulTaList.map((eta) => (
                                    <div key={eta.id} className="pt-4 first:pt-0 space-y-2">
                                        <h4 className="font-black text-navy text-sm capitalize">{eta.ekskul_nama}</h4>
                                        <div className="space-y-2 pl-2 border-l-2 border-gray-150">
                                            {eta.assignments.length === 0 ? (
                                                <p className="text-xs text-gray-400 font-semibold italic">Belum ada admin ditugaskan.</p>
                                            ) : (
                                                eta.assignments.map((assignment) => (
                                                    <div key={assignment.id} className="p-2.5 bg-gray-50/50 rounded-xl flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs font-black text-gray-800">{assignment.user.nama}</p>
                                                            <p className="text-[9px] text-gray-400 font-bold">{assignment.user.email} | Role: {assignment.user.role.toUpperCase()}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRevoke(assignment.id)}
                                                            className="text-[10px] font-extrabold text-red-600 hover:underline uppercase tracking-wider"
                                                        >
                                                            Cabut Akses
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
