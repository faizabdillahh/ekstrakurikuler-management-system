import React from 'react';
import { Head, usePage } from '@inertiajs/react';

interface SharedProps {
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: any;
}

export default function Login() {
    const { props } = usePage<SharedProps>();
    const { flash } = props;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/10 to-yellow-50/15 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <Head title="Masuk Aplikasi" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
                {/* School Logo */}
                <div className="flex justify-center">
                    <a href="/" className="hover:scale-105 transition-transform duration-300">
                        <img
                            className="h-20 w-auto object-contain"
                            src="/images/logo-SMKN1-Bawang.png"
                            alt="Logo SMKN 1 Bawang"
                        />
                    </a>
                </div>

                <div>
                    <h2 className="text-2xl font-black text-navy tracking-tight">
                        SMKN 1 Bawang
                    </h2>
                    <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">
                        Sistem Manajemen Ekstrakurikuler
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white border border-gray-100 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 relative overflow-hidden">
                    {/* Top Decorative Border */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>

                    {/* Alert Banner for Errors */}
                    {flash.error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-800 text-sm font-medium animate-shake">
                            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{flash.error}</span>
                        </div>
                    )}

                    {flash.success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start space-x-3 text-green-800 text-sm font-medium">
                            <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{flash.success}</span>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-600">
                                Selamat datang di portal resmi ekstrakurikuler. Silakan masuk menggunakan akun Google Workspace sekolah Anda.
                            </p>
                        </div>

                        {/* Google Login Button */}
                        <div>
                            <a
                                href="/auth/google"
                                className="w-full flex items-center justify-center px-6 py-3.5 border border-gray-200 rounded-2xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none"
                            >
                                <svg className="h-5 w-5 mr-3 shrink-0" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-1.14 2.76-2.4 3.61v3h3.86c2.26-2.08 3.59-5.16 3.59-8.44z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.32v3.1A11.967 11.967 0 0 0 12 24z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.24 14.24A7.16 7.16 0 0 1 4.8 12c0-.79.13-1.57.38-2.31v-3.1H1.32A11.97 11.97 0 0 0 0 12c0 2.34.67 4.53 1.83 6.39l3.41-2.15z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0A11.967 11.967 0 0 0 1.32 6.9l3.41 3.1c.95-2.88 3.61-5.01 6.76-5.01z"
                                    />
                                </svg>
                                Masuk dengan Google Sekolah
                            </a>
                        </div>

                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-3 text-gray-400 font-semibold uppercase tracking-wider">
                                Aturan Keamanan
                            </span>
                        </div>

                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2 text-xs text-gray-500 font-medium leading-relaxed">
                            <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 bg-navy rounded-full shrink-0"></span>
                                <span>Hanya diizinkan menggunakan email dengan domain <strong>@smkn1bawang.sch.id</strong></span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 bg-navy rounded-full shrink-0"></span>
                                <span>Akun siswa dan pembina harus sudah diimpor oleh pengelola sistem</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
