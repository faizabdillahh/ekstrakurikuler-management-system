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
        // 1. pengumuman
        Schema::create('pengumuman', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('ekskul_ta_id');
            $table->foreign('ekskul_ta_id')
                  ->references('id')
                  ->on('ekskul_tahun_ajaran')
                  ->onDelete('restrict');

            $table->string('judul', 255);
            $table->text('konten');
            $table->dateTime('dijadwalkan_pada')->nullable();
            $table->dateTime('diterbitkan_pada')->nullable();

            $table->uuid('dibuat_oleh');
            $table->foreign('dibuat_oleh')
                  ->references('id')
                  ->on('users')
                  ->onDelete('restrict');

            $table->timestamps();
        });

        // 2. lampiran_pengumuman
        Schema::create('lampiran_pengumuman', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('pengumuman_id');
            $table->foreign('pengumuman_id')
                  ->references('id')
                  ->on('pengumuman')
                  ->onDelete('cascade');

            $table->string('nama_file', 255);
            $table->string('path', 500);
            $table->string('mime_type', 50);
            $table->integer('ukuran_bytes');
            $table->timestamp('created_at')->useCurrent();
        });

        // 3. event
        Schema::create('event', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('ekskul_ta_id');
            $table->foreign('ekskul_ta_id')
                  ->references('id')
                  ->on('ekskul_tahun_ajaran')
                  ->onDelete('restrict');

            $table->string('judul', 255);
            $table->text('deskripsi');
            $table->dateTime('tanggal_mulai');
            $table->dateTime('tanggal_selesai')->nullable();
            $table->string('lokasi', 255)->nullable();
            $table->string('link_wa_eo', 500)->nullable();

            $table->uuid('dibuat_oleh');
            $table->foreign('dibuat_oleh')
                  ->references('id')
                  ->on('users')
                  ->onDelete('restrict');

            $table->timestamps();
        });

        // 4. dokumentasi_event
        Schema::create('dokumentasi_event', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('event_id');
            $table->foreign('event_id')
                  ->references('id')
                  ->on('event')
                  ->onDelete('cascade');

            $table->string('path', 500);
            $table->string('caption', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        // 5. album_foto
        Schema::create('album_foto', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('ekskul_id');
            $table->foreign('ekskul_id')
                  ->references('id')
                  ->on('ekskul')
                  ->onDelete('restrict');

            $table->string('judul', 255);
            $table->text('deskripsi')->nullable();

            $table->uuid('dibuat_oleh');
            $table->foreign('dibuat_oleh')
                  ->references('id')
                  ->on('users')
                  ->onDelete('restrict');

            $table->timestamps();
        });

        // 6. foto
        Schema::create('foto', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('album_foto_id');
            $table->foreign('album_foto_id')
                  ->references('id')
                  ->on('album_foto')
                  ->onDelete('cascade');

            $table->string('path', 500);
            $table->string('caption', 255)->nullable();
            $table->integer('urutan')->default(0);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foto');
        Schema::dropIfExists('album_foto');
        Schema::dropIfExists('dokumentasi_event');
        Schema::dropIfExists('event');
        Schema::dropIfExists('lampiran_pengumuman');
        Schema::dropIfExists('pengumuman');
    }
};
