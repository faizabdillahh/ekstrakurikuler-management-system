import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface StudentUser {
    id: string;
    nama: string;
    nis: string | null;
    kelas: string | null;
    jurusan: string | null;
}

interface AnggotaGrade {
    id: string; // Anggota ID
    nilai_akhir: number | '';
    user: StudentUser;
}

interface IndexProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    anggotaList: AnggotaGrade[];
}

interface SharedProps {
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: any;
}

export default function Index({ ekskulTa, anggotaList }: IndexProps) {
    const { props } = usePage<SharedProps>();
    const { flash } = props;

    // We build the initial form state where keys are Anggota IDs, and values are current grades
    const initialGrades = anggotaList.reduce((acc, a) => {
        acc[a.id] = a.nilai_akhir;
        return acc;
    }, {} as Record<string, number | ''>);

    const form = useForm({
        grades: initialGrades,
    });

    const handleGradeChange = (anggotaId: string, value: string) => {
        if (value === '') {
            form.setData('grades', {
                ...form.data.grades,
                [anggotaId]: '',
            });
            return;
        }

        const floatVal = parseFloat(value);
        if (!isNaN(floatVal)) {
            // Cap it loosely or keep it raw for submission validation
            form.setData('grades', {
                ...form.data.grades,
                [anggotaId]: floatVal,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Frontend validation check
        let hasError = false;
        Object.entries(form.data.grades).forEach(([_, val]) => {
            if (val !== '' && (val < 0 || val > 100)) {
                hasError = true;
            }
        });

        if (hasError) {
            alert('Format nilai salah. Seluruh nilai harus berada di kisaran 0 s/d 100.');
            return;
        }

        form.put(`/manage/ekskul/${ekskulTa.id}/penilaian`);
    };

    return (
        <AuthenticatedLayout title={`Penilaian ${ekskulTa.ekskul_nama}`}>
            <Head title={`Penilaian - ${ekskulTa.ekskul_nama}`} />

            <div className="max-w-5xl mx-auto space-y-6">
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
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-navy">Pemberian Nilai Akhir</h2>
                    <p className="text-xs text-gray-400 font-bold">Input nilai akhir tahun ajaran untuk seluruh anggota aktif (Skala 0.00 - 100.00).</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Siswa Anggota</th>
                                        <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider w-48 text-right">Nilai Akhir (0-100)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {anggotaList.length === 0 ? (
                                        <tr>
                                            <td colSpan={2} className="p-8 text-center text-xs text-gray-400 font-semibold">
                                                Tidak ada anggota aktif untuk dilakukan penilaian.
                                            </td>
                                        </tr>
                                    ) : (
                                        anggotaList.map((a) => (
                                            <tr key={a.id} className="hover:bg-gray-50/40 transition-colors">
                                                <td className="p-4 space-y-1">
                                                    <p className="text-sm font-black text-gray-800">{a.user.nama}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">
                                                        NIS: {a.user.nis || '-'} | Kelas: {a.user.kelas || '-'} ({a.user.jurusan || '-'})
                                                    </p>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="100"
                                                            placeholder="Belum dinilai"
                                                            value={form.data.grades[a.id]}
                                                            onChange={(e) => handleGradeChange(a.id, e.target.value)}
                                                            className={`w-32 px-4 py-2 border rounded-xl font-bold text-sm text-center text-navy focus:ring-1 ${
                                                                form.data.grades[a.id] !== '' && (Number(form.data.grades[a.id]) < 0 || Number(form.data.grades[a.id]) > 100)
                                                                    ? 'border-red-500 focus:ring-red-500'
                                                                    : 'border-gray-150 focus:border-secondary focus:ring-secondary'
                                                            }`}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={form.processing || anggotaList.length === 0}
                            className="px-6 py-3 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-navy-light transition-all disabled:opacity-50"
                        >
                            Simpan Seluruh Nilai
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
