<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. notifikasi
        Schema::create('notifikasi', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('user_id');
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            $table->enum('tipe', [
                'pendaftaran_berhasil',
                'jadwal_berubah',
                'seleksi_diterima',
                'seleksi_ditolak',
                'pengumuman',
                'umum'
            ]);

            $table->string('judul', 255);
            $table->text('pesan');
            $table->string('link', 500)->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('created_at')->useCurrent();

            // Indexes
            $table->index(['user_id', 'is_read'], 'idx_notifikasi_user_read');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifikasi');
    }
};
