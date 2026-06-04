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
        // 1. anggota
        Schema::create('anggota', function (Blueprint $table) {
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

            $table->enum('status', ['aktif', 'dikeluarkan'])->default('aktif');
            $table->date('tanggal_bergabung');
            $table->date('tanggal_dikeluarkan')->nullable();

            $table->uuid('dikeluarkan_oleh')->nullable();
            $table->foreign('dikeluarkan_oleh')
                  ->references('id')
                  ->on('users')
                  ->onDelete('restrict');

            $table->enum('sumber', ['seleksi', 'manual'])->default('seleksi');
            $table->timestamps();

            // Constraints & Indexes
            $table->unique(['user_id', 'ekskul_ta_id'], 'uq_anggota_user_ekskul_ta');
            $table->index('status', 'idx_anggota_status');
        });

        // 2. struktur_organisasi
        Schema::create('struktur_organisasi', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('ekskul_ta_id');
            $table->foreign('ekskul_ta_id')
                  ->references('id')
                  ->on('ekskul_tahun_ajaran')
                  ->onDelete('restrict');

            $table->uuid('anggota_id');
            $table->foreign('anggota_id')
                  ->references('id')
                  ->on('anggota')
                  ->onDelete('restrict');

            $table->string('jabatan', 100);
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });

        // 3. admin_ekskul_assignments
        Schema::create('admin_ekskul_assignments', function (Blueprint $table) {
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

            $table->uuid('ditugaskan_oleh');
            $table->foreign('ditugaskan_oleh')
                  ->references('id')
                  ->on('users')
                  ->onDelete('restrict');

            $table->timestamps();

            // Constraints
            $table->unique(['user_id', 'ekskul_ta_id'], 'uq_admin_ekskul_assignment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_ekskul_assignments');
        Schema::dropIfExists('struktur_organisasi');
        Schema::dropIfExists('anggota');
    }
};
