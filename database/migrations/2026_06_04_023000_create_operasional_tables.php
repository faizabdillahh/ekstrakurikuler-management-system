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
        // 1. sesi_absensi
        Schema::create('sesi_absensi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->uuid('ekskul_ta_id');
            $table->foreign('ekskul_ta_id')
                  ->references('id')
                  ->on('ekskul_tahun_ajaran')
                  ->onDelete('restrict');

            $table->date('tanggal');
            $table->string('keterangan', 255)->nullable();

            $table->uuid('dibuat_oleh');
            $table->foreign('dibuat_oleh')
                  ->references('id')
                  ->on('users')
                  ->onDelete('restrict');

            $table->timestamps();
        });

        // 2. absensi
        Schema::create('absensi', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('sesi_absensi_id');
            $table->foreign('sesi_absensi_id')
                  ->references('id')
                  ->on('sesi_absensi')
                  ->onDelete('cascade');

            $table->uuid('anggota_id');
            $table->foreign('anggota_id')
                  ->references('id')
                  ->on('anggota')
                  ->onDelete('restrict');

            $table->enum('status', ['hadir', 'izin', 'sakit', 'alfa']);
            $table->timestamps();

            // Constraints
            $table->unique(['sesi_absensi_id', 'anggota_id'], 'uq_absensi_sesi_anggota');
        });

        // 3. penilaian
        Schema::create('penilaian', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('anggota_id')->unique();
            $table->foreign('anggota_id')
                  ->references('id')
                  ->on('anggota')
                  ->onDelete('restrict');

            $table->decimal('nilai_akhir', 5, 2);

            $table->uuid('dinilai_oleh');
            $table->foreign('dinilai_oleh')
                  ->references('id')
                  ->on('users')
                  ->onDelete('restrict');

            $table->timestamps();
        });

        // 4. jadwal
        Schema::create('jadwal', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('ekskul_ta_id');
            $table->foreign('ekskul_ta_id')
                  ->references('id')
                  ->on('ekskul_tahun_ajaran')
                  ->onDelete('restrict');

            $table->enum('hari', ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']);
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->string('lokasi', 255)->nullable();
            $table->string('keterangan', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal');
        Schema::dropIfExists('penilaian');
        Schema::dropIfExists('absensi');
        Schema::dropIfExists('sesi_absensi');
    }
};
