import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface EditProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    ekskul: {
        id: string;
        nama: string;
        kategori: string;
        deskripsi: string | null;
        logo_url: string | null;
        warna_primer: string;
        warna_sekunder: string;
        media_sosial: {
            instagram?: string;
            youtube?: string;
            facebook?: string;
            tiktok?: string;
        } | null;
    };
}

export default function Edit({ ekskulTa, ekskul }: EditProps) {
    const { props } = usePage<any>();
    const { flash } = props;

    // Profile settings form
    const profileForm = useForm({
        nama: ekskul.nama,
        kategori: ekskul.kategori,
        deskripsi: ekskul.deskripsi || '',
        warna_primer: ekskul.warna_primer || '#fff000',
        warna_sekunder: ekskul.warna_sekunder || '#00a2e9',
        media_sosial: {
            instagram: ekskul.media_sosial?.instagram || '',
            youtube: ekskul.media_sosial?.youtube || '',
            facebook: ekskul.media_sosial?.facebook || '',
            tiktok: ekskul.media_sosial?.tiktok || '',
        },
    });

    // Logo upload form
    const logoForm = useForm({
        logo: null as File | null,
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put(`/manage/ekskul/${ekskulTa.id}/update`);
    };

    const handleLogoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!logoForm.data.logo) {
            alert('Silakan pilih file logo terlebih dahulu.');
            return;
        }
        logoForm.post(`/manage/ekskul/${ekskulTa.id}/logo`, {
            onSuccess: () => {
                logoForm.reset();
            }
        });
    };

    return (
        <AuthenticatedLayout title={`Pengaturan Profil - ${ekskulTa.ekskul_nama}`}>
            <Head title={`Pengaturan - ${ekskulTa.ekskul_nama}`} />

            <div className="max-w-5xl mx-auto space-y-8">
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
                    <h2 className="text-2xl font-black text-navy">Pengaturan Profil & Branding Ekskul</h2>
                    <p className="text-xs text-gray-400 font-bold">Kustomisasi identitas visual, deskripsi profil, dan tautan sosial media resmi ekskul.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Logo Update */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm h-fit space-y-6">
                        <div className="border-b border-gray-100 pb-3">
                            <h3 className="font-black text-navy text-md">Logo Ekskul</h3>
                            <p className="text-[10px] text-gray-400 font-bold">Identitas gambar resmi</p>
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-32 h-32 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shadow-inner">
                                {ekskul.logo_url ? (
                                    <img src={ekskul.logo_url} alt={ekskul.nama} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl text-gray-300">🏫</span>
                                )}
                            </div>

                            <form onSubmit={handleLogoSubmit} className="w-full space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block text-center">Ganti Logo Baru</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => logoForm.setData('logo', e.target.files?.[0] || null)}
                                        className="w-full text-xs font-bold text-navy file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-extrabold file:uppercase file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                    />
                                    {logoForm.errors.logo && <p className="text-xs text-red-500 font-bold text-center">{logoForm.errors.logo}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={logoForm.processing}
                                    className="w-full py-2 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-navy/95 transition-all"
                                >
                                    Unggah Logo
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Profile Form */}
                    <div className="lg:col-span-2 bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                        <div className="border-b border-gray-100 pb-3">
                            <h3 className="font-black text-navy text-md">Detail Informasi & Warna Tema</h3>
                            <p className="text-xs text-gray-400 font-bold">Sesuaikan tampilan detail profil ekskul di halaman publik</p>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Nama Ekstrakurikuler</label>
                                    <input
                                        type="text"
                                        value={profileForm.data.nama}
                                        onChange={(e) => profileForm.setData('nama', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                    />
                                    {profileForm.errors.nama && <p className="text-xs text-red-500 font-bold">{profileForm.errors.nama}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Kategori</label>
                                    <input
                                        type="text"
                                        value={profileForm.data.kategori}
                                        onChange={(e) => profileForm.setData('kategori', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                    />
                                    {profileForm.errors.kategori && <p className="text-xs text-red-500 font-bold">{profileForm.errors.kategori}</p>}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Deskripsi Profil</label>
                                <textarea
                                    value={profileForm.data.deskripsi}
                                    onChange={(e) => profileForm.setData('deskripsi', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                    placeholder="Tulis sejarah, visi misi, atau pencapaian ekskul..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Warna Primer Tema</label>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="color"
                                            value={profileForm.data.warna_primer}
                                            onChange={(e) => profileForm.setData('warna_primer', e.target.value)}
                                            className="w-10 h-10 border-0 rounded cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={profileForm.data.warna_primer}
                                            onChange={(e) => profileForm.setData('warna_primer', e.target.value)}
                                            className="w-32 px-3 py-1.5 border border-gray-150 rounded-xl text-xs font-bold text-navy"
                                        />
                                    </div>
                                    {profileForm.errors.warna_primer && <p className="text-xs text-red-500 font-bold">{profileForm.errors.warna_primer}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Warna Sekunder Tema</label>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="color"
                                            value={profileForm.data.warna_sekunder}
                                            onChange={(e) => profileForm.setData('warna_sekunder', e.target.value)}
                                            className="w-10 h-10 border-0 rounded cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={profileForm.data.warna_sekunder}
                                            onChange={(e) => profileForm.setData('warna_sekunder', e.target.value)}
                                            className="w-32 px-3 py-1.5 border border-gray-150 rounded-xl text-xs font-bold text-navy"
                                        />
                                    </div>
                                    {profileForm.errors.warna_sekunder && <p className="text-xs text-red-500 font-bold">{profileForm.errors.warna_sekunder}</p>}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Tautan Media Sosial Resmi</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Instagram URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://instagram.com/..."
                                            value={profileForm.data.media_sosial.instagram}
                                            onChange={(e) => profileForm.setData('media_sosial', {
                                                ...profileForm.data.media_sosial,
                                                instagram: e.target.value
                                            })}
                                            className="w-full px-4 py-2 border border-gray-150 rounded-xl font-bold text-xs text-navy"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">YouTube URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://youtube.com/..."
                                            value={profileForm.data.media_sosial.youtube}
                                            onChange={(e) => profileForm.setData('media_sosial', {
                                                ...profileForm.data.media_sosial,
                                                youtube: e.target.value
                                            })}
                                            className="w-full px-4 py-2 border border-gray-150 rounded-xl font-bold text-xs text-navy"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Facebook URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://facebook.com/..."
                                            value={profileForm.data.media_sosial.facebook}
                                            onChange={(e) => profileForm.setData('media_sosial', {
                                                ...profileForm.data.media_sosial,
                                                facebook: e.target.value
                                            })}
                                            className="w-full px-4 py-2 border border-gray-150 rounded-xl font-bold text-xs text-navy"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">TikTok URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://tiktok.com/..."
                                            value={profileForm.data.media_sosial.tiktok}
                                            onChange={(e) => profileForm.setData('media_sosial', {
                                                ...profileForm.data.media_sosial,
                                                tiktok: e.target.value
                                            })}
                                            className="w-full px-4 py-2 border border-gray-150 rounded-xl font-bold text-xs text-navy"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="px-6 py-3 bg-secondary text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-secondary/95 transition-all disabled:opacity-50"
                                >
                                    Simpan Profil
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
