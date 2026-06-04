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
        // 1. tahun_ajaran
        Schema::create('tahun_ajaran', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama', 20)->unique();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->boolean('is_aktif')->default(false);
            $table->boolean('is_archived')->default(false);
            
            // Enforce only one row with is_aktif = true
            $table->boolean('is_aktif_unique')->virtualAs('CASE WHEN is_aktif = 1 THEN 1 ELSE NULL END')->nullable();
            $table->unique('is_aktif_unique', 'unique_active_tahun_ajaran');

            $table->timestamps();
        });

        // 2. ekskul
        Schema::create('ekskul', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama', 100);
            $table->string('kategori', 50);
            $table->text('deskripsi')->nullable();
            $table->string('logo_url', 500)->nullable();
            $table->string('warna_primer', 7)->default('#fff000');
            $table->string('warna_sekunder', 7)->default('#00a2e9');
            $table->json('media_sosial')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. ekskul_tahun_ajaran
        Schema::create('ekskul_tahun_ajaran', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->uuid('ekskul_id');
            $table->foreign('ekskul_id')
                  ->references('id')
                  ->on('ekskul')
                  ->onDelete('restrict');

            $table->uuid('tahun_ajaran_id');
            $table->foreign('tahun_ajaran_id')
                  ->references('id')
                  ->on('tahun_ajaran')
                  ->onDelete('restrict');

            $table->integer('kuota_anggota')->nullable();
            $table->boolean('is_pendaftaran_dibuka')->default(false);
            $table->boolean('is_seleksi_final')->default(false);
            $table->timestamps();

            // Constraints
            $table->unique(['ekskul_id', 'tahun_ajaran_id'], 'uq_ekskul_tahun_ajaran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ekskul_tahun_ajaran');
        Schema::dropIfExists('ekskul');
        Schema::dropIfExists('tahun_ajaran');
    }
};
