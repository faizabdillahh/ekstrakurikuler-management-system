import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const features = [
        {
            title: "27 Pilihan Ekstrakurikuler",
            description: "Mulai dari Pramuka, OSIS, olahraga, seni, hingga klub IT. Temukan minat bakat terbaikmu di sini.",
            icon: (
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            title: "Pendaftaran Online & Opsional",
            description: "Daftar ekskul pilihanmu secara mandiri. Pendaftaran bersifat opsional untuk menunjang minat belajar.",
            icon: (
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Seleksi Biner Transparan",
            description: "Status seleksi bersifat biner (diterima atau ditolak) tanpa sistem tunggu/cadangan yang membingungkan.",
            icon: (
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            )
        },
        {
            title: "Absensi & Penilaian Terpadu",
            description: "Pengurus ekskul dan pembina dapat mengelola presensi serta nilai siswa secara terintegrasi dan akuntabel.",
            icon: (
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            title: "Notifikasi WhatsApp Cepat",
            description: "Dapatkan link notifikasi presensi atau hasil seleksi yang terintegrasi langsung dengan nomor WhatsApp tujuan.",
            icon: (
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            )
        },
        {
            title: "Audit Log Keamanan",
            description: "Setiap riwayat aktivitas sistem tercatat rapi secara permanen untuk menjamin transparansi data sekolah.",
            icon: (
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        }
    ];

    const ekskulCategories = [
        { name: "Seni & Budaya", count: 6, icon: "🎨" },
        { name: "Olahraga & Kesehatan", count: 8, icon: "⚽" },
        { name: "Sains & Teknologi", count: 4, icon: "💻" },
        { name: "Kemanusiaan & Bela Negara", count: 5, icon: "🇮🇩" },
        { name: "Keagamaan", count: 4, icon: "🕌" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-dark flex flex-col font-sans">
            <Head title="Selamat Datang" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* School Logo & Title */}
                        <div className="flex items-center space-x-4">
                            <img 
                                src="/images/logo-SMKN1-Bawang.png" 
                                alt="Logo SMKN 1 Bawang" 
                                className="h-14 w-auto object-contain hover:scale-105 transition-transform duration-300"
                            />
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold text-navy tracking-tight leading-none">
                                    SMKN 1 Bawang
                                </h1>
                                <p className="text-xs text-gray-500 mt-1 font-medium">
                                    Sistem Manajemen Ekstrakurikuler
                                </p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#tentang" className="text-gray-600 hover:text-navy font-semibold transition-colors duration-200">Tentang</a>
                            <a href="#fitur" className="text-gray-600 hover:text-navy font-semibold transition-colors duration-200">Fitur Utama</a>
                            <a href="#kategori" className="text-gray-600 hover:text-navy font-semibold transition-colors duration-200">Kategori Ekskul</a>
                            <a 
                                href="/login" 
                                className="inline-flex items-center px-6 h-12 bg-navy text-white hover:bg-navy/95 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Masuk Aplikasi
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-600 hover:text-navy focus:outline-none p-2 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-3 animate-fade-in">
                        <a 
                            href="#tentang" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-navy font-semibold transition-all"
                        >
                            Tentang
                        </a>
                        <a 
                            href="#fitur" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-navy font-semibold transition-all"
                        >
                            Fitur Utama
                        </a>
                        <a 
                            href="#kategori" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-navy font-semibold transition-all"
                        >
                            Kategori Ekskul
                        </a>
                        <div className="pt-2">
                            <a 
                                href="/login" 
                                className="flex justify-center items-center w-full h-12 bg-navy text-white rounded-xl font-bold shadow-md"
                            >
                                Masuk Aplikasi
                            </a>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-white via-blue-50/20 to-yellow-50/25 py-20 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <span className="inline-flex items-center px-4 py-1.5 bg-yellow-100/70 border border-yellow-200 text-yellow-800 text-xs font-bold rounded-full tracking-wider uppercase">
                                🌟 SMKN 1 Bawang Unggul
                            </span>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy leading-tight tracking-tight">
                                Kembangkan Minat & Bakatmu Bersama Kami
                            </h2>
                            <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto lg:mx-0">
                                Kelola pendaftaran, lihat jadwal kegiatan, absensi, hingga rekapitulasi nilai akhir ekstrakurikuler SMKN 1 Bawang dalam satu platform terintegrasi.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-4">
                                <a 
                                    href="/login" 
                                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 h-14 bg-navy text-white hover:bg-navy/95 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Mulai Pendaftaran
                                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </a>
                                <a 
                                    href="#tentang" 
                                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 h-14 bg-white text-gray-700 hover:text-navy border-2 border-gray-200 hover:border-navy/20 rounded-full font-bold transition-all duration-200"
                                >
                                    Pelajari Selengkapnya
                                </a>
                            </div>
                        </div>
                        
                        <div className="mt-16 lg:mt-0 lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-md">
                                {/* Decorative elements */}
                                <div className="absolute -top-12 -left-12 w-64 h-64 bg-yellow-200/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
                                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl -z-10"></div>
                                
                                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                                        <h3 className="font-bold text-navy">27 Ekstrakurikuler Aktif</h3>
                                        <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2.5 py-1 rounded-full">
                                            TA 2026/2027
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { name: "Pramuka Wijaya", cat: "Bela Negara", color: "#124272", count: "140 Siswa" },
                                            { name: "Ekskul Olahraga", cat: "Futsal / Basket", color: "#fda800", count: "85 Siswa" },
                                            { name: "Klub IT & Robotik", cat: "Teknologi", color: "#00a2e9", count: "48 Siswa" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl hover:bg-gray-100/50 transition-colors duration-200">
                                                <div className="flex items-center space-x-3.5">
                                                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-800">{item.name}</p>
                                                        <p className="text-xs text-gray-500 font-semibold">{item.cat}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-navy bg-navy/5 px-3 py-1.5 rounded-xl">{item.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About / Banner Section */}
            <section id="tentang" className="py-20 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">Tentang Aplikasi</h2>
                        <h3 className="text-3xl font-black text-navy">Satu Sekolah, Satu Server, Satu Database</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            Sistem Manajemen Ekstrakurikuler SMKN 1 Bawang dibangun khusus untuk memfasilitasi koordinasi dan administrasi 27 jenis ekstrakurikuler sekolah. Membantu memudahkan pengurus dan pembina mengevaluasi minat siswa secara berkala dan terstruktur.
                        </p>
                    </div>

                    {/* School Mascot/Banners */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
                        {[
                            { img: "/images/logo-pendidikan.png", title: "Tut Wuri Handayani", desc: "Pendidikan berlandaskan budi pekerti luhur" },
                            { img: "/images/SMK-Bisa-Hebat.png", title: "SMK Bisa Hebat", desc: "Mencetak lulusan terampil, kompeten, dan siap kerja" },
                            { img: "/images/Sekolah-Berintegritas.png", title: "Sekolah Berintegritas", desc: "Menjunjung tinggi nilai kejujuran dan disiplin" }
                        ].map((m, idx) => (
                            <div key={idx} className="bg-gray-50 border border-gray-100/50 rounded-3xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="h-28 flex items-center justify-center mb-4">
                                    <img src={m.img} alt={m.title} className="max-h-24 w-auto object-contain" />
                                </div>
                                <h4 className="font-bold text-navy mb-1">{m.title}</h4>
                                <p className="text-xs text-gray-500 font-semibold">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="fitur" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">
                            Sistem Terintegrasi
                        </span>
                        <h2 className="text-3xl font-black text-navy">Kemudahan Layanan Ekstrakurikuler</h2>
                        <p className="text-gray-600 font-medium">Fitur lengkap dirancang khusus untuk kebutuhan administrasi sekolah modern.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:border-transparent transition-all duration-300 hover:-translate-y-1 group">
                                <div className="w-12 h-12 bg-secondary/10 group-hover:bg-secondary group-hover:text-white text-secondary rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold text-navy mb-3 group-hover:text-secondary transition-colors duration-200">{f.title}</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section id="kategori" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-black text-navy">Kategori Ekstrakurikuler</h2>
                        <p className="text-gray-600 mt-2 font-medium">Temukan bidang kegemaranmu dan bergabunglah sekarang.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {ekskulCategories.map((c, idx) => (
                            <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <span className="text-4xl block mb-4">{c.icon}</span>
                                <h3 className="font-bold text-navy text-sm mb-1">{c.name}</h3>
                                <span className="text-xs text-gray-500 font-semibold">{c.count} Ekskul</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-navy text-white/90 pt-16 pb-8 border-t border-navy/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <img src="/images/logo-SMKN1-Bawang.png" alt="SMK" className="h-12 w-auto brightness-0 invert" />
                                <div>
                                    <h4 className="font-black tracking-wide">SMKN 1 Bawang</h4>
                                    <p className="text-xs text-white/50 font-medium">Banjarnegara, Jawa Tengah</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed font-medium">
                                Sekolah Menengah Kejuruan Negeri 1 Bawang terus berkomitmen dalam melahirkan generasi tangguh yang mandiri dan berintegritas tinggi.
                            </p>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-white tracking-wider text-sm uppercase">Tautan Penting</h4>
                            <ul className="space-y-2 text-sm text-white/70 font-semibold">
                                <li><a href="#tentang" className="hover:text-primary transition-colors">Tentang Sekolah</a></li>
                                <li><a href="#fitur" className="hover:text-primary transition-colors">Fitur Sistem</a></li>
                                <li><a href="#kategori" className="hover:text-primary transition-colors">Kategori Kegiatan</a></li>
                                <li><a href="/login" className="hover:text-primary transition-colors">Akses Aplikasi</a></li>
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-white tracking-wider text-sm uppercase">Kontak Kami</h4>
                            <p className="text-sm text-white/75 font-medium leading-relaxed">
                                Jl. Raya Mayjend. Panjaitan No. 1, Bawang, Kec. Bawang, Kab. Banjarnegara, Jawa Tengah 53471
                            </p>
                            {/* Social Media Icons */}
                            <div className="flex space-x-4 pt-2">
                                {[
                                    { img: "/images/facebook.png", link: "#" },
                                    { img: "/images/instagram.png", link: "#" },
                                    { img: "/images/tiktok.png.png", link: "#" },
                                    { img: "/images/youtube.png", link: "#" }
                                ].map((soc, idx) => (
                                    <a key={idx} href={soc.link} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200">
                                        <img src={soc.img} alt="Social Icon" className="w-5 h-5 object-contain brightness-0 invert" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 font-medium">
                        <p>© 2026 SMKN 1 Bawang. All rights reserved.</p>
                        <p className="mt-2 sm:mt-0">Sistem Manajemen Ekstrakurikuler v1.0.0</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
