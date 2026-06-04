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
        // 1. periode_pendaftaran
        Schema::create('periode_pendaftaran', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->uuid('tahun_ajaran_id')->unique();
            $table->foreign('tahun_ajaran_id')
                  ->references('id')
                  ->on('tahun_ajaran')
                  ->onDelete('restrict');

            $table->dateTime('tanggal_buka');
            $table->dateTime('tanggal_tutup');
            $table->timestamps();
        });

        // 2. pendaftaran
        Schema::create('pendaftaran', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->uuid('user_id');
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('restrict');

            $table->uuid('ekskul_ta_id');
            $table->foreign('ekskul_ta_id')
                  ->references('id')
                  ->on('ekskul_tahun_ajaran')
                  ->onDelete('restrict');

            $table->enum('status', ['dalam_review', 'diterima', 'ditolak'])->default('dalam_review');
            $table->text('catatan_internal')->nullable();

            $table->uuid('diputuskan_oleh')->nullable();
            $table->foreign('diputuskan_oleh')
                  ->references('id')
                  ->on('users')
                  ->onDelete('restrict');

            $table->timestamp('diputuskan_pada')->nullable();
            $table->timestamps();

            // Constraints & Indexes
            $table->unique(['user_id', 'ekskul_ta_id'], 'uq_pendaftaran_user_ekskul_ta');
            $table->index('status', 'idx_pendaftaran_status');
        });

        // 3. sertifikat
        Schema::create('sertifikat', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->uuid('pendaftaran_id');
            $table->foreign('pendaftaran_id')
                  ->references('id')
                  ->on('pendaftaran')
                  ->onDelete('cascade');

            $table->string('nama_file', 255);
            $table->string('path', 500);
            $table->string('mime_type', 50);
            $table->integer('ukuran_bytes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sertifikat');
        Schema::dropIfExists('pendaftaran');
        Schema::dropIfExists('periode_pendaftaran');
    }
};
