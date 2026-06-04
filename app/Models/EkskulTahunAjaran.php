<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EkskulTahunAjaran extends Model
{
    use HasUuidV7;

    protected $table = 'ekskul_tahun_ajaran';

    protected $fillable = [
        'ekskul_id',
        'tahun_ajaran_id',
        'kuota_anggota',
        'is_pendaftaran_dibuka',
        'is_seleksi_final',
    ];

    protected $casts = [
        'is_pendaftaran_dibuka' => 'boolean',
        'is_seleksi_final' => 'boolean',
        'kuota_anggota' => 'integer',
    ];

    /**
     * Get the master extracurricular record.
     */
    public function ekskul(): BelongsTo
    {
        return $this->belongsTo(Ekskul::class, 'ekskul_id');
    }

    /**
     * Get the school year record.
     */
    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    /**
     * Get the registrations for this yearly extracurricular.
     */
    public function pendaftaran(): HasMany
    {
        return $this->hasMany(Pendaftaran::class, 'ekskul_ta_id');
    }

    /**
     * Get the members for this yearly extracurricular.
     */
    public function anggota(): HasMany
    {
        return $this->hasMany(Anggota::class, 'ekskul_ta_id');
    }

    /**
     * Get the schedules for this yearly extracurricular.
     */
    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'ekskul_ta_id');
    }

    /**
     * Get the announcements for this yearly extracurricular.
     */
    public function pengumuman(): HasMany
    {
        return $this->hasMany(Pengumuman::class, 'ekskul_ta_id');
    }

    /**
     * Get the events for this yearly extracurricular.
     */
    public function event(): HasMany
    {
        return $this->hasMany(Event::class, 'ekskul_ta_id');
    }

    /**
     * Get the admin assignments for this yearly extracurricular.
     */
    public function adminAssignments(): HasMany
    {
        return $this->hasMany(AdminEkskulAssignment::class, 'ekskul_ta_id');
    }
}
